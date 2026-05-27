"use client";

import { useEffect, useState } from "react";

import Swal from "sweetalert2";

import AdminLayout from "@/components/admin/AdminLayout";

import api from "@/services/api";

export default function SettingsPage() {

  const [userName, setUserName] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================
  // LOAD USER
  // ==========================
  useEffect(() => {

    const storedUserName =
      localStorage.getItem("user_name");

    if (storedUserName) {

      setUserName(
        storedUserName
      );
    }

  }, []);

  // ==========================
  // CHANGE PASSWORD
  // ==========================
  async function handleChangePassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    // Password Match
    if (
      newPassword !== confirmPassword
    ) {

      Swal.fire({
        icon: "error",
        title: "Password not match",
      });

      return;
    }

    setLoading(true);

    try {

      await api.put(
        "/auth/change-password",
        {
          current_password:
            currentPassword,

          new_password:
            newPassword,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password Changed",
      });

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

    } catch (err: any) {

      Swal.fire({
        icon: "error",
        title:
          err.response?.data?.detail ||
          "Failed",
      });

    } finally {

      setLoading(false);
    }
  }

  return (

    <AdminLayout>

      <div className="max-w-3xl">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8">
          Settings
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Profile Information
          </h2>

          <div className="space-y-4">

            <div>

              <label className="block font-semibold mb-2">
                User Name
              </label>

              <input
                type="text"
                value={userName}
                disabled
                className="w-full border p-4 rounded-lg bg-gray-100"
              />

            </div>

          </div>

        </div>

        {/* Password Card */}
        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold mb-6">
            Change Password
          </h2>

          <form
            onSubmit={handleChangePassword}
            className="space-y-5"
          >

            {/* Current Password */}
            <div>

              <label className="block font-semibold mb-2">
                Current Password
              </label>

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-lg"
                required
              />

            </div>

            {/* New Password */}
            <div>

              <label className="block font-semibold mb-2">
                New Password
              </label>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-lg"
                required
              />

            </div>

            {/* Confirm Password */}
            <div>

              <label className="block font-semibold mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full border p-4 rounded-lg"
                required
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >

              {loading
                ? "Updating..."
                : "Change Password"}

            </button>

          </form>

        </div>

      </div>

    </AdminLayout>
  );
}