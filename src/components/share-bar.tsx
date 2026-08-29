import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createOwnerToken, saveOwnerToken } from "@/lib/code-ownership";
import { createCode, type OfferType } from "@/lib/codes";
import { defaultExpiresAt, gesExpiresAt, todayIso } from "@/lib/expiry";
import { showThanks } from "@/lib/show-thanks";

export function ShareBar({ onShared }: { onShared?: () => void }) {
  const [offerType, setOfferType] = useState<OfferType>("loyalty");
  const [code, setCode] = useState("");
  const [surveyCode, setSurveyCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(defaultExpiresAt);
  const [visitDate, setVisitDate] = useState(todayIso);
  const queryClient = useQueryClient();

  function selectOffer(nextOffer: OfferType) {
    if (nextOffer === offerType) return;
    setOfferType(nextOffer);
    setCode("");
    setSurveyCode("");
  }

  const create = useMutation({
    mutationFn: (ownerToken: string) =>
      createCode({
        data: {
          code,
          offer_type: offerType,
          survey_code: surveyCode,
          expires_at: offerType === "ges" ? gesExpiresAt(visitDate) : expiresAt,
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
      const created = await create.mutateAsync(createOwnerToken());
      setCode("");
      setSurveyCode("");
      setExpiresAt(defaultExpiresAt());
      setVisitDate(todayIso());
      showThanks("shared", created.sharer_name);
      onShared?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not share that.");
    }
  }

  return (
    <form
      id="share"
      onSubmit={(e) => void onSubmit(e)}
      className={`share-form share-form-${offerType}`}
    >
      <div className="share-offer-picker" role="group" aria-label="Offer type">
        <button
          type="button"
          className="share-offer-option"
          aria-pressed={offerType === "loyalty"}
          onClick={() => selectOffer("loyalty")}
        >
          <span>Loyalty</span>
          <strong>15%</strong>
          <small>Email or SMS</small>
        </button>
        <button
          type="button"
          className="share-offer-option"
          aria-pressed={offerType === "ges"}
          onClick={() => selectOffer("ges")}
        >
          <span>GES Survey</span>
          <strong>20%</strong>
          <small>Two codes</small>
        </button>
      </div>
      {offerType === "ges" ? (
        <div className="share-control share-survey-control">
          <label htmlFor="share-survey-code" className="share-label">
            GES Survey code
          </label>
          <input
            id="share-survey-code"
            value={surveyCode}
            onChange={(e) => setSurveyCode(e.target.value)}
            required
            minLength={3}
            maxLength={64}
            placeholder="GPLPL..."
            autoComplete="off"
            className="share-input"
          />
        </div>
      ) : null}
      <div className="share-control share-code-control">
        <label htmlFor="share-code" className="share-label">
          {offerType === "ges" ? "Validation code" : "Loyalty code"}
        </label>
        <input
          id="share-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          minLength={3}
          maxLength={40}
          placeholder={offerType === "ges" ? "12345" : "17036867"}
          inputMode="numeric"
          autoComplete="off"
          className="share-input"
        />
      </div>
      <div className="share-control share-date-control">
        <label htmlFor="share-expiry" className="share-label">
          {offerType === "ges" ? "Visit date · valid 21 days" : "Valid till"}
        </label>
        <input
          id="share-expiry"
          type="date"
          required
          min={offerType === "ges" ? undefined : todayIso()}
          max={offerType === "ges" ? todayIso() : undefined}
          value={offerType === "ges" ? visitDate : expiresAt}
          onChange={(e) =>
            offerType === "ges" ? setVisitDate(e.target.value) : setExpiresAt(e.target.value)
          }
          className="share-input share-date-input"
        />
      </div>
      <button type="submit" disabled={create.isPending} className="share-button">
        {create.isPending ? "Sharing" : "Share"}
      </button>
    </form>
  );
}
