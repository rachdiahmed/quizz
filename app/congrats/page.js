"use client";
import aiAcademyLogo from "../../public/ai_academy.png";
import partners from "../../public/partners.png";
import Image from "next/image";

import background from "../../public/background.png";
import { useRouter } from "next/navigation";

export default function Congrats() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex-col flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="bg-white p-8 rounded shadow-lg max-w-2xl w-full">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={aiAcademyLogo}
            alt="AI Academy Logo"
            maxWidth={500}
            maxHeight={120}
          />
          <h2
            className="text-3xl font-bold mt-6 text-center"
            style={{ fontFamily: "Poppins" }}
          >
            AI Developer Training Quiz
          </h2>
        </div>

        <div className="flex justify-center">
          <h2>Thank you for your participation !</h2>
        </div>
      </div>
    
    </div>
  );
}
