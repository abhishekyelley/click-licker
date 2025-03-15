export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      {children}
    </main>
  );
}
