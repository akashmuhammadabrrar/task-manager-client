import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Login from "../pages/Login/Login";

const Root = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <Outlet></Outlet>
    </div>
  );
};

export default Root;
