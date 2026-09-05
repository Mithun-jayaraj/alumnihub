import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Stdimg from "../assets/clgstd.png";
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [darkmode, setDarkmode] = useState(true);
  const [hide, setHide] = useState(true);

  const linkedinRef = useRef(null);
  const githubRef = useRef(null);
  const leetcodeRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("data"));

  const handleMonkey = () => {
    setHide(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleDarkmode = () => {
    setDarkmode((prev) => !prev);
  };

  const handleSubmit = async () => {
    setLoad(true);
    try {
      if (!userData?.Email) {
        throw new Error("User data is missing!");
      }
      const linkedinRaw = linkedinRef.current.value.trim();
      const githubRaw = githubRef.current.value.trim();
      const leetcodeRaw = leetcodeRef.current.value.trim();

      if (!linkedinRaw || !githubRaw || !leetcodeRaw) {
        const notify = () => toast('Please fill all the details');
        notify();
        return;
      }

      if (leetcodeRaw.length > 15) {
        const notify1 = () => toast('Leetcode username should be enter!');
        notify1();
        return;
      }

      const githubUsername = githubRaw.match(/github\.com\/([^/]+)/i)
        ? githubRaw.match(/github\.com\/([^/]+)/i)[1]
        : githubRaw.replace(/^@/, '');

      const linkedinUrl = linkedinRaw.match(/^https?:\/\//i)
        ? linkedinRaw
        : `https://www.linkedin.com/in/${linkedinRaw.replace(/^@/, '')}`;

      const obj = {
        id: userData.Email,
        Linkedin: linkedinUrl,
        Github: githubUsername,
        Leetcode: leetcodeRaw,
      };

      const res = await axios.post(
        "/api/v1/addData",
        obj
      );

      if (res.status === 200) {
        localStorage.setItem("userData", JSON.stringify(obj));
        navigate("/home");
        localStorage.setItem("completeUser", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error submitting profile data:", error.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?.Email) {
          throw new Error("User data is missing!");
        }

        const res = await axios.post(
          "/api/v1/getData",
          { id: userData.Email }
        );

        if (res.status === 200) {
          localStorage.setItem("completeUser", JSON.stringify(res.data));
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {userData ? (
        <div className="min-h-screen flex flex-col font-sans">
          <Toaster />
          <Navbar />
          <div 
            className="flex-1 flex items-center relative overflow-hidden"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply z-0"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 py-12">
              
              {/* Left Side - Text */}
              <div className="w-full lg:w-1/2 text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary-600/90 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg border border-primary-500/30">
                  <span className="text-base">🎓</span>
                  Welcome to Alumnis Hub
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
                  Complete your <br/> professional <span className="text-primary-300">identity</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-lg leading-relaxed drop-shadow">
                  Add your social links and portfolio to help peers and recruiters find you easily within the network.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/80 flex items-center justify-center backdrop-blur-sm border border-primary-400/30">
                      <span className="text-lg">👥</span>
                    </div>
                    <span className="text-sm font-medium text-slate-100">Connect<br/>with alumni</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/80 flex items-center justify-center backdrop-blur-sm border border-primary-400/30">
                      <span className="text-lg">💼</span>
                    </div>
                    <span className="text-sm font-medium text-slate-100">Grow your<br/>network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/80 flex items-center justify-center backdrop-blur-sm border border-primary-400/30">
                      <span className="text-lg">📈</span>
                    </div>
                    <span className="text-sm font-medium text-slate-100">Unlock<br/>opportunities</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="w-full lg:w-5/12 max-w-md">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
                  {/* subtle top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-600"></div>

                  {hide ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-primary-100">
                          <span className="text-4xl">🚀</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Almost there!</h2>
                        <p className="text-slate-500 text-sm md:text-base leading-relaxed px-4">Let's set up your profile to connect with the community.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <button 
                          onClick={handleMonkey}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 flex justify-center items-center gap-2 group"
                        >
                          Complete Profile
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        
                        <div className="flex justify-center gap-2 pt-2">
                          <div className="w-8 h-1.5 bg-primary-600 rounded-full"></div>
                          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
                          <div className="w-8 h-1.5 bg-slate-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 pt-2">
                      {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center space-y-5">
                          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                          <p className="text-sm font-semibold text-slate-500">Preparing workspace...</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Professional Links</h2>
                            <p className="text-slate-500 text-sm">Add your profiles to showcase your work.</p>
                          </div>
                          
                          <div className="space-y-5">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn URL</label>
                              <input 
                                ref={linkedinRef}
                                type="text" 
                                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium"
                                placeholder="linkedin.com/in/username" 
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">GitHub Username</label>
                              <input 
                                ref={githubRef}
                                type="text" 
                                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium" 
                                placeholder="github-username"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Leetcode Username</label>
                              <input 
                                ref={leetcodeRef}
                                type="text" 
                                className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium" 
                                placeholder="leetcode-username"
                              />
                            </div>
                            
                            <button 
                              onClick={handleSubmit}
                              disabled={load}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 mt-6 flex justify-center items-center"
                            >
                              {load ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                "Save & Continue"
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navbar />
      )}
    </>
  );
};

export default Profile;
