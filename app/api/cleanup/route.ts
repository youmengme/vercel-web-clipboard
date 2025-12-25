import { NextResponse } from 'next/server';
import { cleanupExpiredItems } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify this is a cron job request
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedCount = await cleanupExpiredItems();

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} expired items`,
    });
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup' },
      { status: 500 }
    );
  }
}
