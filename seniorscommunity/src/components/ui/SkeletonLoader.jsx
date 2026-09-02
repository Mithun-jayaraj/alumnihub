import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 w-full animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div className="flex-1 py-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/6"></div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="mt-6 flex gap-4">
          <div className="h-8 bg-slate-200 rounded w-20"></div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
        <div className="h-32 bg-slate-200 w-full"></div>
        <div className="px-6 pb-6 relative">
          <div className="w-24 h-24 rounded-full bg-slate-300 border-4 border-white absolute -top-12"></div>
          <div className="pt-16 space-y-3">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-slate-200 rounded w-full animate-pulse"></div>
  );
};

export default SkeletonLoader;
