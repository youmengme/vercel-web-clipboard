import { sql } from '@vercel/postgres';
import { generateKey } from './utils';

export interface ClipboardItem {
  id: string;
  content: string;
  password: string | null;
  view_count: number;
  created_at: Date;
  expires_at: Date | null;
}

export async function createItem(
  content: string,
  password?: string,
  expiresAt?: Date
): Promise<string> {
  const key = generateKey();

  await sql`
    INSERT INTO clipboard_items (id, content, password, view_count, expires_at)
    VALUES (${key}, ${content}, ${password || null}, 0, ${expiresAt ? expiresAt.toISOString() : null})
  `;

  return key;
}

export async function getItem(key: string, password?: string): Promise<ClipboardItem | null> {
  const result = await sql`
    SELECT id, content, password, view_count, created_at, expires_at
    FROM clipboard_items
    WHERE LOWER(id) = LOWER(${key})
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  `;

  if (result.rows.length === 0) {
    return null;
  }

  const item = result.rows[0] as any;

  // Check if password is required
  if (item.password && (!password || password !== item.password)) {
    return {
      ...item,
      content: '',
      password: 'REQUIRED',
    };
  }

  return item;
}

export async function incrementViewCount(key: string): Promise<void> {
  await sql`
    UPDATE clipboard_items
    SET view_count = view_count + 1
    WHERE LOWER(id) = LOWER(${key})
  `;
}

export async function deleteItem(key: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM clipboard_items
    WHERE LOWER(id) = LOWER(${key})
  `;

  return (result.rowCount ?? 0) > 0;
}

export async function checkPasswordRequired(key: string): Promise<boolean> {
  const result = await sql`
    SELECT password IS NOT NULL AND password != '' as has_password
    FROM clipboard_items
    WHERE LOWER(id) = LOWER(${key})
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  `;

  return result.rows.length > 0 && result.rows[0].has_password;
}

// Clean up expired items
export async function cleanupExpiredItems(): Promise<number> {
  const result = await sql`
    DELETE FROM clipboard_items
    WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP
  `;

  return result.rowCount ?? 0;
}
