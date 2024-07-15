import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center w-full h-full min-h-screen">
      <div className="flex gap-x-2">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 bg-[#9869b8] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 bg-[#6756cc] animate-pulse h-5 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default Loader;
