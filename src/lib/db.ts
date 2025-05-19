import { prisma } from './prisma'

// Type for the User model
export type User = {
  email: string
  SavedUnicorns: string[]
}

// Create or update a user's saved unicorns
export async function saveUnicorn(email: string, companyName: string) {
  try {
    console.log("saveUnicorn called with:", { email, companyName })
    
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    console.log("Existing user found:", user)

    let savedUnicorns: string[] = []
    if (user?.SavedUnicorns) {
      savedUnicorns = JSON.parse(user.SavedUnicorns)
    }

    if (!savedUnicorns.includes(companyName)) {
      savedUnicorns.push(companyName)
    }

    console.log("Attempting to upsert user with data:", {
      email: email,
      SavedUnicorns: JSON.stringify(savedUnicorns)
    })

    const updatedUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        SavedUnicorns: JSON.stringify(savedUnicorns),
      },
      create: {
        email: email,
        SavedUnicorns: JSON.stringify([companyName]),
      },
    })
    console.log("User upsert result:", updatedUser)

    return {
      email: updatedUser.email,
      SavedUnicorns: updatedUser.SavedUnicorns ? JSON.parse(updatedUser.SavedUnicorns) : [],
    }
  } catch (error) {
    console.error('Error saving unicorn:', error)
    throw error
  }
}

// Get all saved unicorns for a user
export async function getSavedUnicorns(email: string) {
  try {
    console.log("getSavedUnicorns called with email:", email)
    
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    console.log("User found:", user)
    
    return user?.SavedUnicorns ? JSON.parse(user.SavedUnicorns) : []
  } catch (error) {
    console.error('Error getting saved unicorns:', error)
    throw error
  }
}

// Remove a saved unicorn
export async function removeUnicorn(email: string, companyName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const savedUnicorns = user.SavedUnicorns ? JSON.parse(user.SavedUnicorns) : []
    const updatedUnicorns = savedUnicorns.filter(
      (unicorn: string) => unicorn !== companyName
    )

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        SavedUnicorns: JSON.stringify(updatedUnicorns),
      },
    })

    return {
      email: updatedUser.email,
      SavedUnicorns: updatedUser.SavedUnicorns ? JSON.parse(updatedUser.SavedUnicorns) : [],
    }
  } catch (error) {
    console.error('Error removing unicorn:', error)
    throw error
  }
}

// Delete a user and all their saved unicorns
export async function deleteUser(email: string) {
  try {
    await prisma.user.delete({
      where: {
        email: email,
      },
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
} 