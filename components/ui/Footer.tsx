import React from 'react'
import { CONTACT_INFO } from '@/config/contact';
import ForwordButton from './components/ForwordButton'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { LiaCopyrightSolid } from "react-icons/lia";
import Link from 'next/link';

const Footer = () => {
  return (
    <div className='mx-[12px] my-[24px] lg:m-[24px] bg-black text-white rounded-[12px] pt-[24px] lg:pt-[48px] pb-[24px] lg:pb-[48px]' >
      <div className='px-[24px] lg:px-[48px]' >
        <p className='text-[18px] lg:text-[36px] ' >Let Travoxa be your guide to the soul of India. From peaceful escapes to breathtaking adventures, we craft journeys that touch the heart and stay with you forever.</p>

        <div className='mt-[24px] lg:flex lg:justify-between gap-[48px]'>
          {/* Left Column: Button, Socials, Address */}
          <div className='flex-1 space-y-[32px]'>
            <div className='max-w-[400px]'>
              <ForwordButton text={"Prepare your Adventure Today!"} border />
            </div>

            <div className='flex items-center gap-[24px] text-white'>
              <FaInstagram size={24} className='hover:text-gray-400 transition-colors cursor-pointer' />
              <FaTwitter size={24} className='hover:text-gray-400 transition-colors cursor-pointer' />
              <FaFacebook size={24} className='hover:text-gray-400 transition-colors cursor-pointer' />
            </div>

            <div className="text-white space-y-3 font-light">
              <p>
                <span className="font-bold">ADDRESS:</span>{" "}
                {CONTACT_INFO.address.line1}<br />
                {CONTACT_INFO.address.line2}<br />
                {CONTACT_INFO.address.line3}
              </p>

              <p>
                <span className="font-bold">PHONE:</span>{" "}
                {CONTACT_INFO.phones.primary}
              </p>

              <p>
                <span className="font-bold">EMAIL:</span>{" "}
                {CONTACT_INFO.emails.main}
              </p>
            </div>
          </div>

          {/* Right Column: Policy Links List */}
          <div className='mt-[48px] lg:mt-0 flex flex-col gap-[12px] lg:gap-[16px] lg:items-end lg:pr-[48px]'>
            <Link href="/help" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Help Center</Link>
            <Link href="/terms" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Terms of Use</Link>
            <Link href="/privacy" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Privacy Policy</Link>
            <Link href="/refund-policy" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Refund Policy</Link>
            <Link href="/cancellation-policy" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Cancellation Policy</Link>
            <Link href="/shipping-policy" className='text-white text-[18px] lg:text-[20px] font-light hover:text-gray-300 transition-colors' >Shipping Policy</Link>
          </div>
        </div>
      </div>
      <div className='text-center flex flex-1 justify-center items-center flex-col pt-[0px]' >
        <p className='text-center flex items-center gap-[12px] pb-3 font-light' ><LiaCopyrightSolid color='white' />2025 Travoxa. All Rights Reserved.</p>
        <p className='Mont mt-0 lg:mt-[36px] text-[14vw] lg:text-[16vw] leading-[15vh] pb-4 tracking-[1vw] font-extrabold ' >TRAVOXA</p>
      </div>
    </div>
  )
}

export default Footer