"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Google from "../../../public/google.svg";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, provider } from "./firebase";
import { toast } from "react-toastify";
import { getPostAuthRedirect, syncFirebaseUser } from "@/components/auth/useAuth";
import ThemeLogo from "@/components/branding/ThemeLogo";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const router = useRouter();
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
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const completeLogin = async (user) => {
    await syncFirebaseUser(user);
    router.push(getPostAuthRedirect());
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      await completeLogin(result.user);
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
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success("Login successful!");
        await completeLogin(userCredential.user);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="fv-auth-shell">
      <div className="fv-auth-inner flex min-h-screen flex-col px-4 py-10 sm:px-6 sm:py-12">
        <header className="mx-auto mb-8 flex w-full max-w-md items-center justify-between sm:max-w-lg">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
          <ThemeToggle />
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center sm:max-w-lg">
          <div className="mb-8 flex flex-col items-center text-center">
            <ThemeLogo className="mb-6" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Use your email or Google to access your workspace.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-fv-panel backdrop-blur-sm sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-border/80"
                  placeholder="you@company.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs font-medium text-primary transition hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-border/80"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="h-10 w-full rounded-xl text-sm font-medium shadow-fv-soft">
                Sign in
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide text-muted-foreground">
                <span className="bg-card px-3">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-full gap-2 rounded-xl border-border/80 bg-background/50"
              onClick={handleGoogleLogin}
            >
              <Image src={Google} alt="" height={20} width={20} className="size-5" />
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary transition hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
