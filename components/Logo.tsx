import React from 'react'
import Image from 'next/image'
function Logo() {
  return (
   <a href='/' className='flex items-center gap-1 '>
    <Image 
    src="/favicon.ico" alt="logo" width={40} height={40}/>
    <p className=' bg-gradient-to-r from-blue-400 
    to-blue-500 bg-clip-text text-1xl font-bold leading-tight tracking-tighter text-transparent '>
        GestionBudget
    </p>

   </a>
  )
}
export function LogoMobile() {
  return (
   <a href='/' className='flex items-center gap-1 '>
  {/*   <Image 
    src="/favicon.ico" alt="logo" width={40} height={40}/> */}
    <p className=' bg-gradient-to-r from-blue-400 
    to-blue-500 bg-clip-text text-1xl font-bold leading-tight tracking-tighter text-transparent '>
        GestionBudget
    </p>

   </a>
  )
}

export default Logo