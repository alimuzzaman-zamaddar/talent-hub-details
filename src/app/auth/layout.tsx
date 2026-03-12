import Footer from "@/Shared/Footer";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import Logo from "../../Assets/TalentHub pbA.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      style={{
        backgroundImage: "url('https://i.ibb.co.com/7JxGLvMQ/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen flex flex-col justify-between"
    >
      <div className=" flex items-center justify-center bg-transparent">
        <div className="w-full">
          {/* <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full mx-auto mt-5 xl:mt-10"
          >
            <Image
              src="https://i.ibb.co.com/WWF6rc9w/Gemini-Generated-Image-fpbr9lfpbr9lfpbr-Photoroom.png"
              alt="Arohire Logo"
              width={400}
              height={200}
              priority
            />
          </Link> */}

          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full mx-auto"
          >
            <Image
              src={Logo}
              alt="TalentHub"
              width={400}
              height={200}
              priority
            />
          </Link>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Footer />
    </main>
  );
};

export default AuthLayout;
