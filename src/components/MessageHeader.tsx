"use client";
import Image from "next/image";
import { FaUndo } from "react-icons/fa";
import Link from "next/link";
export function MessageHeader({profile,username}:{profile:string | undefined,username:string | undefined} ){
    return(
        <div className={`w-full flex justify-between items-center h-[120px] bg-stone-900`}>
       <Link href={"/land"}
       className={`ml-4`}><FaUndo className={`text-xl sm:text-3xl text-white `}/></Link>
         <div className={`relative w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] rounded-full`}>
                  <Image
                   src={profile?profile:"/logo.png"}
                   alt="Profile picture"
                   fill 
                   sizes="(max-width: 640px) 60px, 100px"
                   priority
                   className={`object-cover rounded-full`}
                   />
                 </div>
            <h1 
            className={`text-sm sm:text-lg text-stone-50 
            font-serif font-bold mr-4`}>{username?username:"Guest"}</h1>     
        </div>
    ) 
}