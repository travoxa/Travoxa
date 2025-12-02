import { HiArrowRight } from 'react-icons/hi2'

type ForwordButtonProps = {
  text: string,
  border?:boolean
}

const ForwordButton = ({ text,border }: ForwordButtonProps) => {
  return (
    <button className={`font-light flex flex-1 w-full justify-between items-center gap-[10px] ${border ? 'border-[0.5px] px-[8px] pl-[24px] py-[8px] rounded-[24px]' : ''} `} > {text} <div className="p-[8px] bg-black rounded-full" ><HiArrowRight color="white"  /></div></button>
  )
}

export default ForwordButton