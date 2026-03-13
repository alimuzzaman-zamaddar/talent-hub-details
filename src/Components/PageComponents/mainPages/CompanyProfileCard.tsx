"use client";

import Image from "next/image";
import Link from "next/link";

type SocialLink = {
  id: number;
  platform: string;
  url: string;
};

type Company = {
  name: string;
  logo?: string | null;
  banner?: string | null;
  company_type?: string;
  address?: string;
  about?: string;
  employeesNumber?: {
    label: string;
  };
  social_links?: SocialLink[];
};
const url =  process.env.NEXT_PUBLIC_BASE_URL;
export default function CompanyProfileCard({ company }: { company: Company }) {
  const generatedShortName =
    company?.name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((w) => w[0])
      ?.join("")
      ?.toUpperCase() || "CX";

  return (
    <section className="mx-auto mt-6 max-w-272.75 px-4 sm:px-6 xl:px-0">
      <div>
        {/* ================= COVER IMAGE ================= */}
        <div className="relative h-48 sm:h-64 lg:h-70 w-full overflow-hidden rounded-2xl border-2 border-gray-400 bg-[#17225F]">
          <Image
            src={company?.banner ? `${url}/${company?.banner}` : "/default-banner.png"}
            alt={`${company?.name} Cover`}
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 1091px"
          />
        </div>

        {/* ================= LOGO + SOCIAL ================= */}
        <div className="relative px-4 sm:px-6 xl:px-0 pb-8">
          {/* Logo */}
          <div className="absolute -top-20 sm:-top-22 left-1/2 sm:left-12 -translate-x-1/2 sm:translate-x-0 h-32 w-32 sm:h-42 sm:w-42 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
            {company?.logo ? (
              <Image
                src={`${url}/${company?.logo}`}
                alt={company?.name}
                fill
                className="object-cover"
                quality={100}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-400">
                <span className="text-xl font-bold text-white">
                  {generatedShortName}
                </span>
              </div>
            )}
          </div>

          {/* Social Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 pt-24 sm:pt-8 pr-0 sm:pr-6">
            {company?.social_links?.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                className="min-w-35 sm:min-w-37.5 rounded-full bg-gray-300 px-6 py-2 text-center  font-medium text-white hover:bg-gray-400"
              >
                {item.platform}
              </Link>
            ))}
          </div>

          {/* ================= INFO BOXES ================= */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-20 xl:w-[70%] mx-auto">
            <div className="rounded-2xl border border-gray-100 px-6 py-2 text-center">
              <p className=" text-gray-400">Business</p>
              <p className="text-base font-normal">
                {company?.company_type || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 px-6 py-2 text-center">
              <p className=" text-gray-400">Homebase</p>
              <p className="text-base font-normal">
                {company?.address || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 px-6 py-2 text-center">
              <p className=" text-gray-400">Employees</p>
              <p className="text-base font-normal">
                {company?.employeesNumber?.label || "N/A"}
              </p>
            </div>
          </div>

          {/* ================= ABOUT ================= */}
          <div className="mt-10 space-y-5 px-2 sm:px-4 xl:px-0 pb-6">
            <h2 className="text-xl font-semibold">About {company?.name}</h2>

            <p className=" leading-relaxed text-gray-500">{company?.about}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
