import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles = ["ADMIN"] }) => {
  const token = sessionStorage.getItem("token");
  const currentUser = useSelector((state) => state.user.currentUser);
  if (!token) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser?.role))
    return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PrivateRoute;
