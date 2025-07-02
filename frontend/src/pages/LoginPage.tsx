import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginView }     from '../components/LoginView'
import playerService     from '../services/players'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const errs: typeof errors = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Min length 6'
    return errs
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const ve = validate()
    if (Object.keys(ve).length) {
      setErrors(ve)
      return
    }

    setLoading(true)
    try {
      const allPlayers = await playerService.getAll()
      const match = allPlayers.find(
        p => p.email === form.email && p.password === form.password
      )
      if (!match) throw new Error('Invalid credentials')

      localStorage.setItem('authToken', 'dummy-token')
      navigate('/myhome')
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => navigate('/')

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


