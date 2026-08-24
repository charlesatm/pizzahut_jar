import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCode } from "@/lib/codes";
import { defaultExpiresAt, todayIso } from "@/lib/expiry";

export function ShareBar({ onShared }: { onShared?: () => void }) {
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiresAt);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: () =>
      createCode({
        data: {
          code,
          discount: "15% off",
          expires_at: expiresAt,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["codes"] });
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await create.mutateAsync();
      setCode("");
      setExpiresAt(defaultExpiresAt());
      toast.success("Shared.");
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
        <Input
          id="share-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          minLength={3}
          maxLength={40}
          placeholder="PIZZA50OFF"
          autoComplete="off"
          className="share-input !rounded-none !border-0 !bg-transparent !text-card-foreground !shadow-none focus-visible:!ring-0"
        />
      </div>
      <div className="share-control share-date-control">
        <label htmlFor="share-expiry" className="share-label">
          Expires
        </label>
        <Input
          id="share-expiry"
          type="date"
          required
          min={todayIso()}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="share-input share-date-input !rounded-none !border-0 !bg-transparent !text-card-foreground !shadow-none focus-visible:!ring-0"
        />
      </div>
      <Button type="submit" disabled={create.isPending} className="share-button">
        {create.isPending ? "Sharing" : "Share"}
      </Button>
    </form>
  );
}
