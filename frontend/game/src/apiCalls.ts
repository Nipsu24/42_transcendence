import axios from 'axios'

import { baseUrl } from "../../src/services/players"

// Define types
export interface MatchRecord {
  playerTwoName?: string
  resultPlayerOne?: number
  resultPlayerTwo?: number
  aiOpponent?: boolean
}

export interface StatsUpdate {
  victories?: number
  defeats?: number
}

// Create a new match record
export const createRecord = async (
  record: MatchRecord
): Promise<void> => {
  try {
    await axios.post(`${baseUrl}/me/matches`, record, {
      headers: authHeaders(),
    })
  } catch (error) {
    console.error('createRecord failed:', error)
    throw error
  }
}

// Update current user’s stats
export const updateMyStats = async (
  stats: StatsUpdate
): Promise<void> => {
  try {
    await axios.put(`${baseUrl}/me/stats`, stats, {
      headers: authHeaders(),
    })
  } catch (error) {
    console.error('updateMyStats failed:', error)
    throw error
  }
}

// export const updatePlayerStats = async (
//   playerId: number,
//   stats: StatsUpdate
// ): Promise<void> => {
//   try {
//     await axios.put(`${baseUrl}/${playerId}/stats`, stats, {
//       headers: authHeaders(),
//     })
//   } catch (error) {
//     console.error('updatePlayerStats failed:', error)
//     throw error
//   }
// }

function authHeaders() {
  const token = localStorage.getItem('jwtToken')
  if (!token) throw new Error('No token found')
  return {
    Authorization: `Bearer ${token}`,
  }
}
