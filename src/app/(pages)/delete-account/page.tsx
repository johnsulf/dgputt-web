import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete your account and data - dgputt",
  description:
    "How to delete your dgputt account and all associated data, either from inside the app or by contacting us.",
};

export default function DeleteAccountPage() {
  return (
    <article className="max-w-200 mx-auto p-4 text-left space-y-8">
      <h1>Delete your dgputt account and data</h1>
      <p>
        The dgputt app is provided by FFD700 AS. You can delete your dgputt
        account and all data associated with it at any time. There are two ways
        to do it.
      </p>

      <article className="space-y-4">
        <h2>Option 1: From inside the app</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open the dgputt app and sign in.</li>
          <li>
            Go to the <strong>Profile</strong> tab and tap the account icon in
            the top right to open the <strong>Account</strong> screen.
          </li>
          <li>
            Tap <strong>Delete my account and data</strong>, then{" "}
            <strong>Request to delete my account</strong>.
          </li>
          <li>
            Confirm in the dialog. Your request is registered immediately and is
            normally processed within a few days.
          </li>
        </ol>
      </article>

      <article className="space-y-4">
        <h2>Option 2: By email</h2>
        <p>
          If you can no longer sign in to the app, send an email to{" "}
          <a
            href="mailto:contact@dgputt.app?subject=Delete%20my%20dgputt%20account"
            className="underline text-blue-700"
          >
            contact@dgputt.app
          </a>{" "}
          from the email address registered on your dgputt account, with the
          subject &quot;Delete my dgputt account&quot;. We will verify the
          request and delete the account.
        </p>
      </article>

      <article className="space-y-4">
        <h2>What gets deleted</h2>
        <p>
          When the request is processed, the following is permanently deleted
          and cannot be restored:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Your dgputt login account (email address and credentials)</li>
          <li>
            Your profile information, including display name and PDGA number
          </li>
          <li>Your putting sessions, rounds, and practice history</li>
          <li>Your statistics and personal records</li>
          <li>Your per-putt Aim data</li>
        </ul>
        <p>
          We send a confirmation email to your registered address once the
          deletion is complete.
        </p>
      </article>

      <article className="space-y-4">
        <h2>Retention</h2>
        <p>
          Deletion requests are normally processed within a few days, and no
          later than 30 days after the request. Anonymized and aggregated
          analytics data that cannot be linked back to you or your account is
          not affected by the deletion. Backups are rotated out within 30 days.
        </p>
      </article>

      <article className="space-y-4">
        <h2>Subscriptions</h2>
        <p>
          Deleting your account does not cancel an active subscription. If you
          have a dgputt subscription, cancel it in Google Play or the App Store
          before deleting your account.
        </p>
      </article>

      <hr />

      <article className="space-y-4">
        <h2>Questions</h2>
        <p>
          If you have questions about deleting your account or your data, or
          about how we handle personal data, contact us at{" "}
          <a
            href="mailto:contact@dgputt.app"
            className="underline text-blue-700"
          >
            contact@dgputt.app
          </a>{" "}
          or read our{" "}
          <a href="/privacy-policy" className="underline text-blue-700">
            privacy policy
          </a>
          .
        </p>
      </article>
    </article>
  );
}
