import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Save, 
  X, 
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userDetails = JSON.parse(localStorage.getItem("data"));
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        authorId: completeUser?.data?.id || userDetails?.id,
        authorName: userDetails?.Name,
        authorEmail: userDetails?.Email
      };

      const response = await axios.post('/api/v1/blogs', blogData);

      if (response.data.success) {
        navigate(`/blog/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] z-0"></div>
      <div className="relative z-20"><Navbar /></div>
      <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Create New Post</h1>
            <p className="text-slate-500">Share your knowledge, projects, or experiences with the community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
              
              {/* Cover Image URL */}
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                  <ImageIcon className="w-5 h-5 text-primary-500" />
                  Cover Image URL <span className="text-slate-400 font-normal text-sm ml-1">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                />
                {formData.coverImage && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-48 md:h-64 object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What is this post about?"
                  required
                  maxLength={200}
                  className="w-full px-4 py-4 bg-slate-50 text-slate-900 text-lg md:text-xl font-medium rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                />
                <div className="flex justify-end">
                  <p className="text-slate-400 text-sm mt-2 font-medium">{formData.title.length}/200</p>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  Summary <span className="text-slate-400 font-normal text-sm ml-1">(Optional)</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a brief summary of your post..."
                  rows={2}
                  maxLength={300}
                  className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                />
                <div className="flex justify-end">
                  <p className="text-slate-400 text-sm mt-2 font-medium">{formData.excerpt.length}/300</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-slate-700 font-semibold mb-3">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your content here... (Markdown supported)"
                  required
                  rows={15}
                  className="w-full px-4 py-4 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none leading-relaxed"
                />
                <div className="flex justify-end">
                  <p className="text-slate-400 text-sm mt-2 font-medium">{formData.content.length} characters</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                  <Tag className="w-5 h-5 text-primary-500" />
                  Tags <span className="text-slate-400 font-normal text-sm ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="technology, careers, events (comma separated)"
                  className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                />
                <p className="text-slate-500 text-sm mt-2">Separate tags with commas to help others find your post.</p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm sm:w-auto w-full"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-600/20"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
