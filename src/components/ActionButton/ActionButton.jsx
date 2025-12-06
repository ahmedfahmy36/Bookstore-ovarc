import React from 'react'

const ActionButton = ({
    icon,
    action
}) => {
  return (
     <button
                  onClick={action}
                  className="bg-main grid place-items-center w-10 h-10 pointer-cursor"
                >
                  
                  <img src={icon} alt="Action" className="w-4 h-4" />
                </button>
  )
}

export default ActionButton