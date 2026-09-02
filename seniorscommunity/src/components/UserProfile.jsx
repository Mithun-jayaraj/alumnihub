import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import ProfileCover from '../assets/profile_cover_1788374881248.jpg';
import { 
  Loader2, 
  Linkedin, 
  Github, 
  Code, 
  Mail, 
  UsersRound,
  Share2,
  Download,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Heart,
  MessageCircle,
  Eye,
  PenSquare
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import FollowersPage from './FollowersPage';
import FollowingPage from './Followingpage';

const shareUrl = window.location.href;

const UserProfile = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  
  const [userData, setUserData] = useState(null);
  const [gitData, setGitData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [follower, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeView, setActiveView] = useState('profile'); // 'profile', 'followers', 'following'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGitHubData = async (githubUsername) => {
    if (!githubUsername) return;
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error.message);
      // Don't set error - allow component to render without GitHub data
    }
  };

  const fetchUserBlogs = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`/api/v1/blogs/user/${userId}`);
      if (response.data.success) {
        setUserBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem("data"));
        setUserDetails(storedUserDetails);

        const completeUser = JSON.parse(localStorage.getItem("completeUser"));
        const basicUserData = JSON.parse(localStorage.getItem("userData"));
        
        const currentUserData = completeUser?.data || basicUserData;
        
        if (currentUserData) {
          setUserData(currentUserData);
          await fetchGitHubData(currentUserData.Github);
        }

        if (completeUser?.data?.id) {
          const response = await axios.post('/api/v1/getData', { 
            id: completeUser.data.id 
          });
          
          if (response.status === 200) {
            setFollowers(response.data.data.Followers || []);
            setFollowing(response.data.data.Following || []);
          }

          // Fetch user's blog posts
          await fetchUserBlogs(completeUser.data.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load profile data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const githubUrl = userData?.Github
    ? userData.Github.match(/^https?:\/\//i)
      ? userData.Github
      : `https://github.com/${userData.Github}/`
    : "#";
  const leetcodeUrl = userData?.Leetcode
    ? userData.Leetcode.match(/^https?:\/\//i)
      ? userData.Leetcode
      : `https://leetcode.com/u/${userData.Leetcode}/`
    : "#";
  const linkedinUrl = userData?.Linkedin || "#";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="w-full lg:w-[450px] xl:w-[500px] bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-pulse">
      <div className="bg-slate-200 h-24 -m-6 rounded-t-2xl"></div>
      <div className="flex justify-center -mt-12">
        <div className="w-32 h-32 bg-slate-200 rounded-full border-4 border-white shadow-sm"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
      </div>
      <div className="flex space-x-4 justify-center pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-12 bg-slate-200 rounded-full"></div>
        ))}
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64 mx-auto"></div>
      <div className="h-64 bg-slate-200 rounded-2xl"></div>
      <div className="h-48 bg-slate-200 rounded-2xl"></div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8 max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center lg:justify-end">
                <SkeletonCard />
              </div>
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-2xl">
                  <StatsSkeleton />
                </div>
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Side - Profile Card */}
              <div className="flex justify-center lg:justify-end lg:sticky lg:top-24">
                <div className="w-full max-w-md">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header with Cover Image */}
                    <div 
                      className="bg-primary-700 h-32 sm:h-48 relative bg-cover bg-center"
                      style={{ backgroundImage: `url(${ProfileCover})` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    </div>
                    
                    <div className="p-6 -mt-16 relative">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        {gitData?.avatar_url ? (
                          <img
                            src={gitData.avatar_url}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                            alt={`${gitData.login || 'User'}'s avatar`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-4xl text-slate-400">
                            👤
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="text-center space-y-3">
                        <h1 className="text-2xl font-bold text-slate-900">
                          {userDetails?.Name || "User"}
                        </h1>
                        
                        {userDetails?.Year && userDetails?.Department && (
                          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 text-sm font-semibold">
                            <span>
                              {userDetails.Year} - {userDetails.Department}
                            </span>
                            <span>🎓</span>
                          </div>
                        )}

                        {gitData?.name && (
                          <p className="text-slate-600 font-medium">{gitData.name}</p>
                        )}
                        
                        {gitData?.bio && (
                          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                            {gitData.bio}
                          </p>
                        )}

                        {gitData?.blog && (
                          <a 
                            href={gitData.blog} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {gitData.blog}
                          </a>
                        )}

                        {/* Followers/Following Stats */}
                        <div className="flex items-center justify-center gap-6 pt-5 pb-1 border-t border-slate-100 mt-5">
                          <button
                            onClick={() => setActiveView('followers')}
                            className="flex flex-col items-center group"
                          >
                            <span className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{follower?.length || 0}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                              Followers
                            </span>
                          </button>
                          <div className="w-px h-8 bg-slate-200"></div>
                          <button
                            onClick={() => setActiveView('following')}
                            className="flex flex-col items-center group"
                          >
                            <span className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{following?.length || 0}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                              Following
                            </span>
                          </button>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-3 pt-5">
                          {linkedinUrl !== "#" && (
                            <a 
                              href={linkedinUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                            >
                              <Linkedin className="w-5 h-5 text-[#0077B5]" />
                            </a>
                          )}
                          {githubUrl !== "#" && (
                            <a 
                              href={githubUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                            >
                              <Github className="w-5 h-5 text-slate-900" />
                            </a>
                          )}
                          {leetcodeUrl !== "#" && (
                            <a 
                              href={leetcodeUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                            >
                              <Code className="w-5 h-5 text-[#FFA116]" />
                            </a>
                          )}
                          {userDetails?.Email && (
                            <a 
                              href={`mailto:${userDetails.Email}`}
                              className="w-12 h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                            >
                              <Mail className="w-5 h-5 text-[#EA4335]" />
                            </a>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6">
                          <button 
                            onClick={reactToPrintFn}
                            className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                          <WhatsappShareButton 
                            url={shareUrl} 
                            title="Hey, I'm using Alumni Hub! Check out my profile and join us!"
                            className="flex-1"
                          >
                            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-sm shadow-primary-600/20">
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                          </WhatsappShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats or Followers/Following */}
              <div className="flex justify-center lg:justify-start">
                {activeView === 'profile' && userData ? (
                  <div className="w-full max-w-2xl space-y-8">
                    {/* Blog Posts Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        My Blog Posts
                      </h2>
                      
                      {userBlogs.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            {userBlogs.slice(0, 3).map((blog) => (
                              <div
                                key={blog._id}
                                onClick={() => navigate(`/blog/${blog._id}`)}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">
                                    {blog.title}
                                  </h3>
                                  <PenSquare className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors flex-shrink-0 ml-3" />
                                </div>
                                
                                {blog.excerpt && (
                                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                    {blog.excerpt}
                                  </p>
                                )}
                                
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
                                  <span>{formatDate(blog.createdAt)}</span>
                                  <div className="flex gap-4">
                                    <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                      <Heart className="w-4 h-4" />
                                      {blog.likes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                      <MessageCircle className="w-4 h-4" />
                                      {blog.comments?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <Eye className="w-4 h-4" />
                                      {blog.views || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {userBlogs.length > 3 && (
                            <button
                              onClick={() => navigate('/blogs')}
                              className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all font-semibold shadow-sm text-sm"
                            >
                              View All {userBlogs.length} Blog Posts
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
                          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-primary-400" />
                          </div>
                          <p className="text-slate-900 font-bold text-lg mb-1">No blog posts yet</p>
                          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Share your knowledge and experiences with the community.</p>
                          <button
                            onClick={() => navigate('/create-blog')}
                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold flex items-center gap-2 mx-auto shadow-sm shadow-primary-600/20 text-sm"
                          >
                            <PenSquare className="w-4 h-4" />
                            Write Your First Blog
                          </button>
                        </div>
                      )}
                    </div>

                    {/* LeetCode Stats */}
                    {userData?.Leetcode && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Code className="w-6 h-6 text-[#FFA116]" />
                          LeetCode Progress
                        </h2>
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden">
                          <img
                            src={`https://leetcard.jacoblin.cool/${userData.Leetcode}?theme=light&font=Inter&ext=heatmap`}
                            alt="LeetCode stats"
                            className="w-full h-auto rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<p class="text-slate-500 text-center py-8">LeetCode stats unavailable</p>';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* GitHub Stats */}
                    {userData?.Github && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Github className="w-6 h-6 text-slate-700" />
                          GitHub Activity
                        </h2>
                        
                        {/* Contribution Graph */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-x-auto">
                          <iframe
                            className="w-full min-w-[300px] h-[150px] border-0 rounded-lg"
                            src={`https://ghchart.rshah.org/0f172a/${userData.Github}`}
                            title="GitHub Heatmap"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>

                        {/* GitHub Stats Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-center col-span-1 md:col-span-2">
                            <img
                              src={`https://streak-stats.demolab.com/?user=${userData.Github}&count_private=true&theme=default&border_radius=10`}
                              alt="GitHub streak stats"
                              className="max-w-full h-auto w-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-slate-500 text-center py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-center">
                            <img
                              src={`https://github-readme-stats.vercel.app/api?username=${userData.Github}&show_icons=true&theme=default&rank_icon=github&border_radius=10`}
                              alt="GitHub stats"
                              className="max-w-full h-auto object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-slate-500 text-center py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-center">
                            <img
                              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData.Github}&hide=HTML&langs_count=8&layout=compact&theme=default&border_radius=10`}
                              alt="Top languages"
                              className="max-w-full h-auto object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-slate-500 text-center py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback if no data */}
                    {!userData?.Leetcode && !userData?.Github && userBlogs.length === 0 && (
                      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No content yet</h3>
                        <p className="text-slate-500 text-sm">Update your profile with GitHub or LeetCode links to see stats.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-4xl">
                    {/* Back Button */}
                    <div className="mb-6">
                      <button
                         onClick={() => setActiveView('profile')}
                        className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
                      >
                        ← Back to Profile
                      </button>
                    </div>

                    {activeView === 'followers' ? (
                      <FollowersPage props={follower} />
                    ) : (
                      <FollowingPage props={following} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
