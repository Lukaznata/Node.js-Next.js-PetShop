import Link from "next/link";

const Header = () => {
  return (
    <ul
      className={`w-screen flex justify-between items-center
        p-3 px-5
        `}
      style={{ backgroundColor: "#00B2FF", color: "#fff" }}
    >
      <li className="font-light">Seja bem vindo!</li>
      <li className="font-normal">
        <Link href="/petshop/login">Sair</Link>
      </li>
    </ul>
  );
};

export default Header;
