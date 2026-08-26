import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ShareThanksToast({ toastId }: { toastId: number | string }) {
  const [reduceMotion, setReduceMotion] = useState(false);

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
        <p className="share-thanks-title">You lovely human.</p>
        <p>Thanks for passing a slice forward. Someone&apos;s dinner just got happier.</p>
      </div>
      <button
        type="button"
        className="share-thanks-close"
        aria-label="Dismiss thank-you message"
        onClick={() => toast.dismiss(toastId)}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}

export function showShareThanks() {
  toast.custom((toastId) => <ShareThanksToast toastId={toastId} />, {
    id: "share-thanks",
    duration: 5_200,
    position: "top-center",
    unstyled: true,
  });
}
