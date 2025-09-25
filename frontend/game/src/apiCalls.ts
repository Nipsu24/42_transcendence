import axios from 'axios'

import { baseUrl } from "../../src/services/players"

// Define types
export interface MatchRecord {
  playerOneName?: string
  playerTwoName?: string
  resultPlayerOne?: number
  resultPlayerTwo?: number
  aiOpponent?: boolean
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

function authHeaders() {
  const token = localStorage.getItem('jwtToken')
  if (!token) throw new Error('No token found')
  return {
    Authorization: `Bearer ${token}`,
  }
}
