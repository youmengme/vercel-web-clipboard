import { NextRequest, NextResponse } from 'next/server';
import { createItem } from '@/lib/db';
import { sanitizeInput } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, password } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeInput(content);

    // Always set expiry to 10 minutes from now
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

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
