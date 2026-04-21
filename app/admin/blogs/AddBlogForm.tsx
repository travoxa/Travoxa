'use client'

import { useState } from 'react'
import { RiCloseLine, RiSaveLine, RiImageAddLine } from 'react-icons/ri'
import { CldUploadWidget } from 'next-cloudinary'
import Spinner from '@/components/ui/Spinner';

interface AddBlogFormProps {
    onClose: () => void
    blog?: any
}

const DUMMY_BLOG_DATA = {
    title: 'Top 10 Hidden Gems in Himachal (Development)',
    slug: 'top-10-hidden-gems-himachal',
    excerpt: 'Discover the untouched beauty of Himachal Pradesh with our curated list of hidden gems.',
    content: '<h1>Exploring Himachal</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    author: 'Travoxa Explorer',
    tags: 'Himachal, Offbeat, Travel Guide',
}

const AddBlogForm: React.FC<AddBlogFormProps> = ({ onClose, blog }) => {
    const isEditing = !!blog
    const isDev = process.env.NODE_ENV === 'development'
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: blog?.title || (isDev && !isEditing ? DUMMY_BLOG_DATA.title : ''),
        slug: blog?.slug || (isDev && !isEditing ? DUMMY_BLOG_DATA.slug : ''),
        excerpt: blog?.excerpt || (isDev && !isEditing ? DUMMY_BLOG_DATA.excerpt : ''),
        content: blog?.content || (isDev && !isEditing ? DUMMY_BLOG_DATA.content : ''),
        coverImage: blog?.coverImage || (isDev && !isEditing ? DUMMY_BLOG_DATA.coverImage : ''),
        author: blog?.author || (isDev && !isEditing ? DUMMY_BLOG_DATA.author : 'Travoxa Team'),
        tags: blog?.tags?.join(', ') || (isDev && !isEditing ? DUMMY_BLOG_DATA.tags : ''),
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        
        // Auto-generate slug from title
        if (name === 'title' && !isEditing) {
            const generatedSlug = value
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-')
            setFormData(prev => ({ ...prev, slug: generatedSlug }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSubmit = {
                ...formData,
                tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
            }

            const url = isEditing ? `/api/blogs/${blog._id}` : '/api/blogs'
            const method = isEditing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            })

            const data = await res.json()
            if (data.success) {
                onClose()
            } else {
                alert(data.error || 'Failed to save blog')
            }
        } catch (error) {
            console.error('Error saving blog:', error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
                <RiCloseLine size={24} />
            </button>
            
            <h2 className="text-lg font-medium text-gray-800 mb-6">
                {isEditing ? 'Edit Blog' : 'Create New Blog'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter blog title"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="url-friendly-slug"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Short summary for the blog card"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none text-sm"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                required
                            />
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "travoxa_default"}
                                onSuccess={(result: any) => {
                                    setFormData(prev => ({ ...prev, coverImage: result.info.secure_url }))
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="p-2 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-2"
                                    >
                                        <RiImageAddLine size={20} />
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="travel, adventure, luxury"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Content (HTML or Text)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your blog content here..."
                        rows={10}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                        required
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all text-sm font-light disabled:opacity-50"
                    >
                        {loading ? (
                            <Spinner size="sm" variant="white" />
                        ) : (
                            <RiSaveLine size={20} />
                        )}
                        <span>{isEditing ? 'Update Blog' : 'Save Blog'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddBlogForm
