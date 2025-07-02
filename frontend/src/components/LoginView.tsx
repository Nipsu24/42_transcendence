import React from 'react'
import { Link } from 'react-router-dom'
import { AuthForm }      from './AuthForm'
import { PrimaryButton }  from './PrimaryButton'

interface LoginViewProps {
  email: string
  password: string
  errors: { email?: string; password?: string }
  serverError: string | null
  loading: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onSubmit: React.FormEventHandler<HTMLFormElement>
  onClose: () => void
}

export const LoginView: React.FC<LoginViewProps> = ({
  email, password, errors, serverError, loading, onChange, onSubmit, onClose
}) => (
  <div className="relative bg-gray-700 min-h-screen flex items-center justify-center px-4">
    {/* Close */}
    <button
      onClick={onClose}
      className="font-body absolute top-4 right-6 z-50 text-white font-medium text-sm sm:text-base hover:opacity-60 transition"
    >
      × CLOSE
    </button>

    <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-heading font-bold tracking-wider text-gray-700 text-center mb-1">
        Log In
      </h2>
      <p className="text-center font-body tracking-wider text-gray-600 mb-6">
        Access your account
      </p>

      <AuthForm
        email={email}
        password={password}
        errors={errors}
        serverError={serverError}
        loading={loading}
		onChange={onChange}   
		onSubmit={onSubmit}
      >
    	<PrimaryButton
			type="submit"
			loading={loading}
			className="font-nody tracking-wider bg-[#0489C2] hover:bg-[#26B2C5] w-full mt-4"
      >
        Log In
      </PrimaryButton>
	  </AuthForm>
      <div className="font-body tracking-wider text-center text-sm text-gray-600 mt-0.1">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-gray-700 hover:underline">
          Sign Up
        </Link>
      </div>

      <div className="font-body tracking-wider my-3.5 flex items-center text-[#475569]">
        <hr className="flex-grow border-[#334155]" />
        <span className="px-3 text-sm">or</span>
        <hr className="flex-grow border-[#334155]" />
      </div>

      <PrimaryButton
        type="button"
        loading={false}
        className="w-full inline-flex items-center justify-center gap-0.5 py-0.05 bg-[#26B2C5] hover:bg-[#55CFD4] text-gray-100"
        onClick={() => {
          /* Google OAuth flow */
        }}
      >
        Sign in with<img src={new URL('../assets/google.svg', import.meta.url).href} alt="Google logo" className="my-0.05 1w-15 h-15 ml-0.5" />
      </PrimaryButton>
    </div>
  </div>
)
