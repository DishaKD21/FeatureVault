"use client";
import Image from "next/image";
import React, { useState } from "react";
import Google from "../../../public/google.svg";
import Link from "next/link";

 const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
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
    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form Submitted:", formData);
      setErrors({});
    }
  };

  return (
    <div className="flex justify-center items-center text-center w-screen h-screen">
      <div className="border-blue-300 p-5 border-2 w-80">
        <h1 className="text-2xl pb-3">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-left justify-between">Name</label>
          <input
            name="name"
            type="text"
            className="border-2 border-amber-950 w-full"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
          <label className="flex flex-left justify-between">Email</label>
          <input
            name="email"
            type="email"
            className="border-2 border-amber-950 w-full"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm">{errors.email}</p>
          <label className="flex flex-left justify-between">Password</label>
          <input
            name="password"
            type="password"
            className="border-2 border-amber-950 w-full"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm">{errors.password}</p>
          <button
            type="submit"
            className="bg-black text-white mt-4 p-2 w-full">
            Sign Up
          </button>
          <div className="text-gray-400 align-middle flex flex-row m-2">
            <hr className="border border-b-gray-400 w-20 m-1"></hr>
            <span className="inline-block">or continue with</span>
            <hr className="border border-b-gray-400 w-20 m-1"></hr>
          </div>
          <div className="bg-black text-white mt-4 p-2 w-full cursor-pointer flex flex-row justify-center gap-3">
            <Image src={Google} height="20" width="20"></Image>
            Google
          </div>
          <div className="flex flex-row justify-center">
            <p>Already have an Account?</p>
            <Link href="/login">
              <span className="text-blue-400 underline">Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;