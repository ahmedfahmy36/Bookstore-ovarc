import React from 'react'

const ListItem = ({active, title, icon}) => {
  return (
    <div className={"flex justify-center items-center border-l-2" + (active ? ' border-l-main text-main' : ' border-l-transparent text-inactive')}>
        <img src={icon} alt="icon" className={'ml-[29px] w-4 h-4 ' + (active ? ' text-main' : '')} />
        <p className='ml-[29px] '>{title}</p>
    </div>
  )
}

export default ListItem