import { toast } from "sonner";
import { ShareThanksToast, type ThanksMoment } from "@/components/share-thanks-toast";

export function showThanks(moment: ThanksMoment, sharerName?: string) {
  toast.custom(
    (toastId) => <ShareThanksToast moment={moment} toastId={toastId} sharerName={sharerName} />,
    {
      id: "share-thanks",
      duration: 5_200,
      position: "top-center",
      unstyled: true,
    },
  );
}
