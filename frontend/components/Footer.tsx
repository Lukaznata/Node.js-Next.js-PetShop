import React from "react";

const Footer = () => {
  return (
    <div
      style={{ backgroundColor: "#40474D" }}
      className="w-full h-20 z-10 text-white"
    >
      <div className="text-xs w-full justify-between flex flex-wrap gap-x-20 gap-y-4 p-4">
        <ul className="flex gap-2  ">
          <li className="">Contatos:</li>
          <li className="font-extralight ">(41) 9 9999-9999</li>
        </ul>

        <ul className="flex gap-2 ">
          <li className="">Sobre a empresa</li>
        </ul>

        <ul className="flex gap-2 ">
          <li className="font-extralight">&copy; Bouticão PetShop</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
