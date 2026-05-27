"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import api from "@/services/api";

import AdminLayout from "@/components/admin/AdminLayout";

import {
  successAlert,
  errorAlert,
  warningAlert,
} from "@/components/common/Swal";

export default function CreateTagPage() {

  const searchParams = useSearchParams();

  const router = useRouter();

  const id = searchParams.get("id");

  const isEdit = !!id;

  // ======================
  // STATE
  // ======================
  const [name, setName] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ======================
  // LOAD TAG (EDIT MODE)
  // ======================
  useEffect(() => {

    if (id) {
      fetchTag();
    }

  }, [id]);

  async function fetchTag() {

    try {

      const response =
        await api.get(`/tags/${id}`);

      // BACKEND RETURNS NAME
      setName(response.data.name);

    } catch (error) {

      console.log(
        "Fetch tag error:",
        error
      );

      errorAlert(
        "Error",
        "Failed to load tag data"
      );
    }
  }

  // ======================
  // CREATE / UPDATE TAG
  // ======================
  async function submitTag() {

    // VALIDATION
    if (!name.trim()) {

      warningAlert(
        "Validation Error",
        "Please enter tag name"
      );

      return;
    }

    try {

      setLoading(true);

      // ================= UPDATE =================
      if (isEdit) {

        await api.put(`/tags/${id}`, {
          name,
        });

        await successAlert(
          "Success",
          "Tag updated successfully"
        );
      }

      // ================= CREATE =================
      else {

        await api.post("/tags/", {
          name,
        });

        await successAlert(
          "Success",
          "Tag created successfully"
        );
      }

      // REDIRECT
      router.push("/blog/tags");

    } catch (error) {

      console.log(
        "Submit tag error:",
        error
      );

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
              ? "Edit Tag"
              : "Create Tag"}

          </h1>

          <Link
            href="/blog/tags"
            className="bg-gray-700 text-white px-5 py-3 rounded-lg"
          >
            Back
          </Link>

        </div>

        {/* FORM */}
        <div className="bg-white shadow rounded-lg p-6">

          {/* INPUT */}
          <input
            value={name}
            className="border p-3 w-full rounded-lg mb-4"
            placeholder="Tag Name"
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* BUTTON */}
          <button
            onClick={submitTag}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >

            {loading
              ? "Saving..."
              : isEdit
              ? "Update Tag"
              : "Save Tag"}

          </button>

        </div>

      </div>

    </AdminLayout>
  );
}