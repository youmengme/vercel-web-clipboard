import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(input: string): string {
  // 只做基本的清理：去空格和限制长度
  // SQL 注入防护由参数化查询（@vercel/postgres）提供
  return input
    .trim()
    .substring(0, 10000);
}

export function sanitizeKey(input: string): string {
  // 对 key 做更严格的限制，只保留字母数字
  return input
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 10);
}

export function generateKey(): string {
  // Generate a random key with length 2-6 characters
  const length = Math.floor(Math.random() * 5) + 2; // 2-6
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // Removed similar looking chars
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
