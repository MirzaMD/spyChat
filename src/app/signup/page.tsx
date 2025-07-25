"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import { easeIn, easeOut, motion,Variants } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { InputField } from "@/components/inputField";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
const schema=z.object({
    username:z.string().min(1,"username cannot be blank"),
    password:z.string().min(8,"minimum 8 characters required"),
    profile:z.custom<FileList>((val)=> val instanceof FileList && val.length>0,{
        message:"upload a profile picture"
    }),
    email:z.string().email("Invalid email address")
})
type Tdata=z.infer<typeof schema>;

export default function SignUpPage(){
    const imgRef=useRef<HTMLInputElement | null>(null);
    const { register, handleSubmit, setValue, 
    reset, formState:{errors,isSubmitting}} =useForm({resolver:zodResolver(schema)});
    const[ img, setImg ] = useState<File|null>(null);
    const route=useRouter();
    const mainAnime:Variants={
        hid:{opacity:0,y:100},
        show:{opacity:1,y:0,
            transition:{
                duration:1,
                ease:easeIn,
                staggerChildren:0.25,
                 stiffness:30,
                  bounce:2,
                type:"spring"
            }
        }
    }
    const childAnime:Variants={
        hid:{opacity:0,y:100},
        show:{opacity:1,y:0,
            transition:{
                duration:0.4,
                ease:easeOut
            },
        }
    }
    const spinner:Variants={
         hide:{rotate:0},
         show:{rotate:360,
            transition:{
                duration:1,
                repeat:Infinity,
                ease:easeIn
            }
         }
    }
   const sub = async (data: Tdata) => {
  const file = data.profile[0];
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  const base64Img= await convertToBase64(file);
  const payload={
    username:data.username,
    password:data.password,
    email:data.email,
    profile:base64Img,
    authType:"local"
  }
  try {
  await axios.post(" https://spychatbe.onrender.com/api/signup", payload, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  });
  reset();
  setImg(null);
  await new Promise(res => setTimeout(res, 100));
  route.replace("/login");
} catch (err) {
  console.log(err);
}

};
    return(
        <motion.div className={`h-[100vh] w-full bg-stone-950 flex flex-col items-center `}>
            <motion.h1
            variants={childAnime}
            className={`text-lg sm:text-3xl font-serif text-white font-bold mt-4`}>Make yourself a Spy 🕵🏻</motion.h1>
            {
                isSubmitting?
                (
                   <motion.div
                   variants={spinner}
                   initial="hide"
                   animate="show"
                   className="h-[100px] sm:h-[200px] w-[100px] sm:w-[200px] border-t-transparent border-4 
                    border-[whitesmoke] rounded-full relative top-[30%]">
                    </motion.div>)
                :
                (
            <motion.form 
            onSubmit={handleSubmit(sub)}
            variants={mainAnime}
            initial="hid"
            animate="show"
            className={`h-full w-full flex flex-col items-center gap-y-4 sm:gap-y-8 mt-7`}>

              <motion.div 
              variants={childAnime}
              className={`flex w-full flex-col justify-center items-center gap-x-4 sm:gap-x-8 h-fit`}>
                <input type="file" ref={imgRef} hidden onChange={(e)=>{
                    const file=e.target.files;
                    if(file && file.length>0){
                        setValue("profile",file);
                        setImg(file[0]);                   
                    }
                }}
                />
                <motion.label
                variants={childAnime}
                className={`text-md sm:text-lg text-[whitesmoke] font-[cursive]`}>Profile Picture:
                </motion.label>
                <motion.div className={`w-full flex justify-center items-center`}>
                <motion.div className={`h-[60px] sm:h-[100px] w-[60px] sm:w-[100px] relative m-2`}>
                    <Image
                       src={img?URL.createObjectURL(img):"/logo.png"}
                       alt="preview"
                       fill
                       sizes="(max-width: 640px) 60px, 100px"
                       priority
                       className="rounded-md object-cover"
                       />
                </motion.div>
                <motion.div
                     variants={childAnime} >
                    <FaUpload className={`text-5xl sm:text-7xl 
                    text-[whitesmoke] border-4 border-dotted
                    border-[#ff58ff] rounded-lg border-t-[#49ff49] border-b-[#209cbb]`}
                    onClick={()=>imgRef.current?.click()} 
                    style={{boxShadow:`5px 5px 5px black`}}/> 
                </motion.div>
              </motion.div>
              </motion.div>
              {errors.profile && 
                    ( <motion.p
                    className={`text-lg sm:text-lg font-serif font-light text-[#ff5e31]`}>
                     {`${errors.profile.message}`}
                    </motion.p>)}
              {/* this is where the text's filed come in  */}
              <motion.div variants={childAnime}
              className={`w-full flex flex-col justify-center items-center gap-y-4`}>
              <InputField label="username" type="text" reg={register("username")} msg={errors.username?errors.username.message:""} />
              <InputField label="password" type="password" reg={register("password")} msg={errors.password?errors.password.message:""} />
              <InputField label="email" type="email" reg={register("email")} msg={errors.email?errors.email.message:""} />
              </motion.div>

              <motion.div 
              variants={childAnime}
              className={`w-full flex justify-around items-center`}>
               <Link className={`p-1 sm:p-2 rounded-xl 
               bg-[radial-gradient(whitesmoke,white,black)]
               text-[#6134a0] font-mono font-bold`}
               href={'/login'}>cancel</Link>
               <motion.button 
               variants={childAnime}
               type="submit" disabled={isSubmitting}
               className={`p-1 sm:p-2 rounded-xl 
               bg-[radial-gradient(whitesmoke,white,black)]
               text-[#216d00] font-mono font-bold`}>
                sign in
               </motion.button>
              </motion.div>
            </motion.form>
                )
            }
        </motion.div>
    )
}