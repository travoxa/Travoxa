import React from 'react'
import ForwordButton from './components/ForwordButton'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { LiaCopyrightSolid } from "react-icons/lia";

const Footor = () => {
  return (
    <div className='m-[24px] bg-black text-white rounded-[12px] pt-[48px] pb-[48px]' >
        <div className='px-[48px]' >
            <p className='text-[36px] ' >Let Travoxa be your guide to the soul of India. From peaceful escapes to breathtaking adventures, we craft journeys that touch the heart and stay with you forever.</p>
            <div className='flex mt-[12px] items-center gap-[24px]'  >
                <ForwordButton text={"repare your Adventure Tody! "} border />
                <FaInstagram color='white' size={36} className='ml-[48px]' />
                <FaTwitter color='white' size={36} />
                <FaFacebook color='white' size={36} />

                <button className='text-white text-[24px] ml-[48px] font-light' >Help Center</button>
                <button className='text-white text-[24px]  font-light' >Term of Use</button>
                <button className='text-white text-[24px]  font-light' >Support</button>
                <button className='text-white text-[24px]  font-light' >Privacy Policy</button>
            </div>
        </div>
        <div className='text-center flex flex-1 justify-center items-center flex-col mt-[48px]' >
            <p className='text-center flex items-center gap-[12px] font-light' ><LiaCopyrightSolid color='white' />2025 Travoxa. All Rights Reserved.</p>
            <p className=' mt-[36px] text-[16vw] leading-[15vh] tracking-[1vw] font-extrabold ' >TRAVOXA</p>
        </div>
    </div>
  )
}

export default Footor