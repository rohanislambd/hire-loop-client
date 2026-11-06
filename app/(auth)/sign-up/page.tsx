"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = {
      name,
      email,
      password,
    }
    // console.log("Sign Up Form Data:", formData)
    const {data ,error} =  await authClient.signUp.email({
        ...formData,
        callbackURL: "/",
    })
    // console.log("signUp response", data, error);
  }

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up clicked")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#030108] px-4 py-12 text-white">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.18),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:32px_32px] opacity-20"
        aria-hidden="true"
      />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="group mb-2 inline-block text-2xl font-bold tracking-tight select-none"
          >
            <span className="text-blue-500">hire</span>
            <span className="text-orange-500">loop</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Join thousands of professionals finding top tech roles
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0b0c14]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium text-zinc-300"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl border-zinc-800 bg-zinc-950/60 pr-3 pl-9 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border-zinc-800 bg-zinc-950/60 pr-3 pl-9 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-zinc-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-xl border-zinc-800 bg-zinc-950/60 pr-10 pl-9 text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-indigo-600 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1 bg-zinc-800" />
            <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
              or continue with google
            </span>
            <Separator className="flex-1 bg-zinc-800" />
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-zinc-800 bg-zinc-900/60 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/80 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
           {/* Footer Link to Sign In */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
        </div>

       
      </div>
    </div>
  )
}
