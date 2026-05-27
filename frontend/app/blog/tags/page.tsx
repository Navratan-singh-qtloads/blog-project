"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "@/services/api";

import AdminLayout from "@/components/admin/AdminLayout";
import Pagination from "@/components/common/Pagination";

import {
  successAlert,
  errorAlert,
  confirmAlert,
} from "@/components/common/Swal";

export default function TagsPage() {

  const [tags, setTags] = useState<any[]>([]);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // ================= FETCH TAGS =================
  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {

    try {

      const response = await api.get("/tags/");

      // ASCENDING ORDER
      const sortedTags = response.data.sort(
        (a: any, b: any) => a.id - b.id
      );

      setTags(sortedTags);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load tags"
      );
    }
  }

  // ================= DELETE TAG =================
  async function deleteTag(id: number) {

    // CONFIRM ALERT
    const result = await confirmAlert(
      "Delete Tag",
      "Are you sure you want to delete this tag?"
    );

    // CANCEL DELETE
    if (!result.isConfirmed) return;

    try {

      await api.delete(`/tags/${id}`);

      // SUCCESS ALERT
      successAlert(
        "Deleted",
        "Tag deleted successfully"
      );

      // REFRESH TAGS
      fetchTags();

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Error deleting tag"
      );
    }
  }

  // ================= PAGINATION =================

  // TOTAL PAGES
  const totalPages = Math.ceil(
    tags.length / itemsPerPage
  );

  // START INDEX
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  // END INDEX
  const endIndex =
    startIndex + itemsPerPage;

  // CURRENT PAGE DATA
  const currentTags = tags.slice(
    startIndex,
    endIndex
  );

  return (

    <AdminLayout>

      <div className="p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Tag List
          </h1>

          <Link
            href="/blog/tags/create"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            Create Tag
          </Link>

        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg p-6 overflow-auto">

          <table className="w-full border border-gray-200">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-3 text-left">
                  ID
                </th>

                <th className="border p-3 text-left">
                  Tag Name
                </th>

                <th className="border p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {currentTags.length > 0 ? (

                currentTags.map((tag) => (

                  <tr key={tag.id}>

                    {/* ID */}
                    <td className="border p-3">
                      {tag.id}
                    </td>

                    {/* NAME */}
                    <td className="border p-3">
                      {tag.name}
                    </td>

                    {/* ACTION */}
                    <td className="border p-3">

                      <div className="flex gap-3 justify-center">

                        {/* EDIT */}
                        <Link
                          href={`/blog/tags/create?id=${tag.id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </Link>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteTag(tag.id)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={3}
                    className="border p-3 text-center"
                  >
                    No Tags Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>

      </div>

    </AdminLayout>

  );
}