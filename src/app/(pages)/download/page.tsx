import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function DownloadPage() {
  return (
    <div className="px-4 py-8 sm:px-16">
      <h1>Download dgputt</h1>
      <Alert className="mt-4">
        <AlertTitle>Under construction</AlertTitle>
        <AlertDescription>
          This page is currently being built. In the meantime, you can download
          dgputt from the{" "}
          <a
            href="https://apps.apple.com/us/app/dgputt/id1536711552"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            App Store
          </a>{" "}
          or{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google Play
          </a>
          .
        </AlertDescription>
      </Alert>
    </div>
  );
}
