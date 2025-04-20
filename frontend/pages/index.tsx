import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/petshop/login");
  }, [router]);

  return (
    <div
      className="flex flex-col h-screen justify-between items-center
        bg-bgColorPrincipal "
      style={{ color: "#3F3F3F" }}
    >
      <h1>Carregando...</h1>
    </div>
  );
}
