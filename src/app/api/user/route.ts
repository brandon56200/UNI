import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '../auth/[...nextauth]/route'
import { Session } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session & {
      user: {
        email: string
        name: string
        image: string
      }
    }
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    console.log('Fetching user data for:', session.user.email)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('User not found, creating new user')
      const newUser = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          SavedUnicorns: '[]'
        },
      })
      console.log('Created new user:', newUser)
      return NextResponse.json({ 
        savedUnicorns: [],
        user: newUser
      })
    }

    console.log('Found existing user:', user)
    const savedUnicorns = user.SavedUnicorns ? JSON.parse(user.SavedUnicorns) : []
    console.log('Parsed saved unicorns:', savedUnicorns)

    return NextResponse.json({ 
      savedUnicorns,
      user
    })
  } catch (error) {
    console.error('Error getting user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session & {
      user?: {
        email?: string;
        name?: string;
      };
    }
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { savedUnicorns } = await request.json()
    
    if (!Array.isArray(savedUnicorns)) {
      return NextResponse.json({ 
        error: 'Invalid request format. savedUnicorns must be an array' 
      }, { status: 400 })
    }

    console.log('Saving unicorns for user:', session.user.email, 'Data:', savedUnicorns)

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        SavedUnicorns: JSON.stringify(savedUnicorns)
      },
      create: {
        email: session.user.email,
        name: session.user.name || '',
        SavedUnicorns: JSON.stringify(savedUnicorns)
      }
    })

    console.log('Updated user:', user)
    const parsedUnicorns = JSON.parse(user.SavedUnicorns || '[]')
    console.log('Parsed saved unicorns:', parsedUnicorns)

    return NextResponse.json({ 
      success: true, 
      savedUnicorns: parsedUnicorns,
      user
    })
  } catch (error) {
    console.error('Error saving unicorns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 