import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-gray-400 ${props.className || ''}`}
    />
  )
}
