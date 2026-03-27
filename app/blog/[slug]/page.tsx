'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { RiTimeLine, RiChat3Line, RiHeartLine, RiHeartFill, RiStarLine, RiStarFill, RiUserLine, RiSendPlaneLine } from 'react-icons/ri'
import { useSession } from 'next-auth/react'

const BlogDetailPage = () => {
    const { slug } = useParams()
    const { data: session } = useSession()
    const [blog, setBlog] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [commentText, setCommentText] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [userRating, setUserRating] = useState(0)

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${slug}`)
            const data = await res.json()
            if (data.success) {
                setBlog(data.data)
                setIsLiked(data.data.likedBy?.includes(session?.user?.id || session?.user?.email))
            }
        } catch (error) {
            console.error('Error fetching blog:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        if (!blog?._id) return
        try {
            const res = await fetch(`/api/blogs/${blog._id}/comments`)
            const data = await res.json()
            if (data.success) {
                setComments(data.data)
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    useEffect(() => {
        if (slug) fetchBlog()
    }, [slug, session])

    useEffect(() => {
        if (blog?._id) fetchComments()
    }, [blog?._id])

    const handleLike = async () => {
        if (!session) {
            alert('Please login to like this post')
            return
        }
        try {
            const res = await fetch(`/api/blogs/${blog._id}/like`, { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                setIsLiked(data.liked)
                setBlog((prev: any) => ({ ...prev, likes: data.likes }))
            }
        } catch (error) {
            console.error('Error liking blog:', error)
        }
    }

    const handleRate = async (rating: number) => {
        if (!session) {
            alert('Please login to rate this post')
            return
        }
        try {
            const res = await fetch(`/api/blogs/${blog._id}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating }),
            })
            const data = await res.json()
            if (data.success) {
                setUserRating(rating)
                setBlog((prev: any) => ({ ...prev, averageRating: data.averageRating }))
            }
        } catch (error) {
            console.error('Error rating blog:', error)
        }
    }

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            alert('Please login to comment')
            return
        }
        if (!commentText.trim()) return

        setSubmittingComment(true)
        try {
            const res = await fetch(`/api/blogs/${blog._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            })
            const data = await res.json()
            if (data.success) {
                setCommentText('')
                fetchComments()
            }
        } catch (error) {
            console.error('Error posting comment:', error)
        } finally {
            setSubmittingComment(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    if (!blog) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-normal mb-4 Mont">Blog post not found.</h1>
            <a href="/blog" className="text-blue-600 hover:underline">Back to all blogs</a>
        </div>
    )

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header forceWhite={true} />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] w-full">
                    <img 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-4xl mx-auto px-4 text-center text-white">
                            <div className="flex justify-center gap-4 mb-6">
                                {blog.tags?.map((tag: string) => (
                                    <span key={tag} className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-light">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-normal Mont leading-tight mb-6">
                                {blog.title}
                            </h1>
                            <div className="flex items-center justify-center gap-6 text-sm md:text-base font-light opacity-90">
                                <span className="flex items-center gap-2">
                                    <RiUserLine size={20} />
                                    {blog.author}
                                </span>
                                <span className="flex items-center gap-2">
                                    <RiTimeLine size={20} />
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                    {/* Content */}
                    <article 
                        className="prose prose-lg max-w-none text-gray-800 Inter font-light leading-relaxed mb-16"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <hr className="border-gray-100 mb-12" />

                    {/* Interactions */}
                    <div className="flex flex-wrap items-center justify-between gap-8 mb-16 p-8 bg-gray-50 rounded-3xl">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                                    isLiked ? 'bg-red-50 text-red-500 shadow-sm shadow-red-100' : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {isLiked ? <RiHeartFill size={24} /> : <RiHeartLine size={24} />}
                                <span className="font-normal">{blog.likes || 0}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-gray-500 mr-2 uppercase tracking-wider">Rate:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        className="text-amber-400 hover:scale-110 transition-transform"
                                    >
                                        {(userRating || Math.round(blog.averageRating)) >= star ? <RiStarFill size={24} /> : <RiStarLine size={24} />}
                                    </button>
                                ))}
                                <span className="ml-2 font-normal text-gray-900">{blog.averageRating.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500">
                            <RiChat3Line size={24} />
                            <span className="font-normal">{comments.length} Comments</span>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-12">
                        <h2 className="text-2xl font-normal text-gray-900 Mont">Discussion</h2>
                        
                        {/* Post Comment */}
                        <form onSubmit={handleComment} className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <RiUserLine size={24} className="text-gray-400" />
                                    )}
                                </div>
                                <textarea 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={session ? "Share your thoughts..." : "Please login to join the discussion"}
                                    disabled={!session || submittingComment}
                                    className="flex-1 min-h-[100px] p-6 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={!session || submittingComment || !commentText.trim()}
                                    className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all font-normal"
                                >
                                    {submittingComment ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Post Comment <RiSendPlaneLine />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-8 pt-6">
                            {comments.length === 0 ? (
                                <p className="text-center py-12 text-gray-400 italic">No comments yet. Be the first to share your thoughts!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {comment.userImage ? (
                                                <img src={comment.userImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-normal uppercase">
                                                    {comment.userName?.[0] || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-normal text-gray-900">{comment.userName}</h4>
                                                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-3xl rounded-tl-none group-hover:bg-gray-100/50 transition-colors">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default BlogDetailPage
