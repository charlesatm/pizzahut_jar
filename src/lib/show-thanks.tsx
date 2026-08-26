import { toast } from "sonner";
import { ShareThanksToast, type ThanksMoment } from "@/components/share-thanks-toast";

export function showThanks(moment: ThanksMoment) {
  toast.custom((toastId) => <ShareThanksToast moment={moment} toastId={toastId} />, {
    id: "share-thanks",
    duration: 5_200,
    position: "top-center",
    unstyled: true,
  });
}
