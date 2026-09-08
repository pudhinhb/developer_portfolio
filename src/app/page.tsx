"use client";

import React, { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import CreativeSection from "@/components/CreativeSection";
import BigRobotSection from "@/components/BigRobotSection";
import EditorialSection from "@/components/EditorialSection";
import SmallRobotSection from "@/components/SmallRobotSection";
import Footer from "@/components/Footer";
import SelectedWorks, { SelectedWorksHandle } from "@/components/SelectedWorks";

export default function Home() {
  const selectedWorksRef = useRef<SelectedWorksHandle>(null);

  const handleOpenWorks = () => {
    selectedWorksRef.current?.enter();
  };

  return (
    <>
      <main>
        <HeroSection onOpenWorks={handleOpenWorks} />
        <CreativeSection onOpenWorks={handleOpenWorks} />
        <BigRobotSection />
        <EditorialSection />
        <SmallRobotSection />
      </main>

      <Footer onOpenWorks={handleOpenWorks} />

      {/* Hidden 3D Chapter: Selected Works */}
      <SelectedWorks ref={selectedWorksRef} />
    </>
  );
}
