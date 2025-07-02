import React, { ChangeEvent } from 'react';
import { ErrorBanner } from './ErrorBanner';

interface InputFieldProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  id, label, type = 'text', placeholder, value, error, onChange
}) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block mb-1 text-gray-700 font-medium">{label}</label>}
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-invalid={!!error}
      className="font-body tracking-wider 
	  			w-full px-4 py-3
				 bg-gray-100 border border-gray-100
				 text-gray-600 placeholder-gray-400 
				 rounded 
				 focus:outline-none 
				 focus:ring-2
				  focus:ring-gray-200"
    />
    {error && <ErrorBanner message={error} />}
  </div>
);
