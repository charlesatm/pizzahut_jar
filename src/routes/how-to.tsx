import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Mail, ReceiptText } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/how-to")({
  component: HowToPage,
  head: () => ({
    meta: [{ title: "How to · Share a Slice" }],
  }),
});

function HowToPage() {
  return (
    <AppShell>
      <div className="content-page offer-how-to">
        <header className="offer-guide-intro">
          <p className="offer-guide-kicker">Two offers, two different flows</p>
          <h1>How to get the right discount</h1>
          <p>
            GES uses a receipt code plus a validation code. Loyalty is a separate code sent after a
            successful delivery.
          </p>
        </header>

        <div className="offer-guide-grid">
          <section className="offer-guide-card offer-guide-card-ges">
            <div className="offer-guide-heading">
              <span className="offer-guide-icon" aria-hidden="true">
                <ReceiptText />
              </span>
              <div>
                <p>GES Survey</p>
                <h2>20% off</h2>
              </div>
            </div>
            <ol className="offer-guide-steps">
              <li>Open the official survey within 3 days of purchase.</li>
              <li>Enter the details requested from your receipt.</li>
              <li>Complete the questions about your experience.</li>
              <li>Save the validation code shown at the end.</li>
              <li>Keep it with the GES Survey Code printed on the receipt.</li>
            </ol>
            <a
              className="offer-guide-link"
              href="https://s.pizzahutsurvey.com/lka"
              target="_blank"
              rel="noreferrer"
            >
              Open official survey
              <ArrowUpRight aria-hidden="true" />
            </a>
            <p className="offer-guide-terms">
              Valid for 21 days from the visit, with a maximum Rs. 1,000 discount. Check the receipt
              for the full conditions.
            </p>
          </section>

          <section className="offer-guide-card offer-guide-card-loyalty">
            <div className="offer-guide-heading">
              <span className="offer-guide-icon" aria-hidden="true">
                <Mail />
              </span>
              <div>
                <p>Box Topper loyalty</p>
                <h2>15% off</h2>
              </div>
            </div>
            <ol className="offer-guide-steps">
              <li>Complete a Pizza Hut delivery successfully.</li>
              <li>Look for the loyalty code sent by email or SMS.</li>
              <li>Keep the exact “Valid till” date included with the message.</li>
              <li>Share the code and expiry here, or redeem it at checkout.</li>
            </ol>
            <div className="offer-guide-example" aria-label="Loyalty code example">
              <span>Coupon</span>
              <strong>17036867</strong>
              <span>Offer</span>
              <strong>Box Topper 15% Auto</strong>
            </div>
          </section>
        </div>

        <p className="offer-owner-note">
          Machan, codes you share can still be edited or deleted from this browser. Mark a code used
          or not good so the next person gets a clean list.
        </p>
      </div>
    </AppShell>
  );
}
