import { NextRequest, NextResponse } from 'next/server';
import { getItem, incrementViewCount, deleteItem, checkPasswordRequired } from '@/lib/db';
import { sanitizeInput } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const searchParams = request.nextUrl.searchParams;
    const password = searchParams.get('pwd') || undefined;

    const sanitizedKey = sanitizeInput(key);

    // Check if password is required
    const passwordRequired = await checkPasswordRequired(sanitizedKey);

    // Get the item
    const item = await getItem(sanitizedKey, password);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // If password is required but not provided or incorrect
    if (passwordRequired && !password) {
      return NextResponse.json({
        passwordRequired: true,
        content: null,
        viewCount: item.view_count,
      });
    }

    // If password is provided but incorrect
    if (passwordRequired && item.password === 'REQUIRED') {
      return NextResponse.json({
        passwordRequired: true,
        error: 'Incorrect password',
        content: null,
        viewCount: item.view_count,
      });
    }

    // Increment view count only if content is actually retrieved
    if (item.content) {
      await incrementViewCount(sanitizedKey);
    }

    return NextResponse.json({
      content: item.content,
      viewCount: item.view_count + (item.content ? 1 : 0),
      passwordRequired: false,
    });
  } catch (error) {
    console.error('Error getting item:', error);
    return NextResponse.json(
      { error: 'Failed to get item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const sanitizedKey = sanitizeInput(key);

    const deleted = await deleteItem(sanitizedKey);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
