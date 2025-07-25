"use client"
import { easeInOut, motion, Variants } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useEffect, useCallback } from "react";
import "./land/land.css";
import { useRouter } from "next/navigation";
export default function Home(){
  const route=useRouter();
const popAnime:Variants={
  hid:{scale:1},
  show:{
       scale:[1.2,1.3,1.4,1.5,1],
       transition:{
        delay:1,
        duration:2,
        ease:easeInOut,
        repeat:Infinity,
       }
  }
}
const sending = useCallback( async ()=>{
   try{
     const res = await axios.get(" https://spychatbe.onrender.com/api/currentUser",{
      withCredentials:true
    })
    if(res.status===200) setTimeout(()=>{route.replace("/land")},1000)
   }
  catch(err){
    console.log(err);
    setTimeout(()=>{
      route.replace("/login")
    },1000);
  }
},[])

useEffect(()=>{
  sending();
},[sending])
  return (
    <div className={`h-[100vh] w-full flex justify-center items-center`}>
      <motion.div 
      variants={popAnime}
      initial="hid"
      animate="show"
      className={`relative w-[120px] h-[120px] sm:w-[300px] sm:h-[300px] top-[1/2]`}>
       <Image
         src="/logo.png"
         alt="loader"
         fill
         sizes="(max-width: 640px) 60px, 100px"
         priority
         className={`object-center`}
         />
      </motion.div>
    </div>
  )
}