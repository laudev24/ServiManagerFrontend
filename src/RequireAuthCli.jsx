import { Navigate } from 'react-router-dom';

const RequireAuthCli = ({ children }) => {
  const token = localStorage.getItem("token");
  const esAdmin = localStorage.getItem("esAdmin");

  if (!token) return <Navigate to="/" replace />;
  if (esAdmin === "true" )
    return <Navigate to="/inicioAdm" replace />;

  return children;
};

export default RequireAuthCli;
