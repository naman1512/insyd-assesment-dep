// Vercel Serverless API Route - Follow
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, followerId } = await request.json();
    
    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId: userId,
      },
    });
    
    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      );
    }
    
    // Get follower info
    const followerUser = await prisma.user.findUnique({
      where: { id: followerId },
    });
    
    if (!followerUser) {
      return NextResponse.json(
        { error: 'Follower not found' },
        { status: 404 }
      );
    }
    
    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId: userId,
      },
    });
    
    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'FOLLOW',
        title: 'New Follower',
        message: `${followerUser.username} started following you`,
        data: JSON.stringify({ followerId }),
      },
    });
    
    return NextResponse.json({ success: true, follow });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}
