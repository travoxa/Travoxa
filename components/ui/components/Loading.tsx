import React from 'react'
import Spinner from '../Spinner'

const Loading = () => {
  return (
    <div className="flex justify-center items-center absolute z-50 left-0 w-full h-full bg-white/80 backdrop-blur-sm" >
      <Spinner size="lg" />
    </div>
  )
}

export default Loading