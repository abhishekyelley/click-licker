import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { code } = await searchParams;
  const isUserNotInvited = code === "unexpected_failure";
  return (
    <main className="flex flex-col justify-center min-h-screen items-center">
      <div className="flex flex-col items-center justify-center p-8 rounded-xl border shadow space-y-4">
        {isUserNotInvited ? (
          <>
            <h1 className="text-3xl font-bold">
              Looks like you did not get an invite
            </h1>
            <p className="text-muted-foreground">
              Make sure you are signing up with an email address that
              has been invited.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              Something unexpected happend. Please contact us if you
              think this should not have happened.
            </p>
          </>
        )}
        <Button variant={"link"} asChild>
          <Link href="/">Go back</Link>
        </Button>
      </div>
    </main>
  );
}
