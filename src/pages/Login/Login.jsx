import React, { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const Login = () => {
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.table({ email, password });
    signin(email, password).then((result) => {
      const user = result.user;
      console.log(user, "user arrived");
      navigate("/");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login Success",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6 text-justify">
              If You Are New Here Then Login First With Your Email And Password.
              Or Sign In With Your Google Account Please.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleLogin} className="card-body">
              <fieldset className="fieldset">
                <label className="fieldset-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="Email"
                />
                <label className="fieldset-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <div>
                  <Link
                    to={"/register"}
                    className="link link-hover text-blue-700 font-semibold">
                    Create An Account First
                  </Link>
                </div>
                <button type="submit" className="btn btn-neutral mt-4">
                  Login
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
