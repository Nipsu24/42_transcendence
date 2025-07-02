import React from 'react';

interface PrimaryButtonProps {
	onClick?: () => void;
	type?: 'button' | 'submit';
	loading?: boolean;
	children: React.ReactNode;
	className?: string;   
  }
  
  export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	onClick,
	type = 'button',
	loading,
	children,
	className = '',       
  }) => (
	<button
	  type={type}
	  onClick={onClick}
	  disabled={loading}
	  className={`
		font-body tracking-wider w-full py-3 mb-6
		text-white font-medium rounded-lg transition
		disabled:opacity-50
		${className}          // ← merge in your overrides
	  `}
	>
	  {loading ? 'Loading…' : children}
	</button>
  )
  
