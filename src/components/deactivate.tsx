"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
export function DeactivateAcc({msg,setLogOut}:{msg:string,setLogOut:(e:boolean)=>void}){
    const route = useRouter();
    const loggingOut=async ()=>{
        try{
         const res= await axios.delete(` https://spychatbe.onrender.com/api/deactivate`,
            {
                withCredentials:true
            }
         ); 
       if(res.status===200) {
        setLogOut(false);
        route.replace("/")
       }
        } 
        catch(err){
            console.log(err);
        }     
    }
    return(
        <div className={`w-full flex flex-col justify-center items-center absolute top-[40%] gap-y-2`}>
       <p className={`text-sm sm:text-lg text-stone-50 font-serif font-bold`}>
        Are you sure you want to {msg}?
       </p>
        <div className={`w-full flex justify-evenly items-center`}>
        <button type="button" 
        onClick={()=>setLogOut(false)}
        className={`p-1 text-stone-50 font-mono font-extrabold rounded-xl bg-blue-600
        cursor-pointer active:bg-blue-800 text-sm sm:text-lg sm:p-2`}>
            NO
        </button>
        <button type="button"
        onClick={loggingOut}
        className={`p-1 text-stone-50 font-mono font-extrabold rounded-xl bg-blue-600
         cursor-pointer active:bg-blue-800 text-sm sm:text-lg sm:p-2`}>
            YES
        </button>
        </div>
        </div>
    )
}