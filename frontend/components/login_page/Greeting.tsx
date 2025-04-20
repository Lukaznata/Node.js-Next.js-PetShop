import React from "react";
import Password1 from "./Password1";

const Greeting = () => {
  return (
    <div
      className={`
    bg-white flex flex-col justify-center items-center
    gap-2 p-5 mt-6
    rounded-md shadow-xl
    absolute top-10

    `}
      style={{ width: "94%" }}
    >
      <h1 className="text-xl font-medium">Seja bem vindo!</h1>
      <Password1 />
    </div>
  );
};

export default Greeting;
