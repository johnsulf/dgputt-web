import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Leagues() {
  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <h1>dgputt Leagues on the web</h1>
      </CardHeader>
      <CardContent>
        <p>
          We are currently working on bringing you the best dgputt leagues
          experience on the web.
        </p>
      </CardContent>
      <CardFooter>
        <p>
          Stay tuned for updates and thank you for being part of the dgputt
          community!
        </p>
      </CardFooter>
    </Card>
  );
}
