import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_BASE_URL + '/players'

export interface Match {
	id: number
	date: string
	playerOneName: string
	playerTwoName: string | null
	resultPlayerOne: number
	resultPlayerTwo: number
	aiOpponent: boolean
}
  
export interface Stats {
	id: number
	victories: number
	defeats: number
	matches: Match[]
}
  
export interface Friend {
	id: number
	name: string
	avatar:string
	online: boolean
}
  
export interface Player {
	id: number
	name: string
	password: string
	e_mail: string
	online: boolean
	avatar: string
	stats: Stats
	friends: Friend[]
}  


// Fetch list of all players
export const getAll = async (): Promise<Player[]> => {
	try {
	  const res = await axios.get<Player[]>(baseUrl)
	  return res.data
	} catch (error) {
	  console.error('getAll failed:', error)
	  throw error
	}
  }

// Fetch current user's profile
export const getMe = async (): Promise<Player> => {
	try {
	  const res = await axios.get<Player>(`${baseUrl}/me`)
	  return res.data
	} catch (error) {
	  console.error('getMe failed:', error)
	  throw error
	}
  }

export type PlayerUpdateRequest = Partial<
  Pick<Player, 'name' | 'e_mail' | 'avatar'>
>

// Update current user's profile
export const updateMe = async (
  payload: PlayerUpdateRequest
): Promise<Player> => {
  try {
    const res = await axios.put<Player>(`${baseUrl}/me`, payload)
    return res.data
  } catch (error) {
    console.error('updateMe failed:', error)
    throw error
  }
}

// Delete current user's account
export const deleteMe = async (): Promise<void> => {
	try {
	  await axios.delete(`${baseUrl}/me`)
	} catch (error) {
	  console.error('deleteMe failed:', error)
	  throw error
	}
  }
  
 // Add a friend by name
  export interface FriendResponse { name: string; online: boolean; avatar: string }
  
  export const addFriend = async (
	name: string
  ): Promise<FriendResponse> => {
	try {
	  const res = await axios.post<FriendResponse>(
		`${baseUrl}/me/friends`,
		{ name }
	  )
	  return res.data
	} catch (error) {
	  console.error('addFriend failed:', error)
	  throw error
	}
  }

  // Remove a friend by name
  export const removeFriend = async (
	name: string
  ): Promise<void> => {
	try {
	  await axios.delete(`${baseUrl}/me/friends`, { data: { name } })
	} catch (error) {
	  console.error('removeFriend failed:', error)
	  throw error
	}
  }
  
// Upload avatar image (max size: 1MB)
  export interface UploadAvatarResponse { url: string }

export const uploadAvatar = async (
	file: File
  ): Promise<UploadAvatarResponse> => {
	try {
	  const MAX_FILE_SIZE = 1 * 1024 * 1024
	  if (file.size > MAX_FILE_SIZE) {
		throw new Error('File is too large. Maximum allowed size is 1MB.')
	  }
  
	  const form = new FormData()
	  form.append('avatar', file)
  
	  const res = await axios.post<UploadAvatarResponse>(
		`${baseUrl}/me/upload`,
		form
	  )
  
	  return res.data
	} catch (error) {
	  console.error('uploadAvatar failed:', error)
	  throw error
	}
  }
  
  