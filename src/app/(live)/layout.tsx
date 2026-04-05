export default function LiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">{children}</div>
  );
}
