import { NextRequest, NextResponse } from 'next/server';
import { createItem } from '@/lib/db';
import { sanitizeInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, password, expiresAt } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeInput(content);

    // Parse expiresAt if provided
    let expiryDate: Date | undefined;
    if (expiresAt) {
      expiryDate = new Date(expiresAt);

      // Validate expiry date
      const now = new Date();
      const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (expiryDate <= now) {
        return NextResponse.json(
          { error: '过期时间必须是将来的时间' },
          { status: 400 }
        );
      }

      if (expiryDate > maxDate) {
        return NextResponse.json(
          { error: '过期时间不能超过30天' },
          { status: 400 }
        );
      }
    }

    const key = await createItem(sanitizedContent, password, expiryDate);

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
