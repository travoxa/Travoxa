import { goBack } from '@/lib/route';
import React from 'react'
import { HiArrowLeft } from "react-icons/hi2";

const GoBackButton = () => {


  return (
    <button 
        onClick={() => goBack()}
        className='bg-black w-[30vw] text-white text-[10px] flex justify-center items-center gap-[1vw]  py-[12px] rounded-full' >
       <HiArrowLeft /> Back
    </button>
  )
}

export default GoBackButton