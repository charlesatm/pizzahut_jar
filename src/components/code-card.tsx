import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getOwnerToken, removeOwnerToken } from "@/lib/code-ownership";
import {
  deleteCode,
  grabCode,
  markInvalid,
  markUsed,
  updateCode,
  type PromoCode,
} from "@/lib/codes";
import { defaultExpiresAt, defaultGesExpiresAt, todayIso } from "@/lib/expiry";
import { showThanks } from "@/lib/show-thanks";
import { cn, copyText } from "@/lib/utils";

function formatDay(value: string | null) {
  if (!value) return "";
  const date = parseISO(value.slice(0, 10));
  if (!isValid(date)) return "";
  return format(date, "MMM d, yyyy");
}

export function CodeCard({ code }: { code: PromoCode }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState<"single" | "validation" | "survey" | "both" | null>(null);
  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [draftCode, setDraftCode] = useState(code.code);
  const [draftSurveyCode, setDraftSurveyCode] = useState(code.note);
  const [draftExpiresAt, setDraftExpiresAt] = useState(
    code.expires_at?.slice(0, 10) ??
      (code.offer_type === "ges" ? defaultGesExpiresAt() : defaultExpiresAt()),
  );
  const closed = code.status !== "open";
  const isGes = code.offer_type === "ges";
  const state =
    code.status === "open"
      ? { theme: "unused", label: "Unused" }
      : code.status === "claimed"
        ? { theme: "used", label: "Used" }
        : code.status === "expired"
          ? { theme: "invalid", label: "Expired" }
          : { theme: "invalid", label: "Not good" };

  useEffect(() => {
    setOwnerToken(getOwnerToken(code.id));
  }, [code.id]);

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
    onSuccess: () => showThanks("used"),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });
  const invalid = useMutation({
    mutationFn: () => markInvalid({ data: { id: code.id } }),
    onMutate: () => patch({ status: "invalid" }),
    onSuccess: () => showThanks("invalid"),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });
  const update = useMutation({
    mutationFn: ({
      nextCode,
      nextSurveyCode,
      nextExpiry,
    }: {
      nextCode: string;
      nextSurveyCode: string;
      nextExpiry: string;
    }) => {
      if (!ownerToken) throw new Error("This browser cannot manage that code.");
      return updateCode({
        data: {
          id: code.id,
          owner_token: ownerToken,
          code: nextCode,
          offer_type: code.offer_type,
          survey_code: nextSurveyCode,
          expires_at: nextExpiry,
        },
      });
    },
    onSuccess: (updated) => {
      patch(updated);
      setEditing(false);
      toast.success("Updated, machan.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });
  const remove = useMutation({
    mutationFn: () => {
      if (!ownerToken) throw new Error("This browser cannot manage that code.");
      return deleteCode({ data: { id: code.id, owner_token: ownerToken } });
    },
    onSuccess: () => {
      removeOwnerToken(code.id);
      queryClient.setQueriesData<PromoCode[]>({ queryKey: ["codes"] }, (old) =>
        old?.filter((row) => row.id !== code.id),
      );
      toast.success("Gone, machan.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not delete that code."),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["codes"] }),
  });

  async function handleCopy(
    value: string,
    target: "single" | "validation" | "survey" | "both",
    successMessage: string,
  ) {
    const ok = await copyText(value).catch(() => false);
    if (!closed) grab.mutate();
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1600);
    toast[ok ? "success" : "message"](ok ? successMessage : "Copy was blocked by this browser.");
  }

  function startEditing() {
    setDraftCode(code.code);
    setDraftSurveyCode(code.note);
    setDraftExpiresAt(
      code.expires_at?.slice(0, 10) ??
        (code.offer_type === "ges" ? defaultGesExpiresAt() : defaultExpiresAt()),
    );
    setConfirmingDelete(false);
    setEditing(true);
  }

  function handleUpdate(event: FormEvent) {
    event.preventDefault();
    update.mutate({
      nextCode: draftCode,
      nextSurveyCode: draftSurveyCode,
      nextExpiry: draftExpiresAt,
    });
  }

  const statusPending = used.isPending || invalid.isPending;

  return (
    <article className={cn("code-list-card", `code-list-card-${state.theme}`)}>
      <div className="code-card-heading">
        <div className="code-card-badges">
          <span className="code-offer">{isGes ? "GES 20%" : "Loyalty 15%"}</span>
          <span className="code-status">{state.label}</span>
        </div>
        <span className="code-expiry">
          {code.expires_at ? formatDay(code.expires_at) : "No expiry"}
        </span>
      </div>
      {editing ? (
        <form className="code-owner-form" onSubmit={handleUpdate}>
          {isGes ? (
            <label className="code-owner-field">
              <span>GES Survey code</span>
              <input
                value={draftSurveyCode}
                onChange={(event) => setDraftSurveyCode(event.target.value)}
                required
                minLength={3}
                maxLength={64}
                autoComplete="off"
              />
            </label>
          ) : null}
          <label className="code-owner-field">
            <span>{isGes ? "Validation code" : "Loyalty code"}</span>
            <input
              value={draftCode}
              onChange={(event) => setDraftCode(event.target.value)}
              required
              minLength={3}
              maxLength={40}
              autoComplete="off"
            />
          </label>
          <label className="code-owner-field">
            <span>Expires</span>
            <input
              type="date"
              min={todayIso()}
              value={draftExpiresAt}
              onChange={(event) => setDraftExpiresAt(event.target.value)}
              required
            />
          </label>
          <div className="code-owner-form-actions">
            <button type="button" onClick={() => setEditing(false)} disabled={update.isPending}>
              Cancel
            </button>
            <button type="submit" className="code-owner-save" disabled={update.isPending}>
              {update.isPending ? "Saving" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          {isGes ? (
            <div className="code-card-ges-copy">
              <div className="code-card-ges-copy-grid">
                <button
                  type="button"
                  className="code-card-copy-field"
                  onClick={() =>
                    void handleCopy(code.code, "validation", "Validation code copied.")
                  }
                  aria-label={`Copy validation code ${code.code}`}
                >
                  <span>
                    <span className="code-card-field-label">Validation code</span>
                    <span className="code-card-value">
                      {copied === "validation" ? "COPIED" : code.code}
                    </span>
                  </span>
                  {copied === "validation" ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  className="code-card-copy-field"
                  onClick={() => void handleCopy(code.note, "survey", "GES Survey code copied.")}
                  aria-label={`Copy GES Survey code ${code.note}`}
                >
                  <span>
                    <span className="code-card-field-label">GES Survey code</span>
                    <span className="code-card-secondary-value">
                      {copied === "survey" ? "COPIED" : code.note}
                    </span>
                  </span>
                  {copied === "survey" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </button>
              </div>
              <div className="code-card-ges-copy-footer">
                <p className="code-card-deal">{code.discount}</p>
                <button
                  type="button"
                  className="code-card-copy-all"
                  onClick={() =>
                    void handleCopy(
                      `GES Survey Code: ${code.note}\nValidation Code: ${code.code}`,
                      "both",
                      "Both codes copied.",
                    )
                  }
                >
                  {copied === "both" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied === "both" ? "Copied both" : "Copy both"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void handleCopy(code.code, "single", "Loyalty code copied.")}
              className="code-card-copy"
              aria-label={`Copy loyalty code ${code.code}`}
            >
              <span className="code-card-value">{copied === "single" ? "COPIED" : code.code}</span>
              <p className="code-card-deal">{`${code.discount} · Box Topper`}</p>
            </button>
          )}
          <p className="code-card-sharer">
            Shared by <strong>{code.sharer_name || "Anonymous Machan"}</strong>
          </p>
          {code.status === "open" ? (
            <div className="code-card-actions">
              <button
                type="button"
                className="code-card-action code-card-action-used"
                disabled={statusPending}
                onClick={() => used.mutate()}
              >
                Mark used
              </button>
              <button
                type="button"
                className="code-card-action code-card-action-invalid"
                disabled={statusPending}
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
          {ownerToken ? (
            <div className="code-owner-row">
              <span className="code-owner-label">Your code</span>
              {confirmingDelete ? (
                <div className="code-owner-confirm">
                  <span>Delete it?</span>
                  <button type="button" onClick={() => setConfirmingDelete(false)}>
                    Keep
                  </button>
                  <button
                    type="button"
                    className="code-owner-delete-confirm"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate()}
                  >
                    {remove.isPending ? "Deleting" : "Delete"}
                  </button>
                </div>
              ) : (
                <div className="code-owner-actions">
                  <button type="button" onClick={startEditing}>
                    <Pencil aria-hidden="true" />
                    Edit
                  </button>
                  <button type="button" onClick={() => setConfirmingDelete(true)}>
                    <Trash2 aria-hidden="true" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
