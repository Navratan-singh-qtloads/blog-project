"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import Cookies from "js-cookie";

import api from "@/services/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      // JWT Token
      const token =
        response.data.access_token;

      // Save LocalStorage
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user_name",
        response.data.user.name
      );

      // Save Cookie
      Cookies.set(
        "token",
        token,
        {
          expires: 1,
        }
      );

      // Success Swal
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome Admin",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect
      router.push(
        "/admin/dashboard"
      );

    } catch (err: any) {

      let errorMessage =
        "Login Failed";

      if (
        err.response?.data?.detail
      ) {

        errorMessage =
          err.response.data.detail;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

      </form>

    </div>
  );
}