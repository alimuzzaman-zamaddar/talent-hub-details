"use client";

import {
  BagSvg,
  DhalSvg,
  PeopleSvg,
  PigSvg,
} from "@/Components/Svg/SvgContainer";

type Benefit = {
  id: number;
  title: string;
  file_name?: string;
  file_path?: string;
};

type Company = {
  mission?: string;
  benefits?: Benefit[];
};

const MissionBenefits = ({ company }: { company: Company }) => {
  const iconMap: Record<string, React.ReactNode> = {
    shield: <DhalSvg />,
    plane: <PigSvg />,
    user: <PeopleSvg />,
    briefcase: <BagSvg />,
  };

  return (
    <section className="mx-auto my-12 max-w-272.75 px-4 sm:px-6 lg:px-0 text-white">
      {/* ================= MISSION ================= */}
      <div>
        <h2 className="text-base sm:text-xl font-semibold text-black">
          Our Mission
        </h2>

        <p className="mt-3  sm:text-base leading-relaxed text-gray-400">
          {company?.mission}
        </p>
      </div>

      {/* ================= BENEFITS ================= */}
      <div className="mt-10">
        <h2 className="text-base sm:text-xl font-semibold text-black">
          Our Benefits
        </h2>

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
            xl:w-[84%]
            mx-auto
          "
        >
          {company?.benefits?.map((benefit) => (
            <div
              key={benefit.id}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-[#DFE1E7]/40
                bg-transparent
                px-6
                py-4
                text-center
              "
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                {/* if API icon exists use it, otherwise fallback svg */}
                {benefit.file_path ? (
                  <img
                    src={benefit.file_path}
                    alt={benefit.title}
                    className="h-6 w-6"
                  />
                ) : (
                  iconMap["shield"]
                )}
              </div>

              <p className=" text-gray-500">
                {benefit.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionBenefits;