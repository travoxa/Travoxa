'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RiArrowRightLine, RiTimeLine, RiChat3Line, RiHeartLine } from 'react-icons/ri'

const BlogSection = () => {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/blogs?limit=3')
                const data = await res.json()
                if (data.success) {
                    setBlogs(data.data)
                }
            } catch (error) {
                console.error('Error fetching blogs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [])

    if (loading) return null;
    if (blogs.length === 0) return null;

    return (
        <section id="blog" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-6xl text-black mb-8 Mont font-normal leading-tight">Travel Stories & Insights</h2>
                        <p className="text-gray-600 max-w-2xl mb-8">Discover hidden gems, travel tips, and inspiring stories from the Travoxa community.</p>
                        
                        <Link 
                            href="/blog"
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-8 py-3 rounded-full text-sm font-normal hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mb-2"
                        >
                            Explore All Blogs <RiArrowRightLine />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link 
                            key={blog._id} 
                            href={`/blog/${blog.slug}`}
                            className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all duration-500"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={blog.coverImage} 
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-normal rounded-full uppercase tracking-wider">
                                        {blog.tags?.[0] || 'Travel'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <RiTimeLine size={14} />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <RiChat3Line size={14} />
                                        {blog.commentsCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <RiHeartLine size={14} />
                                        {blog.likes || 0}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-normal text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 Mont leading-tight">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                    {blog.excerpt}
                                </p>
                                
                                <div className="flex items-center gap-2 text-black text-sm font-normal group-hover:gap-3 transition-all">
                                    Read Full Story <RiArrowRightLine />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 md:hidden">
                    <Link 
                        href="/blog"
                        className="flex items-center justify-center gap-2 w-full py-4 border-2 border-black text-black font-normal rounded-2xl hover:bg-black hover:text-white transition-all"
                    >
                        View all blogs <RiArrowRightLine />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BlogSection
