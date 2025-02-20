import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";

const Root = () => {
  const location = useLocation();
  const noNav =
    location.pathname.includes("login") ||
    location.pathname.includes("register");

  return (
    <div>
      {noNav || (
        <header>
          <Navbar></Navbar>
        </header>
      )}
      <Outlet></Outlet>
    </div>
  );
};

export default Root;
