import Footer from "@/components/Footer";
import Greeting from "@/components/login_page/Greeting";
import LoginHeader from "@/components/LoginHeader";
import Image from "next/image";

export default function PetShop() {
  return (
    <div
      className={`

        flex flex-col h-screen justify-between items-center
        bg-bgColorPrincipal

    `}
      style={{ color: "#3F3F3F" }}
    >
      <LoginHeader />
      <Greeting />
      <div className="flex flex-col justify-end items-center w-full z-1 ">
        {/* <div className="h-80 bg-slate-600 w-full"></div> */}
        <Image
          src="/images/Husky.png"
          alt="Bouticão PetShop"
          width="400"
          height="0"
          objectFit="cover"
          style={{ margin: "0", padding: "0" }}
        />

        <Footer />
      </div>
    </div>
  );
}
