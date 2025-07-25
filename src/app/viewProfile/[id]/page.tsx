"use client"
import Image from "next/image";
import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { easeIn, motion, Variants } from "framer-motion";
import { useParams } from "next/navigation";
import { Footer } from "@/components/footer";
import "../../land/land.css"
type userInfo={
    profile:string;
    username:string;
    bio:string;
    email:string;
}
export default function ViewProfilePage(){
    const { id } = useParams();
    const [ user, setUser ] = useState<userInfo|null>(null);
    const fetchingDetails=useCallback(async ()=>{
       try{
         const res = await axios.get(` https://spychatbe.onrender.com/api/singleUser/${id}`,{
            withCredentials:true
        })
        setUser(res.data);
       }
       catch(err){
        console.log(err);
       }
    },[])

    useEffect(()=>{
        fetchingDetails();
    },[fetchingDetails])

    const anime:Variants={
        hid:{opacity:0,x:-50},
        show:{opacity:1,x:0,
            transition:{
                duration:1,
                delay:0.3,
                ease:easeIn,
                type:"spring",
                bounce:9,
                stiffness:80
            }
        }
    }
    return(
    <motion.div 
    variants={anime}
    initial="hid"
    animate="show"
    className={`w-full h-[90vh] flex flex-col justify-evenly items-center`}>
    <div className={`relative w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-4xl`}>
          <a href={user?user.profile:""}><Image
           src={user?user.profile:"/logo.png"}
           alt="Profile picture"
           fill 
           sizes="(max-width: 640px) 60px, 100px"
           priority
           className={`object-cover rounded-full`}
           /></a>
         </div>
         <div className={`w-fit flex flex-col justify-evenly items-center h-[30%] bg-stone-900 rounded-lg `}>
            <h3 className={`text-md sm:text-xl font-[cursive] text-stone-50`}>{user?user.username:"Guest"}</h3>
            <h1 className={`text-md sm:text-xl font-[cursive] text-stone-50`}>{user?user.bio:"Howdy partner 🤠"}</h1>
            <a href={`mailto:${user?user.email:""}`}><h2 
            className={`text-lg sm:text-xl font-[cursive]
             text-[#e8e87b]`}>{user?user.email:""}</h2></a>
         </div>
         <Footer/>
    </motion.div>
    )
}