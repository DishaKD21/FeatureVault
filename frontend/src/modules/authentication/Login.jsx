"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Google from "../../../public/google.svg";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../authentication/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };
 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    toast.success("Google login successful!");
    console.log("Google User:", result.user);
  } catch (error) {
    toast.error(error.message);
  }
};
  const handleResetPassword = async () => {
  if (!formData.email) {
    toast.warning("Enter email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, formData.email);
    toast.success("Password reset email sent! Check spam folder too.");
  } catch (error) {
    toast.error(error.message);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error("Please fix form errors");
  } else {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success("Login successful!");
      console.log("Logged in:", userCredential.user);
    } catch (error) {
      toast.error(error.message);
    }
  }
};

  return (
    <div className="flex justify-center items-center text-center w-screen h-screen border-2 border-amber-950">
      <div className=" border-blue-300 p-3 border-2">
        <h1 className="text-2xl pb-3">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col item-center">
          <label htmlFor="email" className="flex flex-left justify-between">
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="border-2 border-black-950"
          />
          <p className="text-red-700">{errors.email}</p>
          <div className="flex flex-row justify-between gap-3">
            <label>Password</label>
            <Link href="">
              <span
                onClick={handleResetPassword}
                className="text-blue-400 underline cursor-pointer">
                Forgot Password?
              </span>
            </Link>
          </div>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="border-2 border-black-950"
          />
          <p className="text-red-700">{errors.password}</p>
          <button
            type="submit"
            className="bg-black text-white mt-4 p-2 w-full cursor-pointer"
          >
            Sign In
          </button>
          <div className="text-gray-400 align-middle flex flex-row m-4">
            <hr className="border border-b-gray-400 w-50 m-3"></hr>
            <span>or continue with</span>
            <hr className="border border-b-gray-400 w-50 m-3"></hr>
          </div>
          <div
            onClick={handleGoogleLogin}
            className="bg-black text-white mt-4 p-2 w-full cursor-pointer flex flex-row justify-center gap-3"
          >
            <Image src={Google} height="20" width="20"></Image>
            Google
          </div>
          <div className="flex flex-row justify-center">
            <p>Don't have an Account?</p>
            <Link href="/register">
              <span className="text-blue-400 underline">Sign up</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
