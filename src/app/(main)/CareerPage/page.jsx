import React from "react";
import CompanyProfileCard from "../../../Components/PageComponents/mainPages/CompanyProfileCard";
import OpenPositions from "../../../Components/PageComponents/mainPages/OpenPositions";
import MissionBenefits from "../../../Components/PageComponents/mainPages/MissionBenefits";
import MediaSection from "../../../Components/PageComponents/mainPages/MediaSection";
const page = () => {
  return (
    <div>
      <CompanyProfileCard />
      <OpenPositions />
      <MissionBenefits />
      <MediaSection />
    </div>
  );
};

export default page;
