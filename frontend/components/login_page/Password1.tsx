import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Password1 = () => {
  const router = useRouter();
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        // `http://localhost:5000/petshop/login`,
        `http://134.209.78.250:5000/petshop/login`,
        {
          senha,
        }
      );
      localStorage.setItem("token", res.data.token);

      router.push("/petshop/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || `Erro ao conectar ao servidor`
        );
      } else {
        setError("Erro ao conectar ao servidor");
      }

      setTimeout(() => {
        setError(null);
      }, 2500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <p style={{ color: "#545454" }}>Entre com sua senha</p>
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 p-4 rounded-xl justify-center items-center"
        style={{ backgroundColor: "#F0F0F0" }}
      >
        <p className="font-medium" style={{ color: "#178ED8" }}>
          Senha:
        </p>
        <input
          className={`
            rounded-md shadow-md py-2 px-1 
            w-2/3
            border-gray-300 
            focus:ring-1 focus:ring-blue-500
            focus:outline-none
            `}
          type={showPassword ? "text" : "password"}
          name="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          className={`cursor-pointer active:bg-[#93d5fee3] transform active:scale-75 transition duration-200 ease-in-out ${
            senha.length > 0 && !isLoading && error === null
              ? "opacity-100"
              : "opacity-50 cursor-not-allowed active:bg-[#00000014]"
          } p-2 rounded-full
          `}
        >
          {showPassword && senha.length > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 ${
                senha.length > 0 ? "text-[#178ED8]" : "text-black opacity-50"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </span>

        <button
          type="submit"
          className="font-medium"
          disabled={senha.length === 0 || error !== null}
          style={{
            opacity: senha.length > 0 && !isLoading && error === null ? 1 : 0.5,
            cursor:
              senha.length > 0 && !isLoading && error === null
                ? "pointer"
                : "not-allowed",
          }}
        >
          Entrar
        </button>
      </form>

      {isLoading && <p style={{ color: "#178ED8" }}>Carregando...</p>}

      {error && (
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Password1;
