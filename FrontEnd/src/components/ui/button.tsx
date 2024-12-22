import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={`flex items-center gap-1 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 ${props.className || ''}`}>
      {children}
    </button>
  )
}

