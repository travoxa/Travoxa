import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center absolute z-50 left-0 w-screen h-screen bg-[#00000090]" >
        
            <div
                className="w-20 h-20 border-4 border-transparent text-white text-4xl animate-spin flex items-center justify-center border-t-white rounded-full"
            >
                <div
                className="w-16 h-16 border-4 border-transparent text-white text-2xl animate-spin flex items-center justify-center border-t-white rounded-full"
                ></div>
            </div>
        
    </div>

  )
}

export default Loading