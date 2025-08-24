import Image from "next/image";

//INTERNAL IMPORTS
import { Home, VideoHero, PropertyPortfolio, Footer } from "@/components";

export default function HomePage() {
  return (
    <>
      <Home />
      <VideoHero />
      <PropertyPortfolio />
      <Footer />
    </>
  );
}
