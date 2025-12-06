import React from 'react'
import { useLocation } from 'react-router-dom'
import usrImg from '../assets/usr.png'
const Topbar = () => {
  const location = useLocation()
  const path = location.pathname;
  const title = {
    '/': {
      title: 'Shop',
      subtitle: 'Shop > Books',
    },
      
    '/stores': {
      title: 'Stores',
      subtitle: 'Admin > Stores',
    },
    '/author': {
      title: 'Authors',
      subtitle: 'Admin > Authors',
    },
    '/books': {
      title: 'Books',
      subtitle: 'Admin > Books',
    },
    '/store/:storeId': {
      title: 'Store Inventory',
      subtitle: 'Admin > Store Inventory',
    },
    '/browsebooks': {
      title: 'Browse Books',
      subtitle: 'Shop > Books',
    },
    '/browseauthors': {
      title: 'Browse Authors',
      subtitle: 'Shop > Authors',
    },
  }

  return (
    <div className='h-24 border-b border-b-secondary-text flex justify-between items-center'>
      <div className='flex flex-col justify-start items-start '>
        <p className='text-lg text-secondary-text'>{title[path]?.title}</p>
        <p className='font-light text-secondary-text'>{title[path]?.subtitle}</p>

      </div>
      <div className='flex-1 flex justify-end items-center'>
        <img src={usrImg} alt="profile" className='ml-4 rounded' />
        <p className='text-secondary-text font-light ml-1 h-full'>User Name</p>

    </div>
    </div>
  )
}

export default Topbar