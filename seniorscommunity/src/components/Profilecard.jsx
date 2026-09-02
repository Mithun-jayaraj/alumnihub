import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import axios from "axios";
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
  Calendar,
  User,
  PenSquare,
  TrendingUp
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import FollowersPage from './FollowersPage';
import FollowingPage from './Followingpage';
import { Loader2Icon } from 'lucide-react';

const shareUrl = window.location.href;

const Profilecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  
  const [follower, setFollowers] = useState([]);
  const [load, setLoad] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followerCount, setfollowerCount] = useState(0);
  const [followingCount, setfollowingCount] = useState(0);
  const [isFollow, setFollow] = useState(data?.follow || false);
  const [followChange, setfollowChange] = useState(false);
  const [followerChange, setfollowerChange] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeView, setActiveView] = useState('profile'); // 'profile', 'followers', 'following'
  const [loading, setLoading] = useState(true);

  const contentRef = useRef(null);
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleChangeFollow = () => {
    setfollowChange(!followChange);
    setfollowerChange(false);
  };

  const handleChangeFollower = () => {
    setfollowerChange(!followerChange);
    setfollowChange(false);
  };

  const handleFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('/api/v1/follow', {
        userId: completeUser.data.id,
        followerId: data.acadamicdata.Email,
      });
      if (response.status === 200) {
        setFollow(true);
        setfollowerCount(followerCount + 1);
      }
    } catch (error) {
      console.error('Error following user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleUnFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('/api/v1/unfollow', {
        userId: completeUser.data.id,
        followerId: data.acadamicdata.Email,
      });
      if (response.status === 200) {
        setFollow(false);
        setfollowerCount(followerCount - 1);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      // Using email as user identifier since that's what's available
      const response = await axios.get(`/api/v1/blogs/user/${data.acadamicdata.Email}`);
      if (response.data.success) {
        setUserBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setFollowers(data.userdata.Followers || []);
      setFollowing(data.userdata.Following || []);
      fetchUserBlogs();
    }
  }, [data]);

  useEffect(() => {
    setfollowerCount(follower.length);
    setfollowingCount(following.length);
  }, [follower, following]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const githubUrl = data
    ? data.userdata.Github?.match(/^https?:\/\//i)
      ? data.userdata.Github
      : `https://github.com/${data.userdata.Github}/`
    : "#";
  const leetcodeUrl = data
    ? data.userdata.Leetcode?.match(/^https?:\/\//i)
      ? data.userdata.Leetcode
      : `https://leetcode.com/u/${data.userdata.Leetcode}/`
    : "#";
  const linkedinUrl = data?.userdata.Linkedin || "#";

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="flex items-center justify-center p-8 mt-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No profile data found</h2>
            <p className="text-slate-500 mb-6">We couldn't load this user's profile information.</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold w-full shadow-sm shadow-primary-600/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Profile Card */}
            <div className="flex justify-center lg:justify-end lg:sticky lg:top-24">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Header with Cover Image */}
                  <div 
                    className="bg-primary-700 h-32 sm:h-48 relative bg-cover bg-center"
                    style={{ backgroundImage: "url('/src/assets/profile_cover_1788374881248.jpg')" }}
                  >
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  </div>
                  
                  <div className="p-6 -mt-16 relative">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      {data?.githubdata?.avatar_url ? (
                        <img
                          src={data.githubdata.avatar_url}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                          alt={`${data.githubdata.login}'s avatar`}
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
                        {data.acadamicdata?.Name || "User"}
                      </h1>
                      
                      <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full border border-primary-100 text-sm font-semibold">
                        <span>
                          {data.acadamicdata?.Year} - {data.acadamicdata?.Department}
                        </span>
                        <span>🎓</span>
                      </div>

                      {data.githubdata?.name && (
                        <p className="text-slate-600 font-medium">{data.githubdata.name}</p>
                      )}
                      
                      {data.githubdata?.bio && (
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                          {data.githubdata.bio}
                        </p>
                      )}

                      {data.githubdata?.blog && (
                        <a 
                          href={data.githubdata.blog} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {data.githubdata.blog}
                        </a>
                      )}

                      {/* Follow/Unfollow Button */}
                      {completeUser.data.id !== data?.acadamicdata?.Email && (
                        <div className="pt-4 px-2">
                          {!isFollow ? (
                            <button
                              disabled={load}
                              className={`w-full rounded-xl py-3 text-white font-semibold transition-all shadow-sm ${
                                load ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
                              }`}
                              onClick={handleFollow}
                            >
                              {load ? (
                                <div className='flex justify-center items-center gap-2'>
                                  <Loader2Icon className="animate-spin w-5 h-5" />
                                  Following...
                                </div>
                              ) : (
                                '+ Follow'
                              )}
                            </button>
                          ) : (
                            <button
                              disabled={load}
                              className={`w-full rounded-xl py-3 font-semibold transition-all shadow-sm border-2 ${
                                load ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                              onClick={handleUnFollow}
                            >
                              {load ? (
                                <div className='flex justify-center items-center gap-2'>
                                  <Loader2Icon className="animate-spin w-5 h-5 text-slate-400" />
                                  Unfollowing...
                                </div>
                              ) : (
                                'Following'
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Followers/Following Stats */}
                      <div className="flex items-center justify-center gap-6 pt-5 pb-1 border-t border-slate-100 mt-5">
                        <button
                          onClick={() => setActiveView('followers')}
                          className="flex flex-col items-center group"
                        >
                          <span className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{followerCount}</span>
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                            Followers
                          </span>
                        </button>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <button
                          onClick={() => setActiveView('following')}
                          className="flex flex-col items-center group"
                        >
                          <span className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{followingCount}</span>
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
                        {data.acadamicdata?.Email && (
                          <a 
                            href={`mailto:${data.acadamicdata.Email}`}
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
                          title={`Check out ${data.acadamicdata?.Name}'s profile on Alumni Hub!`}
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

            {/* Right Side - Content Feed */}
            <div className="flex justify-center lg:justify-start">
              {activeView === 'profile' ? (
                <div className="w-full max-w-2xl space-y-8">
                  {/* Instagram-Style Blog Feed */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary-600" />
                      Posts & Activities
                    </h2>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                               <div className="flex-1">
                                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                               </div>
                            </div>
                            <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                          </div>
                        ))}
                      </div>
                    ) : userBlogs.length > 0 ? (
                      <>
                        {/* Instagram-style Feed Grid */}
                        <div className="space-y-6">
                          {userBlogs.map((blog) => (
                            <div
                              key={blog._id}
                              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                              onClick={() => navigate(`/blog/${blog._id}`)}
                            >
                              {/* Post Header */}
                              <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                                <img
                                  src={data.githubdata?.avatar_url || 'https://via.placeholder.com/40'}
                                  alt={data.acadamicdata?.Name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div className="flex-1">
                                  <h4 className="text-slate-900 font-bold text-sm">
                                    {data.acadamicdata?.Name}
                                  </h4>
                                  <p className="text-slate-500 text-xs font-medium">
                                    {formatDate(blog.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Cover Image */}
                              {blog.coverImage ? (
                                <img
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  className="w-full h-64 object-cover"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                  <BookOpen className="w-16 h-16 text-white opacity-40" />
                                </div>
                              )}

                              {/* Post Content */}
                              <div className="p-5">
                                {/* Interaction Buttons */}
                                <div className="flex items-center gap-5 mb-4">
                                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                    <span className="text-sm font-bold">
                                      {blog.likes?.length || 0}
                                    </span>
                                  </button>
                                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-6 h-6" />
                                    <span className="text-sm font-bold">
                                      {blog.comments?.length || 0}
                                    </span>
                                  </button>
                                  <div className="flex items-center gap-1.5 text-slate-400 ml-auto">
                                    <Eye className="w-5 h-5" />
                                    <span className="text-sm font-medium">
                                      {blog.views || 0}
                                    </span>
                                  </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-slate-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                  {blog.title}
                                </h3>

                                {/* Excerpt */}
                                {blog.excerpt && (
                                  <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                    {blog.excerpt}
                                  </p>
                                )}

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {blog.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* View All Blogs Button */}
                        {userBlogs.length > 0 && (
                          <button
                            onClick={() => navigate('/blogs')}
                            className="w-full px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all font-semibold shadow-sm text-sm"
                          >
                            View All {userBlogs.length} Posts
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-1">No posts yet</p>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                          {data.acadamicdata?.Name} hasn't shared any content
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LeetCode Stats */}
                  {data.userdata?.Leetcode && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Code className="w-6 h-6 text-[#FFA116]" />
                        LeetCode Progress
                      </h2>
                      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden">
                        <img
                          src={`https://leetcard.jacoblin.cool/${data.userdata.Leetcode}?theme=light&font=Inter&ext=heatmap`}
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
                  {data.userdata?.Github && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Github className="w-6 h-6 text-slate-700" />
                        GitHub Activity
                      </h2>
                      
                      {/* Contribution Graph */}
                      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-x-auto">
                        <iframe
                          className="w-full min-w-[300px] h-[150px] border-0 rounded-lg"
                          src={`https://ghchart.rshah.org/0f172a/${data.userdata.Github}`}
                          title="GitHub Heatmap"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>

                      {/* GitHub Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-center col-span-1 md:col-span-2">
                          <img
                            src={`https://streak-stats.demolab.com/?user=${data.userdata.Github}&count_private=true&theme=default&border_radius=10`}
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
                            src={`https://github-readme-stats.vercel.app/api?username=${data.userdata.Github}&show_icons=true&theme=default&rank_icon=github&border_radius=10`}
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
                            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.userdata.Github}&hide=HTML&langs_count=8&layout=compact&theme=default&border_radius=10`}
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
        </div>
      </div>
    </div>
  );
};

export default Profilecard;
