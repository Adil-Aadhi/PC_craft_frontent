import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PublicLayout = () => {

    const { pathname } = useLocation();

    const lightPages = ["/register", "/about"];

    const variant = lightPages.includes(pathname) ? "light" : "dark";
  return (
    <>
      <Navbar variant={variant} />
      <Outlet />
    </>
  );
};

export default PublicLayout;
