import Image from "next/image";

//INTERNAL IMPORTS
import {
  Home,
  VideoHero,
  PropertyPortfolio,
  Footer,
  Header,
} from "@/components";

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Home />
      <VideoHero />
      <PropertyPortfolio />
      <Footer />
    </div>
  );
}
