"use client"
import { motion } from "framer-motion"
import { UseFormRegisterReturn } from "react-hook-form"
export function InputField({label,type,reg,msg}:{label:string,type:string,reg:UseFormRegisterReturn,msg?:string}){
  return(
    <motion.div className={`w-full flex flex-col justify-center items-center`}>
    <motion.label
    className={`text-lg sm:text-2xl font-serif font-light text-[whitesmoke]`} 
    htmlFor={label}>{label}:</motion.label>
    <motion.input type={type} {...reg} id={label} 
    className={`w-[80%] rounded-md border-t-[#e174ff]
      border-2 border-[#1dff1d] text-[whitesmoke] bg-[#8b89893c] h-[30px]`} 
    placeholder={`enter the ${label}`}/>
    <motion.p
    className={`text-lg sm:text-lg font-serif font-light text-[#ff5e31]`}>
        {msg}
    </motion.p>
    </motion.div>
  )
}