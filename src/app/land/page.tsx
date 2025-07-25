"use client"
import { ProfilePage } from "@/components/profile";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import "../land/land.css";
type Tdata={
    profile:string;
    _id:string;
    username:string;
}

export default function LandPage(){
    const [ users, setUsers ] = useState<Tdata[]>();
    const [filteredUsers, setFilteredUsers] = useState<Tdata[]>([]);
    const fetchingUsers=useCallback(async ()=>{
         try{
            const res = await axios.get("http://localhost:3005/api/allusers",{
            withCredentials:true
         })
         if(res){
            setUsers(res.data);
            setFilteredUsers(res.data);
         }
         }
         catch(err){
            console.log(err);
         }
    },[])
    useEffect(()=>{
        fetchingUsers();
    },[fetchingUsers])
   return (
        <div className={`flex flex-col h-full w-full justify-center items-center`}>
        <input type="search" 
        className={`mt-6 border-2 border-stone-50 rounded-4xl
         text-stone-50 text-md sm:text-lg w-[80%]`}
        placeholder="enter the username"
        onChange={(e)=>{
           const keyword = (e.target.value).toLowerCase();
           const filtered= (users || [])?.filter((u)=>u.username.toLowerCase().includes(keyword));
           setFilteredUsers(filtered);
        }}
        />
        <motion.div className={`w-full grid grid-cols-2 sm:grid-cols-3 place-items-center gap-y-2`}>
        {filteredUsers?.map((val,idx)=>(
            <div key={idx}
            className={`mt-4`}>
             <ProfilePage pic={val.profile} link1={`/viewProfile/${val._id}`} link2={`/message/${val._id}`} />
            </div>
        ))}
    </motion.div>
    <div className={`h-[200px]`}></div>
    <Footer/>
    </div>

   )
}