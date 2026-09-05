import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User,
  ArrowLeft,
  Send,
  Trash2,
  Edit
} from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("data"));
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));
  const userId = completeUser?.data?.id;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/v1/blogs/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
        setIsLiked(response.data.data.likes?.includes(userId));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/v1/blogs/${id}/like`, {
        userId
      });
      
      if (response.data.success) {
        setIsLiked(response.data.isLiked);
        fetchBlog(); // Refresh to get updated like count
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/api/v1/blogs/${id}/comment`, {
        userId,
        userName: userDetails?.Name,
        content: commentText
      });

      if (response.data.success) {
        setCommentText('');
        fetchBlog();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`/api/v1/blogs/${id}`);
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Blog not found</h2>
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </>
    );
  }

  const isAuthor = blog.authorEmail === userDetails?.Email;

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] z-0"></div>
      <div className="relative z-20"><Navbar /></div>
      <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Feed
          </button>

          {/* Blog Content */}
          <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-8">
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[400px] object-cover"
              />
            )}

            <div className="p-8 md:p-12">
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">{blog.title}</h1>

              {/* Author Info and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{blog.authorName}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/edit-blog/${id}`)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-2 transition-all font-medium shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteBlog}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl flex items-center gap-2 transition-all font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="prose prose-slate max-w-none mb-12">
                <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>
              
              {/* Stats and Like Button */}
              <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-sm font-medium ${
                    isLiked
                      ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blog.likes?.length || 0} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <MessageCircle className="w-5 h-5 text-slate-400" />
                  <span>{blog.comments?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <Eye className="w-5 h-5 text-slate-400" />
                  <span>{blog.views || 0}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-primary-500" />
              Discussion ({blog.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-10 relative">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                  {userDetails?.Name?.charAt(0) || <User className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add to the discussion..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none shadow-sm"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-primary-600/20"
                    >
                      <Send className="w-4 h-4" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment, index) => (
                  <div
                    key={comment._id || index}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 border border-slate-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-5 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{comment.userName}</span>
                        <span className="text-xs font-medium text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    No comments yet. Start the conversation!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
