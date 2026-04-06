import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact - dgputt",
  description:
    "Get in touch with the dgputt team. Email us or find us on Instagram and Facebook.",
};

export default function ContactPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-12">
      <section className="space-y-4 max-w-2xl">
        <h1>Contact Us</h1>
        <p className="text-lg">
          Have a question, suggestion, or just want to say hello? We&apos;d love
          to hear from you.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
        {/* Email */}
        <Card size="sm">
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Send us an email and we&apos;ll get back to you as soon as we can.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:contact@dgputt.app">
              <Button variant="outline">contact@dgputt.app</Button>
            </a>
          </CardContent>
        </Card>

        {/* Social media */}
        <Card size="sm">
          <CardHeader>
            <CardTitle>Social media</CardTitle>
            <CardDescription>
              Follow us for updates, tips, and community highlights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <a
              href="https://www.instagram.com/dgputt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/ig.png"
                alt="Instagram"
                width={32}
                height={32}
              />
            </a>
            <a
              href="https://www.facebook.com/dgputt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/fb.png" alt="Facebook" width={32} height={32} />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
