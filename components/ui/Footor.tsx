import React from 'react'
import ForwordButton from './components/ForwordButton'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { LiaCopyrightSolid } from "react-icons/lia";
import Link from 'next/link';

const Footor = () => {
  return (
    <div className='mx-[12px] my-[24px] lg:m-[24px] bg-black text-white rounded-[12px] pt-[24px] lg:pt-[48px] pb-[24px] lg:pb-[48px]' >
      <div className='px-[24px] lg:px-[48px]' >
        <p className='text-[18px] lg:text-[36px] ' >Let Travoxa be your guide to the soul of India. From peaceful escapes to breathtaking adventures, we craft journeys that touch the heart and stay with you forever.</p>

        <div className='block lg:flex mt-[12px] items-center gap-[24px]'  >
          <ForwordButton text={"Prepare your Adventure Tody! "} border />
          <div className='flex items-center gap-[24px] justify-center mt-[24px] lg:mt-0' >
            <FaInstagram color='white' size={36} className='lg:ml-[48px]' />
            <FaTwitter color='white' size={36} />
            <FaFacebook color='white' size={36} />
          </div>

          <div className='mt-[24px] lg:mt-0 flex flex-col lg:flex-row justify-center items-center gap-[12px] lg:gap-[24px]' >
            <Link href="/help" className='text-white text-[24px] lg:ml-[48px] font-light hover:text-gray-300 transition-colors' >Help Center</Link>
            <Link href="/terms" className='text-white text-[24px]  font-light hover:text-gray-300 transition-colors' >Term of Use</Link>
            <Link href="/support" className='text-white text-[24px]  font-light hover:text-gray-300 transition-colors' >Support</Link>
            <Link href="/privacy" className='text-white text-[24px]  font-light hover:text-gray-300 transition-colors' >Privacy Policy</Link>
          </div>
        </div>
        <div className="text-white space-y-3 py-5 pl-3">
          <p>
            <span className="font-bold">ADDRESS:</span>{" "}
            Flat 402, Shree Ganesh Residency,
            MG Road, Andheri East,
            Mumbai, Maharashtra 400069,
            India
          </p>

          <p>
            <span className="font-bold">PHONE:</span>{" "}
            (+91) 81005 39204
          </p>

          <p>
            <span className="font-bold">EMAIL:</span>{" "}
            travoxa@gmail.com
          </p>
        </div>
      </div>
      <div className='text-center flex flex-1 justify-center items-center flex-col pt-[0px]' >
        <p className='text-center flex items-center gap-[12px] pb-3 font-light' ><LiaCopyrightSolid color='white' />2025 Travoxa. All Rights Reserved.</p>
        <p className='Mont mt-0 lg:mt-[36px] text-[14vw] lg:text-[16vw] leading-[15vh] pb-4 tracking-[1vw] font-extrabold ' >TRAVOXA</p>
      </div>
    </div>
  )
}

export default Footor