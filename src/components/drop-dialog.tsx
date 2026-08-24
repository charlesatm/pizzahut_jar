import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCode } from "@/lib/codes";
import { useDropStore } from "@/lib/drop-store";
import { CODE_LIFE_DAYS, defaultExpiresAt, todayIso } from "@/lib/expiry";
import { cn } from "@/lib/utils";

function blankForm() {
  return {
    code: "",
    discount: "15% off",
    expires_at: defaultExpiresAt(),
  };
}

export function DropDialog({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const offerDrop = useDropStore((s) => s.offer);

  const create = useMutation({
    mutationFn: () =>
      createCode({
        data: {
          code: form.code,
          discount: form.discount,
          expires_at: form.expires_at || defaultExpiresAt(),
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["codes"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  function set<K extends keyof ReturnType<typeof blankForm>>(
    key: K,
    value: ReturnType<typeof blankForm>[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const expires = form.expires_at || defaultExpiresAt();
    if (!expires) {
      toast.error("Expiry date is required.");
      return;
    }
    const code = form.code.replace(/\s+/g, "").toUpperCase();
    const discount = form.discount.trim() || "15% off";
    try {
      await create.mutateAsync();
      setOpen(false);
      setForm(blankForm());
      offerDrop({ code, discount });
      if (pathname !== "/") {
        void navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not drop that.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setForm(blankForm());
      }}
    >
      <DialogTrigger asChild>
        <Button className={cn("min-h-11", triggerClassName)}>Drop a code</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Drop a code</DialogTitle>
          <DialogDescription>
            One Pizza Hut code. No personal details. Lasts {CODE_LIFE_DAYS}{" "}
            days unless you change the date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void onSubmit(e)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Promo code</Label>
            <Input
              id="code"
              required
              minLength={3}
              maxLength={40}
              placeholder="HUT15OFF"
              className="font-mono tracking-wider uppercase"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="discount">The deal</Label>
            <Input
              id="discount"
              required
              minLength={2}
              maxLength={40}
              value={form.discount}
              onChange={(e) => set("discount", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expires">Expires</Label>
            <Input
              id="expires"
              type="date"
              required
              min={todayIso()}
              value={form.expires_at}
              onChange={(e) => set("expires_at", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to {CODE_LIFE_DAYS} days from today. Change it if yours
              ends sooner.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={create.isPending} className="min-h-11">
              Drop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
