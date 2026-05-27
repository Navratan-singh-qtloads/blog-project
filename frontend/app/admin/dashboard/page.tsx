"use client";

import { useEffect, useState } from "react";

import {
  FileText,
  Folder,
  Tags,
  Users,
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";

import api from "@/services/api";

import {
  errorAlert,
} from "@/components/common/Swal";

export default function DashboardPage() {

  // ================= STATES =================
  const [totalPosts, setTotalPosts] =
    useState(0);

  const [
    totalCategories,
    setTotalCategories,
  ] = useState(0);

  const [totalTags, setTotalTags] =
    useState(0);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // ================= LOAD DASHBOARD DATA =================
  useEffect(() => {

    fetchDashboardData();

  }, []);

  async function fetchDashboardData() {

    try {

      setLoading(true);

      // ================= API CALLS =================
      const [
        postsRes,
        categoriesRes,
        tagsRes,
        usersRes,
      ] = await Promise.all([

        api.get("/posts"),

        api.get("/categories"),

        api.get("/tags"),

        api.get("/users"),

      ]);

      // ================= TOTAL POSTS =================
      setTotalPosts(
        postsRes.data.length || 0
      );

      // ================= TOTAL CATEGORIES =================
      setTotalCategories(
        categoriesRes.data.length || 0
      );

      // ================= TOTAL TAGS =================
      setTotalTags(
        tagsRes.data.length || 0
      );

      // ================= TOTAL USERS =================
      setTotalUsers(
        usersRes.data.length || 0
      );

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load dashboard data"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <AdminLayout>

      {/* PAGE TITLE */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to Blog CMS Admin Panel
        </p>

      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL POSTS */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-600">
                Total Posts
              </h2>

              <p className="text-4xl mt-4 font-bold text-blue-600">

                {loading
                  ? "..."
                  : totalPosts}

              </p>

            </div>

            <div className="bg-blue-100 p-4 rounded-full">

              <FileText
                size={32}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* TOTAL CATEGORIES */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-600">
                Categories
              </h2>

              <p className="text-4xl mt-4 font-bold text-green-600">

                {loading
                  ? "..."
                  : totalCategories}

              </p>

            </div>

            <div className="bg-green-100 p-4 rounded-full">

              <Folder
                size={32}
                className="text-green-600"
              />

            </div>

          </div>

        </div>

        {/* TOTAL TAGS */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-600">
                Tags
              </h2>

              <p className="text-4xl mt-4 font-bold text-yellow-600">

                {loading
                  ? "..."
                  : totalTags}

              </p>

            </div>

            <div className="bg-yellow-100 p-4 rounded-full">

              <Tags
                size={32}
                className="text-yellow-600"
              />

            </div>

          </div>

        </div>

        {/* TOTAL USERS */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-600">
                Users
              </h2>

              <p className="text-4xl mt-4 font-bold text-red-600">

                {loading
                  ? "..."
                  : totalUsers}

              </p>

            </div>

            <div className="bg-red-100 p-4 rounded-full">

              <Users
                size={32}
                className="text-red-600"
              />

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}