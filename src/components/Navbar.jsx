import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logout Successful",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.log(error, "Logout Error");
      });
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <a className="btn btn-ghost text-xl">TaskNow</a>

      <ul className="navbar-end flex navbar items-center gap-4 ml-16">
        <li>
          <button className="btn bg-transparent text-black">
            <Link to={"/"}>Home</Link>
          </button>
        </li>
        <li>
          <button className="btn bg-transparent text-black">
            <Link to={"/tasks"}>Tasks</Link>
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
              <button className="btn bg-transparent text-black">
                <Link to={"/login"}>Login</Link>
              </button>
            </li>
          </>
        )}
        {user ? (
          <>
            <p className="text-xl font-semibold border p-1">
              {user?.displayName}
            </p>
          </>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
