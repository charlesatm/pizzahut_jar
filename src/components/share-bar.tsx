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
    <form
      id="share"
      onSubmit={(e) => void onSubmit(e)}
      className="mx-auto flex w-full max-w-xl overflow-hidden rounded-full border border-transparent bg-white shadow-[0_0_40px_-12px_rgba(228,0,43,0.55)]"
    >
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        minLength={3}
        maxLength={40}
        placeholder="Enter your Pizza Hut Promo Code here (e.g., PIZZA50OFF)"
        className="h-12 flex-1 border-0 bg-transparent font-mono text-sm tracking-wide text-neutral-900 shadow-none placeholder:font-sans placeholder:tracking-normal placeholder:text-neutral-400 focus-visible:ring-0"
      />
      <Button
        type="submit"
        disabled={create.isPending}
        className="m-1 h-10 rounded-full px-6 text-xs font-semibold tracking-widest"
      >
        SHARE
      </Button>
    </form>
  );
}
