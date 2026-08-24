import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { grabCode, markInvalid, markUsed, type PromoCode } from "@/lib/codes";
import { cn, copyText } from "@/lib/utils";

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
  const state =
    code.status === "open"
      ? { theme: "unused", label: "Unused" }
      : code.status === "claimed"
        ? { theme: "used", label: "Used" }
        : code.status === "expired"
          ? { theme: "invalid", label: "Expired" }
          : { theme: "invalid", label: "Not good" };

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
    onSuccess: () => toast.success("Marked as used."),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });
  const invalid = useMutation({
    mutationFn: () => markInvalid({ data: { id: code.id } }),
    onMutate: () => patch({ status: "invalid" }),
    onSuccess: () => toast.success("Marked as not good."),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });

  async function handleCopy() {
    const ok = await copyText(code.code).catch(() => false);
    if (!closed) grab.mutate();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    toast[ok ? "success" : "message"](ok ? "Copied." : "Select and copy the code.");
  }

  return (
    <article className={cn("code-list-card", `code-list-card-${state.theme}`)}>
      <div className="code-card-heading">
        <span className="code-status">{state.label}</span>
        <span className="code-expiry">
          {code.expires_at ? formatDay(code.expires_at) : "No expiry"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="code-card-copy"
        aria-label={`Copy ${code.code}`}
      >
        <p className="code-card-value">{copied ? "COPIED" : code.code}</p>
        <p className="code-card-deal">{code.discount}</p>
      </button>
      {code.status === "open" ? (
        <div className="code-card-actions">
          <button
            type="button"
            className="code-card-action code-card-action-used"
            disabled={used.isPending || invalid.isPending}
            onClick={() => used.mutate()}
          >
            Mark used
          </button>
          <button
            type="button"
            className="code-card-action code-card-action-invalid"
            disabled={used.isPending || invalid.isPending}
            onClick={() => invalid.mutate()}
          >
            Not good
          </button>
        </div>
      ) : (
        <p className="code-card-state-copy">
          {code.status === "claimed"
            ? "This code has been used."
            : code.status === "expired"
              ? "This code has expired."
              : "Reported as not working."}
        </p>
      )}
    </article>
  );
}
