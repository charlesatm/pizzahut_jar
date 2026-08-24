import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { grabCode, markInvalid, markUsed, type PromoCode } from "@/lib/codes";
import { copyText } from "@/lib/utils";

function formatDay(value: string | null) {
  if (!value) return "";
  const date = parseISO(value.slice(0, 10));
  if (!isValid(date)) return "";
  return format(date, "MMM d, yyyy");
}

export function CodeCard({ code }: { code: PromoCode }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const closed = code.status !== "open";

  function patch(next: Partial<PromoCode>) {
    queryClient.setQueriesData<PromoCode[]>({ queryKey: ["codes"] }, (old) =>
      old?.map((row) => (row.id === code.id ? { ...row, ...next } : row)),
    );
  }

  const grab = useMutation({
    mutationFn: () => grabCode({ data: { id: code.id } }),
    onSuccess: (res) => patch({ grabs: res.grabs }),
  });
  const used = useMutation({
    mutationFn: () => markUsed({ data: { id: code.id } }),
    onMutate: () => patch({ status: "claimed" }),
    onError: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });
  const invalid = useMutation({
    mutationFn: () => markInvalid({ data: { id: code.id } }),
    onMutate: () => patch({ status: "invalid" }),
    onError: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });

  async function handleCopy() {
    const ok = await copyText(code.code).catch(() => false);
    if (!closed) grab.mutate();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    toast[ok ? "success" : "message"](ok ? "Copied." : "Select and copy the code.");
  }

  return (
    <article className="code-list-card">
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="w-full text-left"
        aria-label={`Copy ${code.code}`}
      >
        <p className="font-mono text-sm font-semibold tracking-wide text-card-foreground">
          {copied ? "COPIED" : code.code}
        </p>
        <p className="mt-1 text-xs text-card-foreground/65">{code.discount}</p>
        <p className="mt-1 text-xs text-card-foreground/45">
          {code.expires_at ? `Expires ${formatDay(code.expires_at)}` : "Shared"}
        </p>
      </button>
      {code.status === "open" ? (
        <div className="mt-4 flex gap-4 text-xs text-card-foreground/55">
          <button
            type="button"
            className="min-h-11 transition-colors hover:text-card-foreground"
            onClick={() => used.mutate()}
          >
            Used
          </button>
          <button
            type="button"
            className="min-h-11 transition-colors hover:text-card-foreground"
            onClick={() => invalid.mutate()}
          >
            No good
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-card-foreground/45">
          {code.status === "claimed" ? "Used" : "No good"}
        </p>
      )}
    </article>
  );
}
