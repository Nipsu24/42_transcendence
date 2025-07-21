import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginView } from '../components/LoginView'
import { login } from '../services/auth'
import { getMe } from '../services/players'

interface LoginForm {
  email: string
  password: string
}

type FormErrors = {
  email?: string
  password?: string
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Min length 6'
    return errs
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setServerError(null)

    // Keep the input validation as-is
    const ve = validate()
    if (Object.keys(ve).length > 0) {
      setErrors(ve)
      return
    }

    setLoading(true)
    try {
      // Call login API: POST /api/login
      // Inside the service function, store JWT in localStorage and axios.defaults
      await login({ e_mail: form.email, password: form.password })

      // After successful login, get my info: GET /api/players/me
      // Token is automatically included in the header, so no additional params needed
      const me = await getMe()
      console.log('현재 로그인 유저:', me)

      // Navigate to home screen
      navigate('/myhome')
    } catch (err) {
      // Handle network/auth errors
      setServerError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (): void => {
    navigate('/')
  }

  return (
    <LoginView
      email={form.email}
      password={form.password}
      errors={errors}
      serverError={serverError}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  )
}
