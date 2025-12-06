import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import notFoundImage from "../assets/notfound.webp"

const NotFound = () => {
    const [now, setNow] = React.useState(Date.now())
    const navigate = useNavigate()
    const timeNow = useRef(Date.now())
    const nextMinute = useRef(timeNow.current + 60 * 1000)
   
    // redirect to home page after 1 minute using react router
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now())
            if (Date.now() > nextMinute.current) {
                navigate('/')
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [navigate])
    
    return (
        <div className='flex flex-col items-center justify-center h-max w-full p-4'>
            <img className='w-1/2' src={notFoundImage} alt="Not Found" />
            <p className='mt-4 text-lg'>Sorry, the page you are looking for does not exist.</p>   
            <p className='mt-2 text-sm text-gray-500'>You will be redirected to the homepage in {Math.ceil((nextMinute.current - now) / 1000)} seconds.</p>
            <button 
                onClick={() => navigate('/')}
                className='mt-4 text-blue-500 hover:underline'
            >
                Go to Homepage
            </button>
        </div>
    )
}

export default NotFound