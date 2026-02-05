import { NextRequest, NextResponse } from 'next/server';
import {
  upsertUser,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userData } = body;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    console.log('🔄 Completing authentication with user data:', userData ? 'provided' : 'not provided');

    // Check if user has a persistent ID cookie
    const persistentId = request.cookies.get('kick_temp_persistent_id')?.value;
    let userKickId: string;

    if (userData && (userData.user_id || userData.id || userData.sub)) {
      // We got real user data from the client!
      userKickId = String(userData.user_id || userData.id || userData.sub);
      console.log('✅ Using real Kick user ID:', userKickId);
    } else if (persistentId) {
      // Reuse existing persistent ID
      userKickId = persistentId;
      console.log('✅ Using existing persistent ID:', userKickId);
    } else {
      // Generate new persistent ID
      userKickId = `kick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('🆕 Generated new persistent ID:', userKickId);
    }

    // Create or update user in database
    const user = await upsertUser({
      kickId: userKickId,
      username: userData?.name || userData?.username || userData?.slug || 'kick_user',
      displayName: userData?.name || userData?.slug || userData?.username || 'kick_user',
      avatar: userData?.profile_picture || userData?.profile_pic || userData?.profilepic || userData?.avatar || userData?.picture || null,
      email: userData?.email || null,
      isSubscriber: false,
      isModerator: false,
    });

    console.log('✅ User created/updated in database:', user.username);

    // Create session token
    const sessionToken = await createSessionToken(user);

    // Set session cookie
    await setSessionCookie(sessionToken);

    // Set persistent ID cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set('kick_persistent_id', userKickId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    // Delete temp cookie
    response.cookies.delete('kick_temp_persistent_id');

    return response;

  } catch (error) {
    console.error('❌ Error completing authentication:', error);
    return NextResponse.json(
      { error: 'Failed to complete authentication' },
      { status: 500 }
    );
  }
}
