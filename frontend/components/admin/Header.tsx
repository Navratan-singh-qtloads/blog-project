"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

import Swal from "sweetalert2";

export default function Header() {

  const router = useRouter();

  const [userName, setUserName] =
    useState("Admin");

  useEffect(() => {

    const storedUserName =
      localStorage.getItem("user_name");

    if (storedUserName) {

      setUserName(
        storedUserName
      );
    }

  }, []);

  async function handleLogout() {

    const result =
      await Swal.fire({
        title: "Logout?",
        text: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

    if (!result.isConfirmed) {

      return;
    }

    // Remove Storage
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user_name"
    );

    // Remove Cookie
    Cookies.remove("token");

    // Redirect Login
    router.push(
      "/admin/login"
    );
  }

  return (

    <header className="bg-white shadow px-8 py-4 flex items-center justify-between">

      {/* Page Title */}
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      {/* User Section */}
      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold">
            {userName}
          </p>

          <p className="text-sm text-gray-500">
            Administrator
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
}