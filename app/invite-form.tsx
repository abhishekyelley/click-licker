"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schemas/invite";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function InviteForm() {
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const supabase = createClient();
  const checkEmailValidity = useCallback(
    async (value: string) => {
      const messages: string[] = [];
      const calls = [
        supabase.from("invites").select().eq("email", value),
        supabase.from("users").select().eq("email", value),
      ];
      const [
        { data: invitesData, error: invitesError },
        { data: usersData, error: usersError },
      ] = await Promise.all(calls);
      if (invitesError) {
        // silent
        console.error(invitesError);
        return messages;
      }

      if (invitesData.length > 0) {
        messages.push("A user with this email was already invited");
      }
      if (usersError) {
        // silent
        console.error(usersError);
        return messages;
      }
      if (usersData.length > 0) {
        messages.push("A user with this email already exists");
      }
      return messages;
    },
    [supabase]
  );
  const onSubmit = useCallback(
    async (values: z.output<typeof schema>) => {
      const errorMessages = await checkEmailValidity(values.email);
      if (errorMessages?.length > 0) {
        errorMessages?.forEach((message) =>
          form.setError("email", { message })
        );
        return;
      }
      const { data, error } = await supabase
        .from("invites")
        .insert({
          email: values.email,
          role: values.role,
        })
        .select();
      if (error || data.length === 0) {
        toast.error(
          `Could not invite user with email: ${values.email} for role: ${values.role}`,
          {
            dismissible: true,
          }
        );
        return;
      }
      toast.success(
        `User with email: ${data[0].email} for role: ${data[0].role} has been invited`,
        {
          dismissible: true,
        }
      );
    },
    [checkEmailValidity, form, supabase]
  );
  return (
    <Form {...form}>
      <form
        className="min-h-screen flex flex-col justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-max self-center space-y-4 rounded-xl border shadow p-8">
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
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="link_maker">
                      link_maker
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="self-center cursor-pointer"
          >
            Invite
          </Button>
        </div>
      </form>
    </Form>
  );
}
