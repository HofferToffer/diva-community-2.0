import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CommunitySection from "@/components/CommunitySection";
import DivyNosiaDivuSection from "@/components/DivyNosiaDivuSection";
import BlogSection from "@/components/BlogSection";
import ShopSection from "@/components/ShopSection";

import RecreteSection from "@/components/RecreteSection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [location]);
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CommunitySection />
      <DivyNosiaDivuSection />
      <BlogSection />
      <ShopSection />

      <RecreteSection />
      <Footer />
    </div>
  );
};

export default Index;
