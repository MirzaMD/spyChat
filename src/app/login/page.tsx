"use client"
import { FaGithub, FaDiscord } from "react-icons/fa";
import { easeIn, easeInOut, motion, } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
const schema=z.object({
  username:z.string().min(1,"username cannot be blank")
  .refine((val)=>val.trim()!=="",{
    message:"username cannot be blank"
  }),
  password:z.string().min(8,"password must be at least 8 charaters long")
  .refine((val)=>val.trim()!=="",{
    message:"password cannot be blank"
  })
})
type Tdata=z.infer<typeof schema>
export default function Login() {
  const{ register,handleSubmit,reset,clearErrors,
    formState:{errors,isSubmitting}}=useForm<Tdata>({resolver:zodResolver(schema),
      mode:"onTouched"
    });
    const route=useRouter();

    const [ credErr, setCredErr ] = useState<string|null>(null)
    const buttonAnimation={
      hid:{opacity:0,x:-300},
      show:{opacity:1,x:0,
             transition:{
             duration:0.8,
             ease:easeIn
          }
        }}
        const spinner={
         HID:{ rotate:0},
         SHOW:{
          rotate:360,
          transition: {
          repeat: Infinity,
          duration: 1,
          ease:easeIn
        }
         }
        }
    
        const sub=async (data:Tdata)=>{
         try{
           const res=await axios("https://spychatbe.onrender.com/api/localLogin",{
            method:"POST",
            withCredentials:true,
            data
          })
          reset();
          setTimeout(() => clearErrors(), 0)
          if(res.status===200) {
            route.replace("/land");
            setCredErr(null);
          }
         }catch (err: unknown) {
         if (axios.isAxiosError(err)) {
           const message = err.response?.data?.message || "check your credentials again";
          setCredErr(message);
        } else {
           console.log("An unknown error occurred");
          setCredErr("check your credentials again");
         }
        }
      }
  return (
    <motion.div
    className={`flex flex-col justify-center items-center bg-stone-800 text-[whitesmoke]
     h-[100vh]`}> 
      <motion.form onSubmit={handleSubmit(sub)}
      className={`h-[300px]  w-[250px] sm:h-[500px] sm:w-[500px]
      flex flex-col justify-center items-center  gap-y-4 sm:gap-y-8 aspect-square
      rounded-xl`}>
        <motion.h1 
          variants={{hid:{opacity:0,x:-100},
          show:{opacity:1,x:0,
         transition:{
            type: "spring",
            stiffness: 40,
            damping: 7,
            delay:0.4 
          }
        }}}
        initial="hid"
        animate="show"
         className={`text-2xl sm:text-5xl font-serif text-stone-400
         absolute top-30 sm:top-10`}>{credErr?credErr:"Spy Chat"}</motion.h1>
         <motion.div 
         className={`w-full flex flex-col justify-evenly items-center bg-stone-950 h-[300px]
         sm:h-[500px] aspect-square rounded-xl`}
               variants={{
      hid:{opacity:0,x:500
      },
      show:{opacity:1,
        x:0,
        transition:{
          duration:1,
          ease:easeInOut,
          staggerChildren:0.2
        },
      }
    }}
    initial="hid"
    animate="show">
          <motion.div 
             variants={{hid:{opacity:0,x:-300},
        show:{opacity:1,x:0,
          transition:{
            duration:0.8,
            ease:easeIn
          }
        }}}
          className={`w-full flex flex-col justify-evenly items-center`}>
          <motion.label
          htmlFor="user"
          className={`text-sm sm:text-lg font-[cursive]`}>USERNAME:</motion.label>
          <motion.input
          type="text" 
          {...register("username")}
          id="user"
          className={`w-[80%] rounded-lg bg-[#f5f5f544] 
          border-2 border-white`} 
          placeholder="enter the username"/>
          </motion.div>
          {errors.username && (
            <motion.p 
           className={`text-md sm:text-xl font-serif text-[#c60000]`}>
            {`${errors.username.message}`}
           </motion.p>
          )}
          <motion.div 
          variants={{hid:{opacity:0,x:-300},
        show:{opacity:1,x:0,
          transition:{
            duration:0.8,
            ease:easeIn
          }
        }}}
          className={`w-full flex flex-col justify-evenly items-center`}>
          <motion.label
          htmlFor="pass"
          className={`text-sm sm:text-lg font-[cursive]`}>PASSWORD:</motion.label>
          <motion.input 
          type="password"
          {...register("password")}
          id="pass"
          className={`w-[80%] rounded-lg bg-[#f5f5f544] 
          border-2 border-white`} 
          placeholder="enter the password"/>

          {errors.password && (
            <motion.p 
           className={`text-md sm:text-xl font-serif text-[#c60000]`}>
            {`${errors.password.message}`}
           </motion.p>
          )}
          </motion.div>
          
  <motion.button
  variants={buttonAnimation}
  type="submit"
  disabled={isSubmitting}
  className={`
  ${isSubmitting?"":`bg-stone-400 text-sm sm:text-lg
  text-stone-900 p-1 sm:p-2 rounded-md font-[cursive]
  active:bg-stone-600 hover:border-1 hover:border-white
  cursor-pointer flex items-center justify-center w-[80%]`}`}
>
  {isSubmitting ? (
    <motion.div
      variants={spinner}
      initial="HID"
      animate="SHOW"
      className="w-10 h-10 border-4 border-stone-200 border-t-transparent rounded-full bg-transparent"
    />
  ) : (
    "login"
  )}
</motion.button>
          <motion.div 
             variants={{hid:{opacity:0,x:-300},
        show:{opacity:1,x:0,
          transition:{
            duration:0.8,
            ease:easeIn
          }
        }}}
          className={`w-full flex justify-evenly cursor-pointer`}>
            <FaGithub onClick={()=>window.location.href = "https://spychatbe.onrender.com/auth/github"}
            className={`text-3xl sm:text-5xl text-[#307e30] hover:text-[#6ad46a] aspect-square`}/>
            <FaDiscord onClick={()=>window.location.href = "https://spychatbe.onrender.com/auth/discord"}
            className={`text-3xl sm:text-5xl text-[#662b66] hover:text-[#b75eb7] aspect-square`}/>
          </motion.div>
          <motion.div 
             variants={{hid:{opacity:0,x:-300},
        show:{opacity:1,x:0,
          transition:{
            duration:0.8,
            ease:easeIn
          }
        }}}
          className={`w-full flex flex-col justify-center items-center`}>
           <motion.p 
           className={`text-sm sm:text-xl font-serif text-[whitesmoke]`}>
            Do not have an account, sign up?
            </motion.p>
            <Link
            className={`text-sm sm:text-lg text-blue-800 font-serif`} 
            href={"/signup"}>sign up</Link>
          </motion.div>
        </motion.div>
      </motion.form>
      </motion.div>
  );
}
