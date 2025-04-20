import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AuthenticatedRoute = (WrappedRoute: React.ComponentType) => {
  const AuthWrapper = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [logged, setLogged] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuthentication = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setLogged(false);
          setTimeout(() => {
            router.push("/petshop/login");
          }, 3000);
          return;
        }
        try {
          const response = await axios.get(
            // `https://fullstack-petshop-production.up.railway.app/petshop/auth/verify`,
            `http://localhost:5000/petshop/auth/verify`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setError("Token inválido ou expirado. Faça login novamente.");
          localStorage.removeItem("token");
          setTimeout(() => {
            router.push("/petshop/login");
          }, 3000);
        }
      };
      checkAuthentication();
    }, [router]);

    if (error) {
      return (
        <div
          className="flex flex-col h-screen justify-between items-center
        bg-bgColorPrincipal"
        >
          <h1>{error}</h1>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div
          className="flex flex-col h-screen justify-center items-center
        bg-bgColorPrincipal"
        >
          {!logged ? (
            <p>Você precisa fazer o login para acessar esta página.</p>
          ) : (
            <h1 className="font-medium text-[#2da6f1]">Carregando...</h1>
          )}
        </div>
      );
    }

    return <WrappedRoute {...props} />;
  };

  return AuthWrapper;
};

export default AuthenticatedRoute;
