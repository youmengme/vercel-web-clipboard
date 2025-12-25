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
    const key = await createItem(sanitizedContent, password);

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
