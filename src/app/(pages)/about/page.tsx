import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-16">
      <h1>About dgputt</h1>
      <Alert className="mt-4">
        <AlertTitle>Under construction</AlertTitle>
        <AlertDescription>
          This page is currently being built. Check back soon for more
          information about dgputt, our games, and how everything works.
        </AlertDescription>
      </Alert>
    </div>
  );
}
