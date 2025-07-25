"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { easeIn, motion, Variants } from "framer-motion";
import Image from "next/image";
import "../land/land.css";
import { useRef, useEffect, useCallback, useState } from "react";
import { InputField } from "@/components/inputField";
import { Footer } from "@/components/footer";
import { SignOut } from "@/components/signout";
import { DeactivateAcc } from "@/components/deactivate";
type tData={
    _id:string,
    profile:string,
    username:string,
    bio:string,
    email:string,
    authType:string
}
const schema=z.object({
    profile:z.custom<FileList>((val)=>val instanceof FileList && val.length>0,{
        message:"Enter a valid profile"
    }).optional(),
    username:z.string().optional(),
    bio:z.string().optional(),
    email:z.string().optional()
})
type DataType= z.infer<typeof schema>
export default function ProfilePage(){
    const{ register, handleSubmit, 
        setValue, reset, formState:{errors,isSubmitting}}=useForm({resolver:zodResolver(schema)})
    const [ profile, setProfile ] = useState<string|null>(null);
    const imgRef=useRef<HTMLInputElement|null>(null);
    const [ isEditting, setIsEditting ] = useState<boolean>(false);
    const [ userInfo, setUserInfo ] = useState<tData | null>(null);
    const [ logOut, setLogOut ] = useState<boolean>(false);
    const [ deactivate, setDeactivate ] = useState<boolean>(false);
    const fetchingUserDetails=useCallback(async ()=>{
     try{
         const res = await axios.get("https://spychatbe.onrender.com/api/currentUser",{
        withCredentials:true
         })
         const { _id,profile, username, email, bio, authType } = res.data;
          setUserInfo({
            _id:_id,
            profile:profile,
            username:username,
            bio:bio,
            email:email,
            authType:authType
        })
        setValue("username",username);
        setValue("bio",bio);
        setValue("email",email);
        setProfile(profile);
     }
     catch(err){
        console.log(err);
     }
    },[])

    useEffect(()=>{
        fetchingUserDetails();
    },[fetchingUserDetails])

    const sub= async (data:DataType)=>{
        try{
            if(data.profile){
                const file= data.profile[0];

        const convertToBase64=async (file:File):Promise<string>=>{
        return new Promise((resolve,reject)=>{
            const reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onload=()=>{
                resolve(reader.result as string);
                reader.onerror=error=>reject(error)
            }
        })
      }  
      const base64Image = await convertToBase64(file);
       const payload={
                username:data.username,
                bio:data.bio,
                email:data.email || "demoMail@gmail.com",
                profile:base64Image
            }
        await axios.patch(`https://spychatbe.onrender.com/api/user/editProfile/${userInfo?._id}`,payload,{
            withCredentials:true
        }) 
        reset();
        setProfile(null)  
        setIsEditting(false); 
        setTimeout(()=>{window.location.reload()},60)   
    }
    else{
        const payload={
                username:data.username,
                bio:data.bio,
                email:data.email || "demoMail@gmail.com",
            }
            await axios.patch(`https://spychatbe.onrender.com/api/user/editProfile/${userInfo?._id}`,payload,{
            withCredentials:true
        }) 
        reset();
        setIsEditting(false);
        setTimeout(()=>{window.location.reload()},60)
    }
}
        catch(err){
            console.log(err);
        }
    }

    const anime:Variants={
        hid:{opacity:0},
        show:{opacity:1,
            transition:{
                duration:0.5,
                delay:0.2,
                ease:easeIn
            }
        }
    }
return (
   <>
   {deactivate?
   (
    <DeactivateAcc msg="deactivate" setLogOut={setDeactivate} />
   )
   :
   (
     <>
    {logOut?
    (<SignOut msg="logout" setLogOut={setLogOut}/>)
    :
    (
    <motion.div className={`flex flex-col justify-center items-center gap-y-2 cursor-pointer`}>
   {isEditting?
   (<motion.form 
    variants={anime}
    initial="hid"
    animate="show"
   onSubmit={handleSubmit(sub)}
   className={`w-full flex flex-col justify-evenly items-center mt-2 h-[100vh]`}>
        <div className={`w-full text-blue-500 font-serif font-extrabold 
            flex justify-between text-lg sm:text-2xl cursor-pointer`}>
         <button type="button"
          className={`m-2`}
          onClick={()=>{setIsEditting(false)}}>X</button>
         <button type="submit" disabled={isSubmitting}
         className={`m-2`}>{isSubmitting?"updating...":"\u2713"}</button>
        </div>
        <input type="file" hidden {...register("profile")}
        onChange={(e)=>{
            const files= e.target.files;
            if(files){
                setValue("profile",files);
                setProfile(URL.createObjectURL(files[0]));
            }
        }} ref={imgRef}/>
     <button type="button"
     onClick={()=>imgRef.current?.click()}
     className={`text-md sm:text-lg text-blue-400 font-serif`}>
        change profile picture</button>
        <div className={`relative w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-4xl`}>
      <Image
       src={profile?profile:"/logo.png"}
       alt="Profile picture"
       fill 
       sizes="(max-width: 640px) 60px, 100px"
       priority
       className={`object-cover rounded-full`}
       />
     </div>

     <div className={`w-full flex flex-col justify-evenly items-center h-[40%]`}>
     <InputField label="bio" type="text" reg={register("bio")} msg={errors.bio && errors.bio.message} />
     {userInfo?.authType==="local"?
     (<InputField label="username" type="text" reg={register("username")} msg={errors.username && errors.username.message} />):
     (null)}
     <InputField label="email" type="email" reg={register("email")} msg={errors.email && errors.email.message} />
     </div>
     <div className={`h-[200px]`}>

     </div>
    </motion.form>)
    :
   (
   <motion.div 
   variants={anime}
    initial="hid"
    animate="show"
   className={`w-full flex flex-col justify-center
   cursor-pointer items-center mt-4`}>
   <button type="button"
   onClick={()=>{setIsEditting(true)}}
    className={`text-md sm:text-lg text-blue-400 font-serif `}>edit profile</button>
     <div className={`relative w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-4xl`}>
      <a href={userInfo?userInfo.profile:""}><Image
       src={profile?profile:"/logo.png"}
       alt="Profile picture"
       fill 
       sizes="(max-width: 640px) 60px, 100px"
       priority
       className={`object-cover rounded-full`}
       /></a>
     </div>
     <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
        <h1 className={`text-lg sm:text-2xl 
        text-stone-50 font-serif font-extralight`}>{userInfo?userInfo.bio:"Hey there!"}</h1>
        <h1 className={`text-md sm:text-xl 
        text-stone-50 font-serif font-extralight`}>{userInfo?userInfo.username:"Guest"}</h1>
        <h1 className={`text-md sm:text-xl 
        text-stone-50 font-serif font-extralight`}>{userInfo?userInfo.email:""}</h1>
     </div>
     <div className={`flex flex-col justify-center items-center`}>
     <button className={`p-1 text-stone-50
     bg-green-500 font-serif font-bold 
     text-sm sm:text-lg m-2 rounded-lg cursor-pointer
     active:bg-green-700`}
     onClick={()=>setLogOut(true)}>logout</button>

     <button className={`p-1 text-stone-50
     bg-red-500 font-serif font-bold 
     text-sm sm:text-lg m-2 rounded-lg
     cursor-pointer active:bg-red-700`}
     onClick={()=>setDeactivate(true)}
     >deactivate</button>
     </div>
     </motion.div>)}
    <Footer/>
    </motion.div>)}
    </>
   )}
   </>
)
}




 