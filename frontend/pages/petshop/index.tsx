import AuthenticatedRoute from "@/helpers/authenticatedRoute";

const index = () => {
  return (
    <div
      className="flex flex-col h-screen justify-between items-center
        bg-bgColorPrincipal "
      style={{ color: "#3F3F3F" }}
    >
      <h1>Carregando...</h1>
    </div>
  );
};

export default AuthenticatedRoute(index);
