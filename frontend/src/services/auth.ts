import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

// Type for login request payload
export interface LoginRequest {
  e_mail: string
  password: string
}
// Type for login response payload
export interface LoginResponse {
  token: string
}

// Function to log in the user
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(
      `${baseUrl}/login`,
      credentials
    )
    const { token } = res.data

     // Save token to local storage
    localStorage.setItem('jwtToken', token)
 	// Set token in default axios Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    return { token }
  } catch (error) {
    console.error('login failed:', error)
    throw error
  }
}

// Type for registration request payload
export interface RegisterRequest {
  name: string
  e_mail: string
  password: string
}
// Type for registration response payload (can be detailed later)
export type RegisterResponse = any

// Function to register a new user
export const register = async (
  userInfo: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const res = await axios.post<RegisterResponse>(
      `${baseUrl}/registration`,
      userInfo
    )
    return res.data
  } catch (error) {
    console.error('register failed:', error)
    throw error
  }
}

// Logout: send request to backend and clear stored tokens
export const logout = async (): Promise<void> => {
	try {
	  // Call PUT /players/me/logout
	  await axios.put(`${baseUrl}/players/me/logout`);
	} catch (err) {
	  console.error('Logout API failed:', err);
	} finally {
	  // Remove JWT from localStorage and axios default headers
	  localStorage.removeItem('jwtToken');
	  delete axios.defaults.headers.common['Authorization'];
	}
  };
