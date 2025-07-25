"use client"
import { io, Socket } from "socket.io-client";
import { useRef, useEffect } from "react";

const useSocket = (userId:string|null)=>{
    const socketRef = useRef<Socket|null>(null);

    useEffect(()=>{
        const socket=io("http://localhost:3005",{
            withCredentials:true
        })
        socketRef.current=socket;

        if(userId) socket.emit("join-room",userId);

        return ()=>{
            socket.disconnect();
        }
    },[userId])

    return socketRef;
}

export default useSocket;