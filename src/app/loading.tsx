import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-[#0E2B8B] animate-spin" />
    </div>
  );
};

export default loading;
