import React from "react";
import AuthenticatedRoute from "@/helpers/authenticatedRoute";
import Cadastros from "@/components/Cadastros";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const home = () => {
  return (
    <div
      className="flex flex-col h-screen justify-between items-center
        bg-bgColorPrincipal"
    >
      <Header />
      <Cadastros />
      <Footer />
    </div>
  );
};

export default AuthenticatedRoute(home);
