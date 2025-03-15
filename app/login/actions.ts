"use server";

import { createClient } from "@/lib/supabase/server";
import { schema } from "@/schemas/login";
import { ActionMessage } from "@/types/login";
import { redirect } from "next/navigation";

export async function login(
  prevState: ActionMessage,
  formData: FormData
): Promise<ActionMessage> {
  const supabase = await createClient();
  const provider = formData.get("provider");
  if (provider === "github") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.SITE_URL}/api/auth/callback`,
      },
    });
    if (error) {
      return {
        message: "could not sign in",
      };
    }
    if (data.url) {
      redirect(data.url);
    }
  }
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { success } = schema.safeParse({
    email,
    password,
  });

  if (!success) {
    return {
      message: "Invalid email address",
      fields: { email },
    };
  }
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return {
      message: error.message ?? "Invalid credentials",
      fields: { email },
    };
  }

  redirect("/dashboard");
}
