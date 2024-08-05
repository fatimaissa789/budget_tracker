'use client'
import React, { useState } from 'react'
import Logo, { LogoMobile } from './Logo'
import path from 'path'
import { Label } from '@/components/ui/label';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeSwitchBtn } from './ThemeSwitchBtn';
import { Button, buttonVariants } from './ui/button';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"

function Navbar() {
  return <>
  <DesktopNavbar/>
  <MobileNavbar/>

  </>
}
const items = [
    {label:'Dashboard', link:'/'},
    {label:'Transactions', link:'/transactions'},
    {label:'Gestion Categorie', link:'/manage'},
];

function MobileNavbar(){
    const [isOpen, setIsopen] = useState(false);
   
    return (
        <div className='block border-separate bg-background md:hidden'>
            <nav className='container flex items-center
            justify-between px-8'>
            <Sheet open={isOpen} onOpenChange={setIsopen}>
                    <SheetTrigger asChild>
                        <Button variant='ghost' size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className='w-[300px] sm:w-[540px]'
                    side={'left'}>
                        <Logo/>
                        <div className='flex flex-col gap-1 pt-4'>
                            {items.map(item => (
                                <NavbarItem
                                key={item.label}
                                link={item.link}
                                label={item.label}
                                clickCallback={() => setIsopen((prev) => !prev)}/>
                            ))}
                        </div>
                    </SheetContent>
               </Sheet> 
               <div className='flex h-[80px] min-h-[60px]
               items-center gap-x-4 '>
                   <LogoMobile/>
               </div>
               <div className='	flex items-center gap-2'>
                   <ThemeSwitchBtn/>
                   <UserButton afterSignOutUrl='/sign-in' />
               </div>
            </nav>
        </div>

    )
}
 function DesktopNavbar() {
    return (
        <div className='hidden border-b border-separate 
        bg-background md:block'>
            <nav className='container flex items-center justify-between
            px-8'>
                <div className='flex h-[80px] min-h-[60px] items-center
                gap-x-4'>
                    <Logo/>
                    <div className='flex h-full'>
                        {items.map(item => (
                            <NavbarItem
                            key={item.label}
                            link={item.link}
                            label={item.label}/>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <ThemeSwitchBtn/>
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
        </div>
    )
 }
 function NavbarItem ({link, label, clickCallback}: 
    {link: string, label: string, clickCallback?: () => void}) {
        const pathname = usePathname();
        const isActive = pathname === link;
        return <div className='relative flex items-center'>
            <Link href={link} className={
                cn(
                    buttonVariants({
                        variant: 'ghost',
                    }),
                    "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
                    isActive && "text-foreground"
                )
            }
            onClick={() => {
                if (clickCallback) clickCallback();

            }}>
                {label}</Link>
            {
                isActive && (
                    <div className='absolute -bottom-[2px] left-1/2
                    hidden h-[2px] w-[80px] -translate-x-1/2 rounded-xl bg-foreground md:block'></div>
                )
            }
            </div>

 }
export default Navbar

