import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function GuidePage() {
  return (
    <div className="px-4 py-8 sm:px-16">
      <h1>League Admin Guide</h1>
      <Alert className="mt-4">
        <AlertTitle>Under construction</AlertTitle>
        <AlertDescription>
          This page is currently being built. Check back soon for step-by-step
          instructions on how to create and manage your own dgputt league.
        </AlertDescription>
      </Alert>
    </div>
  );
}
