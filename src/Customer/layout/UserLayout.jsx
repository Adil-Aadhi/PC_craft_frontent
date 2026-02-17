import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const UserLayout = () => {
  const { pathname } = useLocation();

  const lightPages = ["/user/profile"];

  const variant = lightPages.includes(pathname) ? "light" : "dark";

  return (
    <>
      <Navbar variant={variant} />
      <Outlet />
    </>
  );
};

export default UserLayout;
