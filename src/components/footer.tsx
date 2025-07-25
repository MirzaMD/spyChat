"use client"
import { HiChat, HiOutlineUser } from "react-icons/hi";
import { FaBell } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Footer(){
    const path=usePathname();
    return(
    <div className={`w-full flex justify-evenly fixed bottom-2 z-10`}>
     <Link href={"/land"}><HiChat className={`text-stone-50 ${path==="/land"?"bg-stone-800":""}
     text-4xl sm:text-6xl m-2 rounded-lg`}/></Link>
      <Link href={"/notifications"}><FaBell className={`text-stone-50 ${path==="/notifications"?"bg-stone-800":""}
     text-4xl sm:text-6xl m-2 rounded-lg`}/></Link>
       <Link href={"/profile"}><HiOutlineUser className={`text-stone-50 ${path==="/profile"?"bg-stone-800":""}
     text-4xl sm:text-6xl m-2 rounded-lg`}/></Link>
    </div>)
}