"use client"
import Link from "next/link";
import { FaMessage, FaUser } from "react-icons/fa6";
import Image from "next/image";
type Tdata={
    pic:string;
    link1:string;
    link2:string;
    username:string
}
export function ProfilePage({pic,link1,link2,username}:Tdata){
    return(
        <div className={`w-full flex flex-col justify-center items-center gap-y-2`}>
        <div className={`relative w-[120px] h-[120px] sm:w-[300px] sm:h-[300px] rounded-full`}>
            <Image
              src={pic?pic:"/logo.png"}
              alt="profile"
              fill
              sizes="(max-width: 640px) 120px, 300px"
              priority
              className={`object-cover rounded-full`}
              />
        </div>
        <h1 className={`text-sm sm:text-lg font-bold font-serif text-stone-50 mt-2`}>
            {username.length>10?`${username.slice(0,10)}`:username}
        </h1>
        <div className={`w-full flex justify-evenly items-center`}>
         <Link href={link1?link1:"/"}><FaUser className={`text-2xl sm:text-4xl text-[whitesmoke]`}/></Link>
          <Link href={link2?link2:"/"}><FaMessage className={`text-2xl sm:text-4xl text-[whitesmoke]`}/></Link>
        </div>
        </div>
    )
}