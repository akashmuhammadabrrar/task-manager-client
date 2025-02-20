import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState("");
  const location = useLocation();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        alert("Logout Successful");
      })
      .catch((error) => {
        console.log(error, "Logout Error");
      });
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  React.useEffect(() => {
    setActiveButton("");
  }, [location.pathname]);

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <a className="btn btn-ghost text-xl">Task+To_Do</a>

      <ul className="navbar-end flex navbar items-center gap-4">
        <li>
          <button
            className={`btn ${
              activeButton === "home"
                ? "bg-gray-800 text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => handleButtonClick("home")}>
            <Link to={"/"}>Home</Link>
          </button>
        </li>
        <li>
          <button
            className={`btn ${
              activeButton === "about"
                ? "bg-gray-800 text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => handleButtonClick("about")}>
            <Link to={"/about"}>About</Link>
          </button>
        </li>

        {user ? (
          <>
            <button onClick={handleLogOut} className="btn btn-error">
              Logout
            </button>
          </>
        ) : (
          <>
            <li>
              <button
                className={`btn ${
                  activeButton === "login"
                    ? "bg-gray-800 text-white"
                    : "bg-transparent text-black"
                }`}
                onClick={() => handleButtonClick("login")}>
                <Link to={"/login"}>Login</Link>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
