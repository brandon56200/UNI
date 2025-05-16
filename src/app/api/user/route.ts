import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ savedUnicorns: [] })
    }

    const savedUnicorns = JSON.parse(user.SavedUnicorns || '[]')
    return NextResponse.json({ savedUnicorns })
  } catch (error) {
    console.error('Error getting user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { savedUnicorns } = await request.json()
    
    if (!Array.isArray(savedUnicorns)) {
      return NextResponse.json({ 
        error: 'Invalid request format. savedUnicorns must be an array' 
      }, { status: 400 })
    }

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

    return NextResponse.json({ 
      success: true, 
      user,
      savedUnicorns: JSON.parse(user.SavedUnicorns || '[]')
    })
  } catch (error) {
    console.error('Error saving unicorns:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 