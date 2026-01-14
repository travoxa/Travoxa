import Image from 'next/image'
import React from 'react'
import { HiArrowRight } from "react-icons/hi2"

const ShowCase = () => {

    const blogs = [
        {
            title: "Exploring Local Culture and Traditions",
            author: "Admin",
            date: "Dec 12, 2025",
            image: "/home/tourist-places1.jpg"
        },
        {
            title: "The Beauty of the Sea at Sand",
            author: "Admin",
            date: "Dec 15, 2025",
            image: "/home/tourist-places2.jpg"
        },
        {
            title: "Sunrise in Bromo Tengger Semeru",
            author: "Admin",
            date: "Dec 20, 2025",
            image: "/home/tourist-places3.jpg"
        }
    ]

    return (
        <div className='container mx-auto px-6 lg:px-20 py-20' >
            <div className='flex flex-col lg:flex-row justify-between items-end mb-12' data-aos="fade-right">
                <div className="max-w-2xl">
                    <h2 className='text-4xl lg:text-6xl text-black mb-6 Mont' >Travel Blog <br /> <span className="">Around Travoxa</span></h2>
                    <p className="text-gray-600 Inter text-lg">This blog features beautiful photography and personal experiences, providing insights into the local culture.</p>
                </div>
                <div className="flex gap-4 mt-6 lg:mt-0">
                    <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">Reminder me</button>
                    <button className="px-6 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50">Learn More</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
                {blogs.map((blog, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className="rounded-2xl overflow-hidden mb-4 relative h-[250px]">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 p-2 bg-white/30 backdrop-blur-md rounded-full">
                                <HiArrowRight className="text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                            </div>
                        </div>
                        <div>
                            <div className="flex gap-4 text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
                                <span>{blog.author}</span>
                                <span>•</span>
                                <span>{blog.date}</span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight group-hover:text-green-600 transition-colors">
                                {blog.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ShowCase