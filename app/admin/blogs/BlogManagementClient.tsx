'use client'

import { useState, useEffect } from 'react'
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiMoreLine } from 'react-icons/ri'
import AddBlogForm from './AddBlogForm'

const BlogManagementClient = () => {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingBlog, setEditingBlog] = useState<any>(null)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/blogs')
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

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success) {
                fetchBlogs()
            } else {
                alert(data.error || 'Failed to delete blog')
            }
        } catch (error) {
            console.error('Error deleting blog:', error)
        }
    }

    if (showAddForm || editingBlog) {
        return (
            <AddBlogForm 
                onClose={() => {
                    setShowAddForm(false)
                    setEditingBlog(null)
                    fetchBlogs()
                }} 
                blog={editingBlog}
            />
        )
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-start mb-6">
                <button
                    onClick={() => {
                        setEditingBlog(null)
                        setShowAddForm(true)
                    }}
                    className="px-3 py-1.5 md:px-6 md:py-2 bg-black text-white rounded-md text-[10px] md:text-sm font-light hover:bg-gray-800 transition-all"
                >
                    Create New Blog
                </button>
            </div>

            {loading ? (
                <div className="w-full">
                    <h2 className="text-sm md:text-lg font-medium text-gray-800 mb-6 px-1">Existing Blogs</h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3 animate-pulse border-b border-gray-100">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                </div>
                                <div className="w-10 h-4 bg-gray-100 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : blogs.length > 0 ? (
                <div className="w-full">
                    <h2 className="text-sm md:text-lg font-medium text-gray-800 mb-4 px-1">Existing Blogs</h2>

                    <div className="border border-gray-100 rounded-lg overflow-visible">
                        <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-3 hidden md:grid grid-cols-3 gap-4 rounded-t-lg">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Title</p>
                            <p 
                                className="text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900 flex items-center" 
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            >
                                Date {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
                            </p>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Views</p>
                        </div>

                        <div className="divide-y divide-gray-100 bg-white rounded-b-lg">
                            {([...blogs].sort((a, b) => {
                                if (!sortOrder) return 0;
                                const dateA = new Date(a.createdAt).getTime();
                                const dateB = new Date(b.createdAt).getTime();
                                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                            })).map((blog) => (
                                <div key={blog._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-3 md:gap-0">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <p className="text-xs md:text-sm font-medium md:font-normal text-gray-900 truncate max-w-[200px]">{blog.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Date</p>
                                            <p className="text-[10px] md:text-sm text-gray-900">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Views</p>
                                            <p className="text-[10px] md:text-sm text-gray-900">{blog.views || 0}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === blog._id ? null : blog._id)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <RiMoreLine className="text-gray-600" size={20} />
                                        </button>
                                        {openMenuId === blog._id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                <button
                                                    onClick={() => {
                                                        window.open(`/blog/${blog.slug}`, '_blank')
                                                        setOpenMenuId(null)
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                >
                                                    <RiEyeLine size={16} /> View
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenMenuId(null);
                                                        setEditingBlog(blog);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                                >
                                                    <RiEditLine size={16} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenMenuId(null);
                                                        handleDelete(blog._id);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm"
                                                >
                                                    <RiDeleteBinLine size={16} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-left px-1 text-gray-500 text-sm">No blogs found.</div>
            )}
        </div>
    )
}

export default BlogManagementClient
