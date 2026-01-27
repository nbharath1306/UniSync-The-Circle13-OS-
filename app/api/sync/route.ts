import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPendingSyncs, createSyncRequest, updateSyncRequest } from '@/lib/local-db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const syncs = getPendingSyncs(userId);

    return NextResponse.json(syncs);
  } catch (error) {
    console.error('Get sync requests error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { toUserId, meetingTime, location, duration, purpose } = await request.json();
    const userId = parseInt(session.user.id);

    const sync = createSyncRequest(
      userId,
      toUserId,
      meetingTime,
      location,
      duration,
      purpose
    );

    return NextResponse.json(sync, { status: 201 });
  } catch (error) {
    console.error('Create sync request error:', error);
    return NextResponse.json(
      { error: 'Failed to create sync request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { requestId, status } = await request.json();
    const userId = parseInt(session.user.id);

    const sync = updateSyncRequest(requestId, userId, status);

    if (!sync) {
      return NextResponse.json(
        { error: 'Sync request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sync);
  } catch (error) {
    console.error('Update sync request error:', error);
    return NextResponse.json(
      { error: 'Failed to update sync request' },
      { status: 500 }
    );
  }
}
