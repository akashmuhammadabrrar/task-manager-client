import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name.value;
    console.table({ email, password, name });
    createUser(email, password).then((result) => {
      const loggedUser = result.user;
      console.log(loggedUser);
      updateUserProfile(loggedUser, name)
        .then(() => {
          console.log("user prof info updated");
        })
        .catch((err) => {
          console.log(err);
        });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 1500,
      });
      form.reset();
      navigate("/");
    });
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Registration now!</h1>
            <p className="py-6 text-justify">
              If You Are New Here Then Login First With Your Email And Password.
              Or Sign In With Your Google Account Please.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleSubmit} className="card-body">
              <fieldset className="fieldset">
                <label className="fieldset-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="Email"
                />
                <label className="fieldset-label">Name</label>
                <input
                  name="name"
                  type="text"
                  className="input"
                  placeholder="Your Name"
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
                    to={"/login"}
                    className="link link-hover text-blue-700 font-semibold">
                    Login If You Have Account!
                  </Link>
                </div>
                <button type="submit" className="btn btn-neutral mt-4">
                  Sign Up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
