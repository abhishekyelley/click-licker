import { z } from "zod";
import { schema as loginSchema } from "@/schemas/login";

export interface ActionMessage {
  message: string;
  fields?: Partial<z.infer<typeof loginSchema>>;
}
