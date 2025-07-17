import { Navigate } from 'react-router-dom';

const RequireAuthAdm = ({ children }) => {
  const token = localStorage.getItem("token");
  const esAdmin = localStorage.getItem("esAdmin");

  if (!token) return <Navigate to="/" replace />;
  if (esAdmin === "false")
    return <Navigate to="/inicio" replace />;

  return children;
};

export default RequireAuthAdm;
