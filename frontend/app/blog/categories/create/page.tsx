"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import api from "@/services/api";

import AdminLayout from "@/components/admin/AdminLayout";

import {
  successAlert,
  errorAlert,
  warningAlert,
} from "@/components/common/Swal";

export default function CreateCategoryPage() {

  const searchParams = useSearchParams();

  const router = useRouter();

  const id = searchParams.get("id");

  const isEdit = !!id;

  // ======================
  // STATE
  // ======================
  const [title, setTitle] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ======================
  // LOAD CATEGORY
  // ======================
  useEffect(() => {

    if (id) {
      fetchCategory();
    }

  }, [id]);

  async function fetchCategory() {

    try {

      const response =
        await api.get(
          `/categories/${id}`
        );

      setTitle(response.data.title);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load category data"
      );
    }
  }

  // ======================
  // CREATE / UPDATE
  // ======================
  async function submitCategory() {

    // VALIDATION
    if (!title.trim()) {

      warningAlert(
        "Validation Error",
        "Please enter category name"
      );

      return;
    }

    try {

      setLoading(true);

      // ================= UPDATE =================
      if (isEdit) {

        await api.put(
          `/categories/${id}`,
          {
            title,
          }
        );

        await successAlert(
          "Success",
          "Category updated successfully"
        );

      }

      // ================= CREATE =================
      else {

        await api.post(
          "/categories",
          {
            title,
          }
        );

        await successAlert(
          "Success",
          "Category created successfully"
        );
      }

      // REDIRECT
      router.push("/blog/categories");

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <AdminLayout>

      <div className="p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">

            {isEdit
              ? "Edit Category"
              : "Create Category"}

          </h1>

          {/* BACK BUTTON */}
          <Link
            href="/blog/categories"
            className="bg-gray-700 text-white px-5 py-3 rounded-lg"
          >
            Back
          </Link>

        </div>

        {/* FORM */}
        <div className="bg-white shadow rounded-lg p-6">

          {/* INPUT */}
          <input
            value={title}
            className="border p-3 w-full rounded-lg mb-4"
            placeholder="Category Name"
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {/* BUTTON */}
          <button
            onClick={submitCategory}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >

            {loading
              ? "Saving..."
              : isEdit
              ? "Update Category"
              : "Save Category"}

          </button>

        </div>

      </div>

    </AdminLayout>
  );
}