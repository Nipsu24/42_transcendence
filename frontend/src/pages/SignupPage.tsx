// import React, { useState, ChangeEvent, FormEvent } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { SignUpView } from '../components/SignUpView'
// import playerService  from '../services/players'

// export default function SignUpPage() {
//   const navigate = useNavigate()
//   const [form, setForm]     = useState({ name: '', email: '', password: '' })
//   const [errors, setErrors] = useState<{ name?:string; email?:string; password?:string }>({})
//   const [serverError, setServerError] = useState<string|null>(null)
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setForm(f => ({ ...f, [name]: value }))
//     setErrors(prev => ({ ...prev, [name]: undefined }))
//   }

//   const validate = () => {
//     const errs: typeof errors = {}
//     if (!form.name)            errs.name = 'Name is required'
//     if (!form.email)           errs.email = 'Email is required'
//     else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email'
//     if (!form.password)        errs.password = 'Password is required'
//     else if (form.password.length < 6) errs.password = 'Min length 6'
//     return errs
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setServerError(null)

//     const ve = validate()
//     if (Object.keys(ve).length) {
//       setErrors(ve)
//       return
//     }

//     setLoading(true)
//     try {
//       const allPlayers = await playerService.getAll()
//       const exists = allPlayers.some(p => p.email === form.email)
//       if (exists) throw new Error('User already exists')

//       localStorage.setItem('authToken', 'dummy-token')
//       navigate('/myhome')
//     } catch (err) {
//       setServerError((err as Error).message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleClose = () => navigate('/')

//   return (
//     <SignUpView
//       form={form}
//       errors={errors}
//       serverError={serverError}
//       loading={loading}
//       onChange={handleChange}
//       onSubmit={handleSubmit}
//       onClose={handleClose}
//     />
//   )
// }



import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignUpView } from '../components/SignUpView'
import playerService from '../services/players'

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

export default function SignUpPage(){
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
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Min length 6'
    return errs
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setServerError(null)

    const ve = validate()
    if (Object.keys(ve).length > 0) {
      setErrors(ve)
      return
    }

    setLoading(true)
    try {
      const allPlayers = await playerService.getAll()
      const exists = allPlayers.some(p => p.email === form.email)
      if (exists) throw new Error('User already exists')

      localStorage.setItem('authToken', 'dummy-token')
      navigate('/myhome')
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (): void => {
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
