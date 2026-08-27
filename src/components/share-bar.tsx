import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createOwnerToken, saveOwnerToken } from "@/lib/code-ownership";
import { createCode } from "@/lib/codes";
import { defaultExpiresAt, todayIso } from "@/lib/expiry";
import { showThanks } from "@/lib/show-thanks";

export function ShareBar({ onShared }: { onShared?: () => void }) {
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiresAt);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (ownerToken: string) =>
      createCode({
        data: {
          code,
          discount: "15% off",
          expires_at: expiresAt,
          owner_token: ownerToken,
        },
      }),
    onSuccess: (created, ownerToken) => {
      if (!saveOwnerToken(created.id, ownerToken)) {
        toast.warning("Shared, but this browser blocked edit and delete access.");
      }
      void queryClient.invalidateQueries({ queryKey: ["codes"] });
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync(createOwnerToken());
      setCode("");
      setExpiresAt(defaultExpiresAt());
      showThanks("shared");
      onShared?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not share that.");
    }
  }

  return (
    <form id="share" onSubmit={(e) => void onSubmit(e)} className="share-form">
      <div className="share-control share-code-control">
        <label htmlFor="share-code" className="share-label">
          Promo code
        </label>
        <input
          id="share-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          minLength={3}
          maxLength={40}
          placeholder="PIZZA50OFF"
          autoComplete="off"
          className="share-input"
        />
      </div>
      <div className="share-control share-date-control">
        <label htmlFor="share-expiry" className="share-label">
          Expires
        </label>
        <input
          id="share-expiry"
          type="date"
          required
          min={todayIso()}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="share-input share-date-input"
        />
      </div>
      <button type="submit" disabled={create.isPending} className="share-button">
        {create.isPending ? "Sharing" : "Share"}
      </button>
    </form>
  );
}
