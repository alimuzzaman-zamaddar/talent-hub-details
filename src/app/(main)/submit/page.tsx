"use client";

import { AnySvg, CheckSvg } from "@/Components/Svg/SvgContainer";
import Image from "next/image";
export default function ApplicationSubmitted() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative max-w-245 mx-auto w-full mt-6">
        <div className="relative h-45 sm:h-55 w-full overflow-hidden rounded-b-xl">
          <Image
            src="https://i.ibb.co.com/j9cqPf8Y/joyful-stewardesses-standing-near-aircraft-at-airp-2025-03-26-14-42-46-utc-1.png" // replace with your image
            alt="Cabin Crew"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Airline Logo */}
        <div className="absolute left-20 top-32.5 sm:top-40 -translate-x-1/2">
          <div className="h-24 w-24 rounded-full bg-[#FF9A4D] flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-white text-sm font-semibold text-center leading-tight">
              CX
              <br />
              AIRLINES
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center px-4 pt-20 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Cabin Crew Member (m/f/x)
        </h1>

        {/* Check Icon */}
        <div className="mt-10 flex items-center justify-center">
          <AnySvg />
        </div>

        <h2 className="mt-8 text-lg font-semibold">
          Congratulations!
          <br />
          Your application is submitted!
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Application ID:{" "}
          <span className="font-medium text-gray-700">GG2VMC</span>
        </p>

        <p className="mt-6 max-w-md text-sm text-gray-500 leading-relaxed">
          You can track every update anytime in My Applications.
          <br />
          The Employer will review your profile and keep you informed about the
          next steps.
        </p>
        <div className="mt-12 flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:justify-between">
          <button className="w-full sm:w-40 rounded-lg bg-[#0E2B8B] px-6 py-3 text-sm font-medium text-white">
            Close
          </button>

          <button className="w-full sm:w-40 rounded-lg bg-[#0E2B8B] px-6 py-3 text-sm font-medium text-white">
            My Applications
          </button>
        </div>
      </div>
    </div>
  );
}
