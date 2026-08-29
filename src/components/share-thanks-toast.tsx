import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type ThanksMoment = "shared" | "used" | "invalid" | "baila";

const COPY: Record<ThanksMoment, { title: string; message: string }> = {
  shared: {
    title: "Ado, machan!",
    message: "Patta move — thanks for sharing the love. Someone's pizza scene is sorted.",
  },
  used: {
    title: "Hari, machan.",
    message: "Thanks for the heads-up. You saved the next person a useless click.",
  },
  invalid: {
    title: "Aney, good save.",
    message: "Thanks for spotting that boru code, machan. One less dud in the jar.",
  },
  baila: {
    title: "Ado, machan!",
    message: "Pizza eka vibe ekata giya!",
  },
};

export function ShareThanksToast({
  moment,
  toastId,
}: {
  moment: ThanksMoment;
  toastId: number | string;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const copy = COPY[moment];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  return (
    <div className="share-thanks-toast" role="status">
      <div className="share-thanks-media" aria-hidden="true">
        <img
          src={reduceMotion ? "/share-a-slice-icon.svg" : "/share-thanks.gif"}
          alt=""
          width={320}
          height={200}
        />
      </div>
      <div className="share-thanks-copy">
        <p className="share-thanks-title">{copy.title}</p>
        <p>{copy.message}</p>
      </div>
      <button
        type="button"
        className="share-thanks-close"
        aria-label="Dismiss message"
        onClick={() => toast.dismiss(toastId)}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
