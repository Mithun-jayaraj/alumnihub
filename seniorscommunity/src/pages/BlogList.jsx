import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Search, 
  PenSquare, 
  Heart, 
  MessageCircle, 
  Eye,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const userDetails = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    fetchBlogs();
  }, [page, selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/blogs`, {
        params: { page, limit: 9, tags: selectedTag }
      });
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBlogs();
      return;
    }

    try {
      const response = await axios.get(`/api/v1/blogs/search`, {
        params: { q: searchQuery }
      });
      
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SkeletonCard = () => (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-4 pt-4">
          <div className="h-8 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-0"></div>
      <div className="relative z-20"><Navbar /></div>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 flex items-center justify-center gap-4 tracking-tight drop-shadow-sm">
            <TrendingUp className="w-12 h-12 text-primary-600" />
            Alumni <span className="text-primary-600">Feed</span>
          </h1>
          <p className="text-slate-700 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
            Discover stories, knowledge, and experiences shared by the community.
          </p>
        </div>

        {/* Search and Create Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-4 sm:p-5 mb-12 border border-white/40 shadow-2xl flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts by title, content, or tags..."
              className="w-full pl-14 pr-4 py-4 bg-slate-50/50 text-slate-900 rounded-2xl border border-slate-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleSearch}
              className="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-2xl transition-all font-semibold shadow-sm"
            >
              Search
            </button>
            <button
              onClick={() => navigate('/create-blog')}
              className="flex-1 md:flex-none px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 hover:-translate-y-0.5"
            >
              <PenSquare className="w-5 h-5" />
              Write Post
            </button>
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="mx-auto mb-8 w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-purple-100 rounded-full opacity-60 blur-3xl"></div>
              <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="No posts" className="w-full h-full object-cover rounded-[2rem] shadow-xl rotate-[-2deg] relative z-10 border-4 border-white" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center rotate-[10deg] z-20 border border-slate-100">
                <PenSquare className="w-10 h-10 text-primary-500" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No posts found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg opacity-80">
              There are no posts here yet. Be the first to share your thoughts, projects, or experiences with the community!
            </p>
            <button
              onClick={() => navigate('/create-blog')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-sm inline-flex items-center gap-2"
            >
              <PenSquare className="w-5 h-5" />
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group flex flex-col"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {/* Cover Image */}
                  {blog.coverImage ? (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <PenSquare className="w-16 h-16 text-white/30" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
                      {blog.excerpt || blog.content.substring(0, 150) + '...'}
                    </p>

                    {/* Footer Info */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate max-w-[120px]">{blog.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-slate-500 text-sm pt-2">
                        <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{blog.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{blog.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{blog.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm"
                >
                  Previous
                </button>
                <span className="px-5 py-2.5 bg-primary-50 text-primary-700 font-medium rounded-xl border border-primary-100">
                  Page {page} of {pagination.total}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.total}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
