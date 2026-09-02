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
          <div className="flex-1 flex bg-slate-50">
            
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-primary-900 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
                <h2 className="text-3xl font-bold mb-4">Complete your professional identity</h2>
                <p className="text-primary-100 text-lg max-w-md leading-relaxed">
                  Add your social links and portfolio to help peers and recruiters find you easily within the network.
                </p>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
              <div className="w-full max-w-md">
                
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                  {hide ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">🚀</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Almost there!</h2>
                        <p className="text-slate-500">Let's set up your profile to connect with the community.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <button 
                          onClick={handleMonkey}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20"
                        >
                          Complete Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                      {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                          <p className="text-sm font-medium text-slate-500">Preparing workspace...</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Professional Links</h2>
                            <p className="text-slate-500 text-sm">Add your profiles to showcase your work.</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                              <input 
                                ref={linkedinRef}
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                                placeholder="linkedin.com/in/username" 
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Username</label>
                              <input 
                                ref={githubRef}
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all" 
                                placeholder="github-username"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Leetcode Username</label>
                              <input 
                                ref={leetcodeRef}
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all" 
                                placeholder="leetcode-username"
                              />
                            </div>
                            
                            <button 
                              onClick={handleSubmit}
                              disabled={load}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20 mt-4 flex justify-center items-center h-[52px]"
                            >
                              {load ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                "Save Profile"
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
