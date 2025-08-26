import { Poppins } from "next/font/google";
import "./globals.css";
import { RealEstateProvider } from "@/context/RealEstateContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Real Estate DApp",
  description: "Plataforma descentralizada de bienes raíces",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <div className="w-full overflow-x-hidden">
          <RealEstateProvider>{children}</RealEstateProvider>
        </div>
      </body>
    </html>
  );
}
