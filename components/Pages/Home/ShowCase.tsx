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

    const [email, setEmail] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [status, setStatus] = React.useState<'idle' | 'success' | 'error' | 'already_subscribed'>('idle')
    const [showInput, setShowInput] = React.useState(false)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)
        setStatus('idle')

        try {
            const res = await fetch('/api/blog-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (res.ok) {
                if (data.message === 'You are already subscribed!') {
                    setStatus('already_subscribed')
                } else {
                    setStatus('success')
                    setEmail('')
                }
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='container mx-auto px-6 lg:px-20 py-20' >
            <div className='flex flex-col lg:flex-row justify-between items-end mb-12' data-aos="fade-right">
                <div className="max-w-2xl">
                    <h2 className='text-3xl lg:text-5xl text-black mb-6 Mont' >Travel Blog <br /> <span className="">Around Travoxa</span></h2>
                    <p className="text-gray-600 Inter text-lg">This blog features beautiful photography and personal experiences, providing insights into the local culture.</p>
                </div>
                <div className="flex gap-4 mt-6 lg:mt-0 items-center h-[50px]">
                    {!showInput ? (
                        <button
                            onClick={() => setShowInput(true)}
                            className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Subscribe
                        </button>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex gap-2 items-center animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-6 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all w-[250px] shadow-sm group-hover:shadow-md"
                                    required
                                    disabled={status === 'success'}
                                />
                                {status === 'success' && (
                                    <span className="absolute -bottom-6 left-4 text-xs text-green-600 font-medium animate-in fade-in slide-in-from-top-1">Subscribed successfully!</span>
                                )}
                                {status === 'already_subscribed' && (
                                    <span className="absolute -bottom-6 left-4 text-xs text-blue-600 font-medium animate-in fade-in slide-in-from-top-1">Already subscribed!</span>
                                )}
                                {status === 'error' && (
                                    <span className="absolute -bottom-6 left-4 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">Something went wrong</span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || status === 'success'}
                                className="bg-black text-white p-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <HiArrowRight className="text-lg" />
                                )}
                            </button>
                        </form>
                    )}
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
                            <h3 className="text-xl font-medium leading-tight group-hover:text-green-600 transition-colors">
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