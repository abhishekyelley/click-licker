"use client";

import { useActionState, useRef, useTransition } from "react";
import { login } from "@/app/login/actions";
import { ActionMessage } from "@/types/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schemas/login";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";

const initialState: ActionMessage = {
  message: "",
};

export function Login() {
  const [state, formAction, isPending] = useActionState<
    ActionMessage,
    FormData
  >(login, initialState);

  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...state?.fields,
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="space-y-8 flex flex-col items-center border shadow rounded-xl p-8"
        action={formAction}
        onSubmit={form.handleSubmit(() => {
          startTransition(() => {
            formAction(new FormData(formRef.current!));
          });
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="******"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
        <Separator />
        <Button
          type="button"
          onClick={() => {
            startTransition(async () => {
              const formData = new FormData();
              formData.append("provider", "github");
              formAction(formData);
            });
          }}
          className="cursor-pointer"
          disabled={isTransitioning}
        >
          <SiGithub />
          {isTransitioning ? "Logging In..." : "Login with GitHub"}
        </Button>
      </form>
    </Form>
  );
}
