import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'
import ProfilePic from '../assets/mithun.png'
import Otpbox from './Otpbox'
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const RootPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [hide1, setHide1] = useState(true);
  const [color, setColor] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [email1, setEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [emailDeliveryError, setEmailDeliveryError] = useState('');
  const [userdata, setUserdata] = useState(false);
  const emailref = useRef(null);
  const [Redirect,SetRedirect]=useState(false);
  const [datu,setdatu]=useState(null);
  const [correct,Setcorrect]=useState(false);
  
  const handleChangeOTP = (newOTP) => {
    setOtp(newOTP);
    if (newOTP === generatedOtp) {
      const sendData=async(datu)=>{
        try {
          const res1= await axios.post('/api/v1/addUser',datu);
          if(res1.status==201)
          {
           toast.success('Signed up successfully!');
           setTimeout(()=>{
            SetRedirect(true);
            Setcorrect(true);
           },1000);
          }
        } catch (error) {
          console.log(datu);
          toast.error('Signup error!');
        }
      }
      sendData(datu);
    } else {
      console.log("Incorrect OTP.");
    }
  };

  const handleCheckemail = async() => {
    setLoading(true);
    setUserdata(null);
    const email = emailref.current.value;
    let year = "";
    let emailBack = "@srishakthi.ac.in";
    let dummy = "";
    let Name = "";
    let Department = "";
    let f = 0;
    let f1 = 0;
    
    for (let i = 0; i < email.length; i++) {
      if (email.charAt(i) === '@') {
        f = 1;
      }
      if (email.charAt(i) >= 0 && email.charAt(i) <= 9) {
        f1 = 1;
        year = year + email.charAt(i);
      }
      if (f1 === 0) {
        Name += email.charAt(i);
      }
      if (f === 1) {
        dummy += email.charAt(i);
      }
    }
    
    let t=0;
    for(let i=0;i<email.length;i++) {
      if(email.charAt(i)>='0' && email.charAt(i)<='9') {
        t++;
      }
      if(t==2) {
        Department+=email.charAt(i+1);
        if(email.charAt(i+2)=='@') {
          break;
        }
      }
    }
    
    if (year.length === 2 && dummy === emailBack) {
      setEmail(false);
    } else {
      setEmail(true);
      setLoading(false);
      return;
    }
    
    let x1 = Name.charAt(Name.length - 1);
    Name = Name.slice(0, -1) + " " + x1;

    const userData = {
      Name: Name.toUpperCase(),
      Email: email,
      Year: year,
      Department: Department.toUpperCase(),
    };
    
    setdatu(userData);
    localStorage.setItem('data',JSON.stringify(userData));
    setUserdata(userData);
    sendMail(email,Name);
  };
  
  const sendMail = async (email,Name) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/generate-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,Name }),
      });

      const result = await response.json();
      if (response.ok) {
        setGeneratedOtp(result.otp);
        setEmailSent(result.emailSent !== false);
        setEmailDeliveryError(result.emailSent === false ? result.message : '');
        console.log("Generated OTP:", result.otp);
        setEmail(false);
      } else {
        setEmail(true);
        setEmailSent(false);
        setEmailDeliveryError(result.message || 'Failed to generate OTP.');
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setEmail(true);
    }
  };

  const handleConfirm = async () => {
    setHide1(!hide1);
  };

  useEffect(() => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
  }, []);

  let c = 0;
  if (userdata && c === 0) {
    setTimeout(() => setLoading(false), 2000);
    const bottomElement1 = document.getElementById("bottom1");
    if (bottomElement1) {
      bottomElement1.scrollIntoView({ behavior: "smooth" });
    }
  }
  
  if(Redirect) {
    navigate('/profile');
  }
  if(localStorage.getItem('completeUser')) {
    navigate('/home');
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Navbar overlay for Hero */}
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center text-center">
        {/* Real Campus Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/hero_campus_1788374855248.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/60 to-slate-50"></div>
        
        <div className="relative z-10 max-w-4xl px-6 pt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            Connect. Collaborate. <br/>
            <span className="text-primary-300">Grow Together.</span>
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto font-light drop-shadow">
            A platform for students and alumni to share, connect, and grow as a community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById("register-section");
                if(element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-1 w-full sm:w-auto"
            >
              Get Started
            </button>
            <Link 
              to="/signin"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-medium transition-all w-full sm:w-auto hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-1">5,000+</p>
              <p className="text-sm font-medium text-slate-500">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-1">1,200+</p>
              <p className="text-sm font-medium text-slate-500">Alumni Mentors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-1">300+</p>
              <p className="text-sm font-medium text-slate-500">Projects Shared</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600 mb-1">10k+</p>
              <p className="text-sm font-medium text-slate-500">Connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-500">Join a thriving ecosystem designed to bridge the gap between academic learning and real-world opportunities.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="/src/assets/feature_1_1788374926745.jpg" alt="Networking" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">1</div>
                  <span className="text-white font-medium text-lg">Networking</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 leading-relaxed">Connect with peers across departments, join study groups, and collaborate on innovative projects in real-time.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="/src/assets/feature_2_1788374938959.jpg" alt="Mentorship" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">2</div>
                  <span className="text-white font-medium text-lg">Mentorship</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 leading-relaxed">Find guidance from experienced alumni who have walked your path. Get resume reviews, interview tips, and career advice.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src="/src/assets/feature_3_1788374955350.jpg" alt="Opportunities" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">3</div>
                  <span className="text-white font-medium text-lg">Opportunities</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 leading-relaxed">Discover internships, job postings, and exclusive university events tailored to your graduation year and department.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register-section" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-50/50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-50/50 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Create Your Profile</h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Use your official college email address to instantly verify your student or alumni status and gain full access to the community.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">Enter Email</h4>
                  <p className="text-slate-500 text-sm">We automatically detect your graduation batch and department.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">Verify OTP</h4>
                  <p className="text-slate-500 text-sm">Securely verify your identity with a one-time password.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative">
              {hide1 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Join the Community</h3>
                  <p className="text-slate-500 mb-8">Enter your college email address to get started.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Official Email Address</label>
                      <input 
                        type="text" 
                        ref={emailref} 
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 ${email1 ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-primary-500 focus:ring-primary-500'} focus:ring-2 focus:outline-none transition-all`}
                        placeholder="eg.mithunj23eee@srishakthi.ac.in" 
                      />
                      {email1 && <p className="mt-2 text-sm text-red-500">Please enter a valid college email format.</p>}
                    </div>
                    
                    <button 
                      onClick={handleCheckemail}
                      disabled={Loading}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20 disabled:opacity-70 flex justify-center items-center h-12 hover:-translate-y-0.5"
                    >
                      {Loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : "Continue with Email"}
                    </button>
                  </div>
                  
                  {userdata && !Loading && (
                    <div id="bottom1" className="mt-8 p-5 bg-primary-50 border border-primary-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                      <h4 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs">✓</span>
                        Verify Details
                      </h4>
                      <div className="space-y-2 text-sm text-primary-800 mb-5">
                        <p><span className="opacity-70 font-medium">Name:</span> {userdata.Name}</p>
                        <p><span className="opacity-70 font-medium">Department:</span> {userdata.Department}</p>
                        <p><span className="opacity-70 font-medium">Email:</span> {userdata.Email}</p>
                        <p><span className="opacity-70 font-medium">Batch:</span> {`20${userdata.Year} - 20${parseInt(userdata.Year) + 4}`}</p>
                      </div>
                      <button 
                        onClick={handleConfirm}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-primary-600/20 hover:-translate-y-0.5 text-sm"
                      >
                        Confirm & Send OTP
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                      Sign in here
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <button 
                    onClick={() => setHide1(true)} 
                    className="mb-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to email
                  </button>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h3>
                  <p className="text-slate-500 mb-6 text-sm">
                    We've sent a 4-digit verification code to <br/>
                    <span className="font-medium text-slate-900">{userdata?.Email}</span>
                  </p>
                  
                  {!emailSent && (
                    <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm flex gap-3 items-start">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="font-medium">Email delivery failed</p>
                        <p className="opacity-80">Please use the OTP printed in your backend server console to continue.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center my-8">
                    <Otpbox length={4} onChangeOTP={handleChangeOTP} Correct={correct} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
        <p>© 2026 Alumnis Hub. Designed for the community.</p>
      </footer>
    </div>
  );
};

export default RootPage;
