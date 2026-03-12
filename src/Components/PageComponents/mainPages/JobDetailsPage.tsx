"use client";

import {
  BagSvg,
  DhalSvg,
  PeopleSvg,
  PigSvg,
} from "@/Components/Svg/SvgContainer";
import Image from "next/image";
import Link from "next/link";

type Benefit = {
  id: number;
  title: string;
  file_path?: string;
};

type Company = {
  name: string;
  logo?: string | null;
  banner?: string | null;
  about?: string;
  mission?: string;
  benefits?: Benefit[];
  social_links?: {
    id: number;
    platform: string;
    url: string;
  }[];
};

type Job = {
  id: number;
  title: string;
  description: string;
  requirements: string;
  job_type: string;
  contract: string;
  function: string;
  created_at: string;
  company: Company;
};

const iconMap: Record<string, React.ReactNode> = {
  shield: <DhalSvg />,
  plane: <PigSvg />,
  user: <PeopleSvg />,
  briefcase: <BagSvg />,
};

export default function JobDetailsPage({ job }: { job: Job }) {
  const company = job?.company;

  const shortName =
    company?.name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((w) => w[0])
      ?.join("")
      ?.toUpperCase() || "CX";

  const requirements = job?.requirements?.split("\n") || [];

  return (
    <section className="mx-auto mt-6 max-w-272.75 px-4 sm:px-6 xl:px-0 text-white">
      {/* COVER */}
      <div className="relative h-40 sm:h-52 lg:h-65 w-full overflow-hidden rounded-2xl border border-[#DFE1E7]/30">
        <Image
          src={
            company?.banner ||
            "https://i.ibb.co.com/j9cqPf8Y/joyful-stewardesses-standing-near-aircraft.png"
          }
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative px-4 sm:px-6 xl:px-0 pb-10">
        {/* LOGO */}
        <div className="absolute -top-18 sm:-top-22 left-1/2 sm:left-12 -translate-x-1/2 sm:translate-x-0 h-32 w-32 sm:h-42 sm:w-42 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
          {company?.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-400">
              <span className="text-2xl font-bold text-white">{shortName}</span>
            </div>
          )}
        </div>

        {/* SOCIAL */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 pt-20 sm:pt-6 pr-0 sm:pr-6">
          {company?.social_links?.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              className="min-w-37.5 rounded-full bg-gray-400/70 px-6 py-2 text-center  font-medium text-white hover:bg-gray-400"
            >
              {item.platform}
            </Link>
          ))}
        </div>

        {/* JOB TITLE */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="mb-10 sm:mb-14">
            <Link
              href="/"
              className=" text-gray-400 hover:text-[#17225f]"
            >
              ← Jobs @ {company?.name}
            </Link>

            <h4 className="text-2xl sm:text-3xl text-black font-medium mt-5">
              {job?.title}
            </h4>
          </div>

          <button
            onClick={() => (window.location.href = `https://aerohire.io/application/${job?.id}`)}
            className="cursor-pointer rounded-lg border border-white/40 bg-[#17225f] px-6 py-2  font-medium text-white hover:opacity-90"
          >
            Apply Now
          </button>
        </div>

        {/* ABOUT COMPANY */}
        <div className="mt-5 space-y-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-black">
            About {company?.name}
          </h2>

          <p className=" leading-relaxed text-gray-400">
            {company?.about}
          </p>
        </div>

        {/* ABOUT ROLE */}
        <div className="mt-10 space-y-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-black">
            About the Role
          </h2>

          <div
            className=" leading-relaxed text-gray-400"
            dangerouslySetInnerHTML={{ __html: job?.description || "" }}
          />
        </div>

        {/* REQUIREMENTS */}
        <div className="mt-10 space-y-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-black">Requirements</h2>

          <div
            className=" leading-relaxed text-gray-400"
            dangerouslySetInnerHTML={{ __html: job?.requirements || "" }}
          />
        </div>

        {/* MISSION */}
        <div className="mt-10 space-y-4 max-w-3xl">
          <h2 className="text-xl font-semibold text-black">Our Mission</h2>

          <p className=" leading-relaxed text-gray-400">
            {company?.mission}
          </p>
        </div>

        {/* APPLY CENTER */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => (window.location.href = `https://aerohire.io/application/${job?.id}`)}
            className="cursor-pointer min-w-55 rounded-lg border border-white/40 bg-[#17225f] px-10 py-2  font-medium text-white hover:opacity-90"
          >
            Apply Now
          </button>
        </div>

        {/* BENEFITS */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-black">Our Benefits</h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:w-[84%] mx-auto gap-6">
            {company?.benefits?.map((benefit) => (
              <div
                key={benefit.id}
                className="flex flex-col items-center justify-center rounded-2xl border border-[#DFE1E7]/40 bg-transparent px-6 py-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <img
                    src={benefit.file_path}
                    className="w-6 h-6"
                    alt={benefit.title}
                  />
                </div>

                <p className=" text-gray-500">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
