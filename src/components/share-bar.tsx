import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCode } from "@/lib/codes";
import { defaultExpiresAt } from "@/lib/expiry";

export function ShareBar({ onShared }: { onShared?: () => void }) {
  const [code, setCode] = useState("");
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: () =>
      createCode({
        data: {
          code,
          discount: "15% off",
          expires_at: defaultExpiresAt(),
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
      toast.success("Shared.");
      onShared?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not share that.");
    }
  }

  return (
    <form id="share" onSubmit={(e) => void onSubmit(e)} className="share-form">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        minLength={3}
        maxLength={40}
        placeholder="Pizza Hut code (e.g., PIZZA50OFF)"
        aria-label="Pizza Hut promo code"
        className="share-input !rounded-none !border-0 !bg-transparent !shadow-none focus-visible:!ring-0"
      />
      <Button type="submit" disabled={create.isPending} className="share-button">
        {create.isPending ? "Sharing" : "Share"}
      </Button>
    </form>
  );
}
