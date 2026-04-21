import React from 'react'
import Spinner from '../Spinner'

const SectionLoading = () => {
    return (
        <div className="flex justify-center items-center w-full py-20 bg-slate-50/50 rounded-3xl border border-slate-100">
            <Spinner size="md" />
        </div>
    )
}

export default SectionLoading
