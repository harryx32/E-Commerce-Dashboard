import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  category: z
    .string()
    .min(1, "Category is required"),
});
