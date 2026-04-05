import Footer from "@/app/components/layout/footer";
import Header from "@/app/components/layout/header";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-275 mx-auto w-full">{children}</main>
      <Footer />
    </>
  );
}
