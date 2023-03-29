import Button from "components/UI/Button";
import { useRouter } from "next/router";
import React from "react";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="hero remain-height bg-cover bg-center flex items-center justify-start px-40">
      <div className="basis-1/2">
        <h1 className="text-white text-6xl mb-6">Real State Management</h1>
        <p className="leading-6	mb-4">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters
        </p>
        <Button onClick={() => router.push("/contact")} className="">
          Content Us {router.locale === "ar" ? "←" : "→"}
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          className="ml-4 rtl:mr-4"
        >
          Dashboard {router.locale === "ar" ? "←" : "→"}
        </Button>
      </div>
    </div>
  );
};

export default Hero;
