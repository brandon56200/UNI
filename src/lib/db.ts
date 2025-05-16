import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// Type for the User model
export type User = {
  ClientID: string
  SavedUnicorns: string[]
}

// Create or update a user's saved unicorns
export async function saveUnicorn(clientId: string, companyName: string) {
  try {
    console.log("saveUnicorn called with:", { clientId, companyName })
    
    const user = await prisma.user.findUnique({
      where: {
        ClientID: clientId,
      },
    })
    console.log("Existing user found:", user)

    let savedUnicorns: string[] = []
    if (user) {
      savedUnicorns = JSON.parse(user.SavedUnicorns)
    }

    if (!savedUnicorns.includes(companyName)) {
      savedUnicorns.push(companyName)
    }

    console.log("Attempting to upsert user with data:", {
      ClientID: clientId,
      SavedUnicorns: JSON.stringify(savedUnicorns)
    })

    const updatedUser = await prisma.user.upsert({
      where: {
        ClientID: clientId,
      },
      update: {
        SavedUnicorns: JSON.stringify(savedUnicorns),
      },
      create: {
        ClientID: clientId,
        SavedUnicorns: JSON.stringify([companyName]),
      },
    })
    console.log("User upsert result:", updatedUser)

    return {
      ClientID: updatedUser.ClientID,
      SavedUnicorns: JSON.parse(updatedUser.SavedUnicorns),
    }
  } catch (error) {
    console.error('Error saving unicorn:', error)
    throw error
  }
}

// Get all saved unicorns for a user
export async function getSavedUnicorns(clientId: string) {
  try {
    console.log("getSavedUnicorns called with clientId:", clientId)
    
    const user = await prisma.user.findUnique({
      where: {
        ClientID: clientId,
      },
    })
    console.log("User found:", user)
    
    return user ? JSON.parse(user.SavedUnicorns) : []
  } catch (error) {
    console.error('Error getting saved unicorns:', error)
    throw error
  }
}

// Remove a saved unicorn
export async function removeUnicorn(clientId: string, companyName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        ClientID: clientId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const savedUnicorns = JSON.parse(user.SavedUnicorns)
    const updatedUnicorns = savedUnicorns.filter(
      (unicorn: string) => unicorn !== companyName
    )

    const updatedUser = await prisma.user.update({
      where: {
        ClientID: clientId,
      },
      data: {
        SavedUnicorns: JSON.stringify(updatedUnicorns),
      },
    })

    return {
      ClientID: updatedUser.ClientID,
      SavedUnicorns: JSON.parse(updatedUser.SavedUnicorns),
    }
  } catch (error) {
    console.error('Error removing unicorn:', error)
    throw error
  }
}

// Delete a user and all their saved unicorns
export async function deleteUser(clientId: string) {
  try {
    await prisma.user.delete({
      where: {
        ClientID: clientId,
      },
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
} 