import React from 'react'

const Loading = () => {
return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
    }}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="50" 
            height="50" 
            viewBox="0 0 100 100" 
            fill="none"
        >
            <circle 
                cx="50" 
                cy="50" 
                r="35" 
                stroke="black" 
                strokeWidth="5" 
                strokeDasharray="164.93361431346415 56.97787143782138" 
                strokeLinecap="round"
            >
                <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    repeatCount="indefinite" 
                    dur="1s" 
                    values="0 50 50;360 50 50" 
                />
            </circle>
        </svg>
    </div>
)
}

export default Loading