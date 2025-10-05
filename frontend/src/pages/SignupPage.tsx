import { useState, ChangeEvent, FormEvent } from 'react'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { SignUpView } from '../components/SignUpView'
import { register } from '../services/auth'
import { login } from '../services/auth'

interface SignUpForm {
  name: string
  email: string
  password: string
}

type FormErrors = {
  name?: string
  email?: string
  password?: string
}

export default function SignUpPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
  })
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
    if (!form.name) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6)
      errs.password = 'Min length 6'
    return errs
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const ve = validate()
    if (Object.keys(ve).length > 0) {
      setErrors(ve)
      return
    }

    setLoading(true)
    try {
      // Sign up
      await register({
        name: form.name,
        e_mail: form.email,
        password: form.password,
      })

      // Login
      await login({
        e_mail: form.email,
        password: form.password,
      })

	  // Navigate to home screen
      navigate('/myhome')
    } catch (err : unknown) {
	  if (err instanceof AxiosError) {
    	// pull out your backend’s “already taken” message
    	const message = err?.response?.data?.error ?? err.message
    	setErrors({ name: message, email: message })
	  }
	  
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <SignUpView
      form={form}
      errors={errors}
      serverError={serverError}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  )
}
