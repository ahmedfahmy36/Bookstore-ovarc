import React from 'react'
import logo from '../../assets/logo.svg'
import { NavLink } from 'react-router-dom'
import ListItem from './ListItem'
import { useLocation } from 'react-router-dom'
import shopIcon from '../../assets/shop.jpg'
import storeIcon from '../../assets/Bookstore.svg'
import authorIcon from '../../assets/Featherpen.svg'
import bookIcon from '../../assets/Book.svg'

const Sidelist = () => {
  const location = useLocation()
  const isActive = (path) => {
    return location.pathname === path
  }
  return (
    <div className='w-[248px] flex flex-col h-screen'>

      <div className='logoSection h-36 pl-[29]' >

        <img src={logo} alt="logo" className='inline-block ml-[29px] mt-[51px]' />
      </div>
      <ul className='flex flex-col justify-start items-start h-full  gap-4'>
        
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          <ListItem active={isActive('/')} title="Shop" icon={shopIcon} />
        </NavLink>

        <NavLink to="/stores" className={({ isActive }) => (isActive ? 'active' : '')}>
          <ListItem active={isActive('/stores')} title="Stores" icon={storeIcon} />
        </NavLink>
        <NavLink to="/author" className={({ isActive }) => (isActive ? 'active' : '')}>
          <ListItem active={isActive('/author')} title="Author" icon={authorIcon} />
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')}>
          <ListItem active={isActive('/books')} title="Books" icon={bookIcon} />
        </NavLink>
      </ul>
    </div>
  )
}

export default Sidelist

