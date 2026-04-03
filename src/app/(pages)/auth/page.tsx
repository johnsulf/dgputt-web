import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth() {
  return (
    <div className="w-full max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Login to your dgputt account</CardTitle>
          <CardDescription>
            You will need to download the app to register an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                required
              />{" "}
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
