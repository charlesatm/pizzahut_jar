import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { showThanks } from "@/components/share-thanks-toast";
import { Button } from "@/components/ui/button";
import { grabCode, markInvalid, markUsed, thankCode, type PromoCode } from "@/lib/codes";
import { useThanksStore } from "@/lib/thanks-store";
import { cn, copyText } from "@/lib/utils";

function formatExpiry(value: string | null) {
  if (!value) return null;
  const date = parseISO(value);
  if (!isValid(date)) return null;
  return format(date, "d MMM yyyy");
}

export function CodeTicket({ code }: { code: PromoCode }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLParagraphElement>(null);
  const hasThanked = useThanksStore((s) => s.hasThanked(code.id));
  const markThanked = useThanksStore((s) => s.markThanked);
  const closed = code.status !== "open";

  function patch(next: Partial<PromoCode>) {
    queryClient.setQueriesData<PromoCode[]>({ queryKey: ["codes"] }, (old) =>
      old?.map((row) => (row.id === code.id ? { ...row, ...next } : row)),
    );
  }

  const grab = useMutation({
    mutationFn: () => grabCode({ data: { id: code.id } }),
    onSuccess: (res) => patch({ grabs: res.grabs }),
    onError: (err: Error) => toast.error(err.message || "Could not record that grab."),
  });
  const used = useMutation({
    mutationFn: () => markUsed({ data: { id: code.id } }),
    onMutate: () => patch({ status: "claimed" }),
    onSuccess: () => showThanks("used"),
    onError: (err: Error) => {
      toast.error(err.message || "Could not mark that used.");
      void queryClient.invalidateQueries({ queryKey: ["codes"] });
    },
  });
  const invalid = useMutation({
    mutationFn: () => markInvalid({ data: { id: code.id } }),
    onMutate: () => patch({ status: "invalid" }),
    onSuccess: () => showThanks("invalid"),
    onError: (err: Error) => {
      toast.error(err.message || "Could not mark that no good.");
      void queryClient.invalidateQueries({ queryKey: ["codes"] });
    },
  });
  const thanks = useMutation({
    mutationFn: () => thankCode({ data: { id: code.id } }),
    onMutate: () => {
      markThanked(code.id);
      patch({ thanks: code.thanks + 1 });
    },
    onSuccess: (res) => {
      patch({ thanks: res.thanks });
      toast.success("Thanks sent.");
    },
    onError: (err: Error) => toast.error(err.message || "Could not send thanks."),
  });

  async function handleCopy() {
    let copiedOk = false;
    try {
      copiedOk = await copyText(code.code);
    } catch {
      copiedOk = false;
    }
    if (!copiedOk && codeRef.current) {
      try {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      } catch {
        // iframe copy fallback
      }
    }
    if (!closed) grab.mutate();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    if (copiedOk) toast.success("Copied.");
    else toast.message("Code selected — copy it with your keyboard.");
  }

  const expiry = formatExpiry(code.expires_at);

  return (
    <article className={cn("code-card p-5", closed && "opacity-60")}>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="w-full text-left"
        aria-label={`Copy code ${code.code}`}
      >
        <p ref={codeRef} className="font-mono text-xl font-medium tracking-[0.14em]">
          {code.code}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{copied ? "Copied" : code.discount}</p>
      </button>

      <p className="mt-4 text-sm text-muted-foreground">
        {expiry ? `Expires ${expiry}` : "No expiry"}
      </p>

      {code.status === "open" ? (
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button type="button" size="sm" onClick={() => void handleCopy()} className="min-h-11">
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={used.isPending}
            onClick={() => used.mutate()}
            className="min-h-11"
          >
            Used
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={invalid.isPending}
            onClick={() => invalid.mutate()}
            className="min-h-11 text-muted-foreground"
          >
            No good
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={hasThanked || thanks.isPending}
            onClick={() => thanks.mutate()}
            className="min-h-11"
          >
            {hasThanked ? "Thanked" : "Thanks"}
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {code.status === "claimed" ? "Used" : "No good"}
        </p>
      )}
    </article>
  );
}
