import Image from 'next/image'
import React from 'react'

const ShowCase = () => {
  return (
    <div className='mx-[24px] mt-[48px]' >
        <div>
            <p className='leading-[48px] lg:leading-normal text-[48px] font-medium ' >Experiences that speak louder than words.</p>
        </div>

       
            
        {/* Left small column */}
        <div className="mt-4 lg:hidden flex flex-col gap-4 w-full sm:w-[50%]">
            <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-[50%]">
                <Image src="/home/tourist-places1.jpg" className="h-[150px] w-full object-cover rounded-[12px]" width={1000} height={1000} alt="" />
                <Image src="/home/tourist-places2.jpg" className="h-[150px] w-full object-cover rounded-[12px]" width={1000} height={1000} alt="" />
            </div>
            <Image src="/home/tourist-places3.jpg" className="h-[310px] w-[50%] object-cover rounded-[12px]" width={1000} height={1000} alt="" />
            </div>
        </div>

        {/* Left top right large image */}
        <div className="lg:hidden w-full mt-4">
            <Image src="/home/tourist-places4.jpg" className="h-[310px] w-full object-cover rounded-[12px]" width={1000} height={1000} alt="" />
        </div>

            

        <div className='hidden mt-[24px] lg:mt-0 lg:flex gap-[12px]' >
            <div className='flex flex-col gap-[12px] w-[60%]' >
                {/* left main container */}
                <div className='flex gap-[12px]' >
                    {/* left top */}
                    <div className='flex gap-[12px] w-[50%]' >
                        {/* left top left */}
                        <div className='flex flex-col gap-[12px] w-[50%]' >
                            {/* left top left col */}
                            <Image src="/home/tourist-places5.jpg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                            <Image src="/home/tourist-places6.jpg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                        </div>
                        <Image src="/home/tourist-places7.jpg" className='h-full w-[50%] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    </div>
                    <div className='w-[50%]' >
                        {/* left top right */}
                        <Image src="/home/tourist-places8.jpeg" className='h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    </div>
                </div>
                <div>
                    <Image src="/home/tourist-places9.jpg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    {/* left bottom */}
                </div>
            </div>
            <div className='flex flex-col gap-[12px] w-[40%]' >
                {/* right main contrainer */}
                <div>
                    {/* right top */}
                    <Image src="/home/tourist-places1.jpg" className='h-[200px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                </div>
                <div className='flex gap-[12px] h-full' >
                    {/* right bottom */}
                    <Image src="/home/tourist-places2.jpg" className='w-[50%] h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    <Image src="/home/tourist-places3.jpg" className='w-[50%] h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                </div>
            </div>
        </div>
        <div className='hidden lg:flex gap-[12px] mt-[12px]' >

            {/* RIGHT SIDE becomes LEFT in reverse */}
            <div className='flex flex-col gap-[12px] w-[40%]' >
                {/* right (now left) main container */}
                <div>
                    {/* right top */}
                    <Image src="/home/tourist-places4.jpg" className='h-[200px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                </div>
                <div className='flex gap-[12px] h-full' >
                    {/* right bottom */}
                    <Image src="/home/tourist-places10.jpeg" className='w-[50%] h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    <Image src="/home/tourist-places11.jpeg" className='w-[50%] h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                </div>
            </div>

            {/* LEFT SIDE becomes RIGHT in reverse */}
            <div className='flex flex-col gap-[12px] w-[60%]' >
                {/* left (now right) main container */}
                <div className='flex gap-[12px]' >

                    {/* left top (reversed inside) */}
                    <div className='w-[50%]' >
                        {/* left top right becomes left top left */}
                        <Image src="/home/tourist-places16.jpeg" className='h-full object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                    </div>

                    <div className='flex gap-[12px] w-[50%]' >
                        {/* left top left becomes right side inside */}
                        <Image src="/home/tourist-places15.jpeg" className='h-full w-[50%] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />

                        {/* column moves to right */}
                        <div className='flex flex-col gap-[12px] w-[50%]' >
                            <Image src="/home/tourist-places14.jpeg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                            <Image src="/home/tourist-places12.jpeg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                        </div>
                    </div>
                </div>

                <div>
                    {/* left bottom (same, just moved to right column) */}
                    <Image src="/home/tourist-places13.jpeg" className='h-[150px] object-cover rounded-[12px]' width={1000} height={1000} alt="Showcase Image" />
                </div>
            </div>

        </div>
    </div>
  )
}

export default ShowCase