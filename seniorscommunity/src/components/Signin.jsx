import React, { useState } from 'react'
import Navbar from './Navbar'
import {Link} from 'react-router-dom'
import AuthNetworking from '../assets/auth_networking_1788374869376.jpg'

export const Signin = () => {
   const [Loading,setLoading]=useState(false);
   const [darkmode,setDarkmode]=useState(false); // Default to light mode for cleaner UI
   const [Hide,setHide]=useState(true);
   const [Mail,setMail]=useState(false);
   
   const HandleMonkey = () => {
      setHide(false);
      setLoading(true);
      setTimeout(()=>setLoading(false),1000);
   }
   
   const HandleDarkmode=()=>{
      setDarkmode(!darkmode);
   }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <div 
        className="flex-1 flex items-center relative overflow-hidden"
        style={{ backgroundImage: `url(${AuthNetworking})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 py-12">
          
          {/* Left Side - Text */}
          <div className="w-full lg:w-1/2 text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
              Welcome back to your <br/> <span className="text-primary-300">community</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-lg leading-relaxed drop-shadow">
              Sign in to continue connecting with peers, exploring opportunities, and sharing your journey.
            </p>
          </div>
          
          {/* Right Side - Form */}
          <div className="w-full lg:w-5/12 max-w-md">
            
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
              {/* subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-600"></div>

              {Hide ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
                    <p className="text-slate-500 text-sm md:text-base">Students & Alumni (SIET)</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Year of Passing</label>
                      <select className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all appearance-none text-slate-900 font-medium cursor-pointer" required>
                        <option value="">Select your batch year...</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={HandleMonkey}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5"
                    >
                      Continue
                    </button>
                    
                    <div className="text-center mt-6 text-sm text-slate-500 font-medium">
                      New to Alumnis Hub?{' '}
                      <Link to="/" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                        Register here
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 pt-2">
                  {Loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-5">
                      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-semibold text-slate-500">Preparing login...</p>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => setHide(true)} 
                        className="mb-6 text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      >
                        ← Back
                      </button>
                      
                      <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Enter credentials</h2>
                        <p className="text-slate-500 text-sm">Please sign in with your registered email.</p>
                      </div>
                      
                      <form className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="your.email@srishakthi.ac.in" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                            placeholder="••••••••"
                          />
                        </div>
                        
                        <div className="flex justify-end mb-2">
                          <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        
                        <button 
                          type="button"
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 mt-4"
                        >
                          Sign In
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin;