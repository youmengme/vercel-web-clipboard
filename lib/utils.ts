import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 1000);
}

export function generateKey(): string {
  return Math.random().toString(36).substring(2, 10);
}
