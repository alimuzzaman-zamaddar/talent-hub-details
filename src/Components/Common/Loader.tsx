"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-screen py-10">
      <div className="relative flex items-center justify-center">
        
        {/* Outer pulse */}
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#17225F]/20 animate-ping"></span>

        {/* Spinner */}
        <div className="h-12 w-12 rounded-full border-4 border-[#17225F]/20 border-t-[#17225F] animate-spin"></div>

      </div>
    </div>
  );
}