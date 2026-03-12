"use client";

import { useState } from "react";
import Container from "@/Components/Common/Container";
import CompanyProfileCard from "@/Components/PageComponents/mainPages/CompanyProfileCard";
import MediaSection from "@/Components/PageComponents/mainPages/MediaSection";
import MissionBenefits from "@/Components/PageComponents/mainPages/MissionBenefits";
import OpenPositions from "@/Components/PageComponents/mainPages/OpenPositions";
import { useCareerPage } from "@/Hooks/api/homepage_api";

export default function Page() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  const { data, isLoading } = useCareerPage(null, category, location, sort);

  const careerData = data?.data;

  if (isLoading) return null;

  return (
    <main>
      <Container>
        <CompanyProfileCard company={careerData?.company} />

        <OpenPositions
      
          jobs={careerData?.jobs?.data}
          filters={careerData?.filters_data}
        />

        <MissionBenefits company={careerData?.company} />

        <MediaSection media={careerData?.company?.media} />
      </Container>
    </main>
  );
}
