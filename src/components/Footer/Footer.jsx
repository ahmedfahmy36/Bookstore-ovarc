import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full h-12  bg-gray-50 ">
      <div className="max-w-screen-xl mt-2 px-4">
        <div className="flex justify-center items-center text-sm text-gray-600 gap-1">
          <span>Created by </span>
          <a
            href="https://eslam-ahmed.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 font-medium text-gray-900 hover:text-gray-600"
          >
            Eslam Ahmed
          </a>
          <span>{" "}© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer