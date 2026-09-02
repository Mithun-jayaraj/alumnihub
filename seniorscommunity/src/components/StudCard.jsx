import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';

const StudCard = (props) => {
  const navigate = useNavigate();
  const [gitData, setGitData] = useState(null);
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollow, setFollow] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading,setLoading]=useState(true);
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));

  const sendProps = () => {
    navigate('/profilecard/', {
      state: {
        data: {
          githubdata: gitData,
          userdata: data,
          acadamicdata: props.props,
          follow: isFollow,
        },
      },
    });
  };

  const fetchGitHubData = async (githubUsername) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error.message);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          '/api/v1/getData',
          { id: props.props.Email }
        );
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.post(
          '/api/v1/getData',
          { id: completeUser.data.id }
        );
        if (response.status === 200) {
          setFollowers(response.data.data.Followers);
          setFollowing(response.data.data.Following);
          if (response.data.data.Following.includes(props.props.Email)) {
            setFollow(true);
          }
        }
      } catch (error) {
        console.error('Error fetching current user data:', error.message);
      }
    };
    fetchUserData();
    fetchCurrentUser();
  }, [props.props.Email, completeUser.data.id]);
  
  useEffect(() => {
    if (data && data.Github) {
      fetchGitHubData(data.Github);
    }
  }, [data]);

  const handleFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('/api/v1/follow', {
        userId: completeUser.data.id,
        followerId: props.props.Email,
      });
      if (response.status === 200) {
        setFollow(true);
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
        followerId: props.props.Email,
      });
      if (response.status === 200) {
        setFollow(false);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
    {
      loading?(
        <div className="w-[300px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center p-6 space-y-4 animate-pulse">
          <div className='w-3/4 h-6 bg-slate-200 rounded-md'></div>
          <div className='w-1/2 h-4 bg-slate-200 rounded-md'></div>
          <div className="w-32 h-32 rounded-full bg-slate-200 mt-4"></div>
          <div className="w-full flex justify-between gap-3 mt-6">
             <div className="w-1/2 h-10 bg-slate-200 rounded-xl"></div>
             <div className="w-1/2 h-10 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ):(
        <div className="w-[300px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col p-6 m-2 relative overflow-hidden group">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
          
          <div className="w-full text-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 truncate" title={props.props.Name}>{props.props.Name}</h3>
            <p className="text-sm font-medium text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-full mt-2">
              {props.props.Year} • {props.props.Department}
            </p>
          </div>
          
          <div className="w-full flex justify-center items-center my-4 relative">
            <div className="absolute inset-0 bg-primary-50 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {gitData ? (
              <img
                src={gitData.avatar_url || profile}
                alt={`${data?.Github}'s Avatar`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md relative z-10 object-cover bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md relative z-10 bg-slate-50 flex items-center justify-center">
                <Loader2Icon className="text-primary-500 animate-spin w-8 h-8" />
              </div>
            )}
          </div>
          
          <div className="w-full flex gap-3 mt-4">
            {!isFollow ? (
              <button
                disabled={load}
                className={`flex-1 rounded-xl h-[42px] font-semibold text-sm transition-all shadow-sm ${
                  load 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
                onClick={handleFollow}
              >
                {load ? (
                  <div className='w-full flex justify-center'>
                    <Loader2Icon className="animate-spin w-5 h-5" /> 
                  </div>
                ) : '+ Follow'}
              </button>
            ) : (
              <button
                disabled={load}
                className={`flex-1 rounded-xl h-[42px] font-semibold text-sm transition-all shadow-sm ${
                  load 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={handleUnFollow}
              >
                {load ? (
                  <div className='w-full flex justify-center'>
                    <Loader2Icon className="animate-spin w-5 h-5" /> 
                  </div> 
                ) : 'Following'}
              </button>
            )}
            
            <button
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl h-[42px] transition-all shadow-sm shadow-primary-600/20"
              onClick={sendProps}
            >
              Profile
            </button>
          </div>
        </div>
      )
    }
   
    </>
  );
};

export default StudCard;
