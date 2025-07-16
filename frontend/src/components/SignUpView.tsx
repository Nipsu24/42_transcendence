import React from 'react'
import { Link } from 'react-router-dom'
import { InputField }   from './InputField'
import { AuthForm }     from './AuthForm'
import { PrimaryButton } from './PrimaryButton'

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
interface SignUpViewProps {
	form: SignUpForm
	errors: FormErrors
	serverError: string | null
	loading: boolean
	onChange: React.ChangeEventHandler<HTMLInputElement>
	onSubmit: React.FormEventHandler<HTMLFormElement>
	onClose: () => void
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  form, errors, serverError, loading, onChange, onSubmit, onClose,
}) => (
  <div className="relative bg-gray-700 min-h-screen flex items-center justify-center px-4">
    {/* Close */}
    <button
      onClick={onClose}
      className="absolute top-4 right-6 z-50 text-white font-body font-medium text-sm sm:text-base hover:opacity-60 transition"
    >
      × CLOSE
    </button>

    <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-heading tracking-wider font-bold text-gray-700 text-center mb-1">
        Sign Up
      </h2>
      <p className="text-center font-body tracking-wider text-gray-600 mb-6">
        Join the legendary game of Pong
      </p>

      <InputField
        id="name"
        type="text"
        placeholder="Name"
        value={form.name}
        error={errors.name}
        onChange={onChange}
      />

      <AuthForm
        email={form.email}
        password={form.password}
        errors={errors}
        serverError={serverError}
        loading={loading}
        onChange={onChange}
        onSubmit={onSubmit}
      >

		<PrimaryButton
			type="submit"
			loading={loading}
			className="bg-[#FE8915] hover:bg-[#FEF018] w-full mt-4"
		>
			Sign Up
		</PrimaryButton>
	  </AuthForm>


      <div className="font-body tracking-wider text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-gray-700 font-semibold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  </div>
)
