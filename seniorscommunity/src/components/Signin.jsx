import React, { useState } from 'react'
import Navbar from './Navbar'
import {Link} from 'react-router-dom'

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
      <div className="flex-1 flex bg-slate-50">
        
        {/* Left Side - Image */}
        <div className="hidden lg:flex w-1/2 relative bg-primary-900 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('/src/assets/auth_networking_1788374869376.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
            <h2 className="text-3xl font-bold mb-4">Welcome back to your community</h2>
            <p className="text-primary-100 text-lg max-w-md leading-relaxed">
              Sign in to continue connecting with peers, exploring opportunities, and sharing your journey.
            </p>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
          <div className="w-full max-w-md">
            
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              {Hide ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in</h2>
                    <p className="text-slate-500">Students & Alumni (SIET)</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Year of Passing</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all appearance-none bg-white text-slate-900 cursor-pointer" required>
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
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20"
                    >
                      Continue
                    </button>
                    
                    <div className="text-center mt-6 text-sm text-slate-500">
                      New to Alumnis Hub?{' '}
                      <Link to="/" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                        Register here
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  {Loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-slate-500">Preparing login...</p>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => setHide(true)} 
                        className="mb-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      >
                        ← Back
                      </button>
                      
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter credentials</h2>
                        <p className="text-slate-500 text-sm">Please sign in with your registered email.</p>
                      </div>
                      
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                            placeholder="your.email@srishakthi.ac.in" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400" 
                            placeholder="••••••••"
                          />
                        </div>
                        
                        <div className="flex justify-end mb-2">
                          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        
                        <button 
                          type="button"
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20"
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