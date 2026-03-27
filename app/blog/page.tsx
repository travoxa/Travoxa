'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { RiTimeLine, RiChat3Line, RiHeartLine, RiArrowRightLine } from 'react-icons/ri'

const BlogListingPage = () => {
    const [blogs, setBlogs] = useState<any[]>([])
    const [filteredBlogs, setFilteredBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All Article')
    const [email, setEmail] = useState('')

    const categories = [
        'All Article',
        'Travel Tips',
        'Destinations',
        'Cultural Insights',
        'Adventures',
        'Solo Travel'
    ]

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/blogs')
                const data = await res.json()
                if (data.success) {
                    setBlogs(data.data)
                    setFilteredBlogs(data.data)
                }
            } catch (error) {
                console.error('Error fetching blogs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [])

    useEffect(() => {
        if (activeCategory === 'All Article') {
            setFilteredBlogs(blogs)
        } else {
            const filtered = blogs.filter(blog => 
                blog.tags?.some((tag: string) => tag.toLowerCase() === activeCategory.toLowerCase())
            )
            setFilteredBlogs(filtered)
        }
    }, [activeCategory, blogs])

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock subscription logic
        alert(`Subscribed with: ${email}`)
        setEmail('')
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header forceWhite={true} />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-16 flex flex-col items-center">
                        <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-normal rounded-md mb-6 uppercase tracking-wider">
                            Blogs & Articles
                        </span>
                        <h1 className="text-5xl md:text-7xl font-normal text-gray-900 mb-6 Mont tracking-tight">
                            Blogs & Articles
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-light">
                            Subscribe to learn more about traveling and get newest tips for upcoming travel
                        </p>

                        {/* Subscription Input */}
                        <form onSubmit={handleSubscribe} className="relative w-full max-w-xl mx-auto mb-20 group">
                            <div className="flex items-center p-1.5 bg-white border border-gray-200 rounded-full shadow-sm group-focus-within:border-green-400 group-focus-within:ring-4 group-focus-within:ring-green-50 transition-all">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-6 bg-transparent border-none focus:outline-none text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-normal transition-all shadow-lg shadow-green-100"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </form>

                        <h2 className="text-3xl md:text-5xl font-normal text-gray-900 mb-10 Mont">
                            Recent Blog Post
                        </h2>

                        {/* Category Filter bar */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-10 border-b border-gray-100 pb-6 mb-12 w-full">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-sm font-normal transition-all ${
                                        activeCategory === cat 
                                        ? 'text-green-600 relative after:absolute after:-bottom-6 after:left-0 after:w-full after:h-0.5 after:bg-green-600' 
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl border border-gray-50 p-8 space-y-4 animate-pulse shadow-sm">
                                    <div className="h-48 bg-gray-50 rounded-2xl w-full"></div>
                                    <div className="h-6 bg-gray-50 rounded w-3/4"></div>
                                    <div className="h-20 bg-gray-50 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-normal text-gray-400 Mont">No blog posts found in this category.</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <Link 
                                    key={blog._id} 
                                    href={`/blog/${blog.slug}`}
                                    className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={blog.coverImage} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs font-light text-gray-400 mb-4 uppercase tracking-wider">
                                            <span className="flex items-center gap-1">
                                                <RiTimeLine size={14} className="text-gray-300" />
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <RiChat3Line size={14} className="text-gray-300" />
                                                {blog.commentsCount || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <RiHeartLine size={14} className="text-gray-300" />
                                                {blog.likes || 0}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-normal text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 Mont leading-tight">
                                            {blog.title}
                                        </h3>
                                        
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 font-light leading-relaxed">
                                            {blog.excerpt}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 text-gray-900 text-sm font-normal group-hover:gap-3 transition-all">
                                            Read More <RiArrowRightLine className="text-green-600" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default BlogListingPage
