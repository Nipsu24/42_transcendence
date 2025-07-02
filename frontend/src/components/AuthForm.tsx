import React, { ReactNode } from 'react'
import { InputField } from './InputField'
import { ErrorBanner } from './ErrorBanner'

interface AuthFormProps {
  email: string
  password: string
  errors: { email?: string; password?: string }
  serverError: string | null
  loading: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onSubmit: React.FormEventHandler<HTMLFormElement>
  children: ReactNode 
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  errors,
  serverError,
  loading,
  onChange,
  onSubmit,
  children,
}) => (
  <>
    {serverError && <ErrorBanner message={serverError} />}
    <form onSubmit={onSubmit} noValidate>
      <InputField
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        error={errors.email}
        onChange={onChange}
      />
      <InputField
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        error={errors.password}
        onChange={onChange}
      />
      {children}
    </form>
  </>
)
