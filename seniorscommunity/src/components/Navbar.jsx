import { ChevronDown, UserCircleIcon, Home, MessageSquare, Menu, LogOut, Settings, Layout } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gitdata } from '../store';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [downbar, setDownbar] = useState(false);
  const [user, setUser] = useState(false);
  const [image, setImage] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('completeUser')) {
      setUser(true);
    }
    if (Gitdata()) {
      setImage(Gitdata().avatar_url);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDownbar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('completeUser');
    localStorage.removeItem('data');
    navigate('/');
  };

  let UserData = localStorage.getItem('data');

  const navLinks = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Feed', path: '/blogs', icon: Layout },
    { name: 'Messages', path: '/chats', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-8">
            <Link to={UserData ? "/home" : "/"} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold group-hover:bg-primary-700 transition-colors">
                A
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Alumnis Hub</span>
            </Link>

            {UserData && (
              <div className="hidden md:flex space-x-8 h-16 ml-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-2 h-full text-sm font-medium transition-colors border-b-2 px-1 ${
                        isActive 
                        ? 'border-primary-600 text-primary-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {UserData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDownbar(!downbar)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {user ? (
                    <img
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                      src={image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                      alt="User Avatar"
                    />
                  ) : (
                    <UserCircleIcon size={36} className="text-slate-400" />
                  )}
                  <ChevronDown size={16} className={`text-slate-500 transition-transform ${downbar ? 'rotate-180' : ''}`} />
                </button>

                {downbar && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 origin-top-right animate-in fade-in slide-in-from-top-2">
                    <Link 
                      to={user ? "/userprofile" : "/profile"} 
                      onClick={() => setDownbar(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <UserCircleIcon size={16} />
                      Profile
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <Settings size={16} />
                      Settings
                    </div>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
