import Footor from "@/components/ui/Footor"
import Header from "@/components/ui/Header"
import { IoLocationOutline } from "react-icons/io5"
import { IoCallOutline } from "react-icons/io5";
import { IoMailOpenOutline } from "react-icons/io5";

const page = () => {
  return (
    <div>
        <div className="fixed top-[12px]" >
            <Header />
        </div>
        <div className=" h-[80vh] mx-[12px] mt-[12px]  rounded-[12px] flex justify-center items-center bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(/contact/contact.jpg)` }}>
            <p className=" text-white text-[56px] font-extrabold bg-[#00000055] w-full h-full flex justify-center items-center" >Your questions matter. Contact us anytime.</p>
        </div>
        <div className='mt-[72px] mx-[24px] my-[24px] flex gap-[24px]' >
            <div className='w-full flex gap-[12px] items-center border-[0.5px] px-[24px] py-[12px] rounded-[12px]' >
                <IoLocationOutline size={36} color="black" />
                <p className="Inter text-[14px] font-light" >Travoxa HQ <br />
                    Howrah, West Bengal, India <br />
                    (Working remotely across India)</p>
            </div>
            <div className='w-full flex gap-[12px] items-center border-[0.5px] px-[24px] py-[12px] rounded-[12px]' >
                <IoCallOutline size={36} color="black" />
                <p className="Inter text-[14px] font-light" >+91 7439708923<br />
                    +91 7449443669</p>
            </div>
            <div className='w-full flex gap-[12px] items-center border-[0.5px] px-[24px] py-[12px] rounded-[12px]' >
                <IoMailOpenOutline size={36} color="black" />
                <p className="Inter text-[14px] font-light" >+91 7439708923<br />
                    +91 7449443669</p>
            </div>
        </div>
        <div className="mx-[24px] my-[10vh] " >
            <p className="text-[10vw] Mont" >GET IN TOUCH</p>
            <div className="flex flex-col flex-1 overflow-hidden mx-[2vw]" >
                <div className=" flex gap-[24px] flex-1 " >
                    <input className="text-[18px] border-b border-black pb-[12px] flex flex-1" type="text" placeholder="Name" />
                    <input className="text-[18px] border-b border-black pb-[12px] flex flex-1" type="text" placeholder="Phone" />
                    <input className="text-[18px] border-b border-black pb-[12px] flex flex-1" type="email" placeholder="Email" />
                </div>
                <input className="mt-[24px] text-[18px] border-b border-black pb-[12px] w-full" type="text" placeholder="Message" />
            </div>
        </div>
        <Footor />
    </div>
  )
}

export default page