"use client"
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useCallback, useState, useMemo } from "react";
import { MessageHeader } from "@/components/MessageHeader";
import { easeIn, motion, Variants } from "framer-motion";
import { FiSend } from "react-icons/fi";
import useSocket from "@/hooks/useSocket";
type reciverInfo={
    _id:string,
    profile:string;
    username:string;
    bio:string;
    email:string;
}
type ChatType={
    senderId:string,
    text:string
}
export default function MessagePage(){
    const { id } = useParams();
     const [ receiver, setReceiver ] = useState<reciverInfo|null>(null);
     const [ user, setUser ] = useState<reciverInfo|null>(null);
     const socketRef=useSocket(user?._id?? null);
     const [ chats, setChats ] = useState<ChatType[]>([]);
     const [ msg, setMsg ] = useState<string>("");

    const fetchingDetails=useCallback(async ()=>{
       try{
         const res1 = await axios.get(` https://spychatbe.onrender.com/api/singleUser/${id}`,{
            withCredentials:true
        })
        setReceiver(res1.data);
        const res2 = await axios.get(` https://spychatbe.onrender.com/api/currentUser`,{
            withCredentials:true
        })
        setUser(res2.data);
       }
       catch(err){
        console.log(err);
       }
    },[])
    const roomId = useMemo(()=>{
         if(user && receiver){
         const ids=[user._id,receiver._id].sort();
          return ids.join("-");
         }
         return null;
    },[user,receiver])

    useEffect(() => {
  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(` https://spychatbe.onrender.com/api/messages/${roomId}`, {
        withCredentials: true,
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  fetchMessages();
}, [roomId]);

    useEffect(()=>{
        fetchingDetails();
    },[fetchingDetails])

   useEffect(() => {
  const socket = socketRef.current;
  if (socket && user && receiver && roomId) {
    socket.emit("join-room", roomId);
    console.log("Joined room:", roomId);
  }
  }, [socketRef, user, receiver, roomId]);

   useEffect(() => {
  const socket = socketRef.current;

  if (!socket || !user || !receiver) return;

  const handleReceive = (msg: { senderId: string; text: string }) => {
    console.log("Received:", msg);
    if (msg.text.trim() !== "") {
      setChats((prev) => [...prev, msg]);
    }
  };

  socket.on("message-received", handleReceive);

  return () => {
    socket.off("message-received", handleReceive);
  };
}, [socketRef, user, receiver]);

    const sendMsg=()=>{
        const socket = socketRef.current;
        const trimmed=msg.trim();

        if(socket && trimmed !=="" && roomId){
            socket.emit("message-sent",{
                to:roomId,
                msg:trimmed,
                senderId:user?._id
            })
            setMsg("");
        }
    }
    const anime:Variants={
      hid:{opacity:0},
      show:{opacity:1,
        transition:{
          duration:0.5,
          delay:0.25,
          ease:easeIn
        }
      }
    }
    return(
        <motion.div
        variants={anime}
        initial="hid"
        animate="show"
        >
            <MessageHeader profile={receiver?.profile} username={receiver?.username}/>

             {chats?.map((val,idx)=>(
            <div key={idx}
            className={`w-[90%] flex flex-col ${(val.senderId===user?._id)?"self-end items-end":"self-start items-start"}`}>
                <p 
                className={`text-sm sm:text-lg 
                ${(val.senderId===user?._id)?"text-white bg-stone-700  ":"text-black bg-white "}  
                rounded-lg font-serif font-bold m-2 p-1`}>{val.text}</p>
            </div>
            ))}
            
           <div className={`w-full flex justify-center items-center gap-x-3 
            fixed bottom-2`}>
           
             <textarea
              placeholder="Enter your message"
              className={`w-[85%] max-h-[150px] min-h-[40px] overflow-y-auto resize-none
              rounded-md border-2 border-stone-50 text-md sm:text-lg
              text-white font-serif bg-transparent px-2 py-1`}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
               />
              <button type="button" onClick={sendMsg}
              className={`cursor-pointer p-1 sm:p-1 bg-green-500 active:bg-green-700
              text-md sm:text-lg text-stone-50 rounded-xl`}>
                <FiSend className={`text-lg sm:text-xl text-stone-50`} />
                </button>  
            </div> 
        </motion.div>
    )
}

