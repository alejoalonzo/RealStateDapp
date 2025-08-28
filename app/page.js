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
      <div className="w-full absolute top-0 left-0 right-0 z-30">
        <Header />
      </div>
      <Home />
      <VideoHero />
      <PropertyPortfolio />
      <Footer />
    </div>
  );
}
