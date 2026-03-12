import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-[1392px] mx-auto px-5 xl:px-0">{children}</div>;
};

export default Container;
