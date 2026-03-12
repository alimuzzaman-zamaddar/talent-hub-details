"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../Assets/TalentHub pbA.svg";
import { useGetUserData } from "@/Hooks/api/auth_api";
import useLocalStorage from "@/Hooks/useLocalStorage";

export default function HomeHeader() {
  const [token] = useLocalStorage("token", null);
  const { data } = useGetUserData(token);
  const isLoggedIn = !!token && !!data;

  return (
    <header className="w-full bg-white mt-4">
      <div className=" flex flex-col xl:flex-row items-center justify-between px-4 2xl:px-0 py-4 gap-6 ">
        <div className=" w-full 2xl:w-[37%]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 l">
            <Image
              src={logo}
              alt="TalentHub"
              width={170}
              height={40}
              className="h-auto w-auto"
              priority
            />
          </Link>
        </div>

        {/* Buttons */}
        <nav className="flex flex-wrap xl:flex-row w-full 2xl:w-[63%] items-center gap-4">
          <Link
            href="https://training.aeroselect.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-[#0E2B8B] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90 cursor-pointer text-nowrap"
          >
            Training opportunities
          </Link>

          <Link
            href="https://aeroselect.io/post-a-job/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-[#0E2B8B] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
          >
            Post a Job
          </Link>

          {!isLoggedIn && (
            <Link
              href="/auth/register"
              className="flex-1 rounded-lg bg-[#0E2B8B] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
            >
              Register for free
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex-1 rounded-lg bg-[#0E2B8B] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex-1 rounded-lg bg-[#0E2B8B] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
