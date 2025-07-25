"use client"
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { easeOut, motion, Variants } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/footer";
type ChatType={
    senderId:string,
    text:string
}
type userType={
    _id:string
}
export default function Notifications(){
    const [ chats, setChats ] = useState<ChatType[]>([]);
    const [ receivedChats, setReceivedChats ] = useState<ChatType[]>([]);
    const [ user, setUser ] = useState<userType|null>(null);
    const anime:Variants={
        hid:{opacity:0},
        show:{opacity:1,
            transition:{
                duration:1,
                delay:0.1,
                ease:easeOut
            }
        }
    }
    const fetchingChats= useCallback(async ()=>{
          try{
            const res = await axios.get(" https://spychatbe.onrender.com/api/chats",{
                withCredentials:true
            })
            if(res.status===200){
                setChats(res.data);
                setReceivedChats(res.data);
            }
            const response = await axios.get(" https://spychatbe.onrender.com/api/currentUser",{
                withCredentials:true
            })
            if(response.status===200){
                setUser(response.data)
            }
          }
          catch(err){
            console.log(err);
          }
    },[])

    useEffect(()=>{
        fetchingChats();
    },[fetchingChats])

    useEffect(() => {
  if (user && chats.length > 0) {
    const filtered = chats.filter((val) => val.senderId !== user._id);
    setReceivedChats(filtered);
  }
}, [user, chats]);
    return(
        <motion.div 
        variants={anime}
        initial="hid"
        animate="show"
        className={`min-h-[100vh] w-full flex flex-col items-center`}>
           {receivedChats.map((val,idx)=>(
            <div key={idx}
            className={`w-[90%] h-[100px] font-serif text-sm sm:text-bold border-2 border-stone-50
                text-white flex justify-between mt-3 rounded-md`}>
                    <Link href={`/message/${val.senderId}`}>
                 <p className={`font-bold ml-2`}> you received a message!</p></Link>
                 <p className={`font-mono text-[#f5f5f58a] mr-4`}> {new Date().toLocaleString()}</p>
                </div>
           ))}
           <div className={`h-200px`}></div>
           <Footer/>
        </motion.div>
    )
}