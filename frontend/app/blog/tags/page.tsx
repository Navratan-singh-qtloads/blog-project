"use client";

import { useEffect, useMemo, useState } from "react";
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

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  // ================= SORTING =================
  const [sortOrder, setSortOrder] = useState("asc");

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

      setTags(response.data);
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

  // ================= FILTER + SORT =================
  const filteredAndSortedTags = useMemo(() => {
    // SEARCH FILTER
    const filtered = tags.filter((tag) =>
      tag.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    // SORTING
    const sorted = filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    return sorted;
  }, [tags, search, sortOrder]);

  // ================= PAGINATION =================

  // TOTAL PAGES
  const totalPages = Math.ceil(
    filteredAndSortedTags.length / itemsPerPage
  );

  // START INDEX
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  // END INDEX
  const endIndex =
    startIndex + itemsPerPage;

  // CURRENT PAGE DATA
  const currentTags = filteredAndSortedTags.slice(
    startIndex,
    endIndex
  );

  // ================= RESET PAGE ON SEARCH =================
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

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

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tag..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3 w-full"
          />

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3"
          >
            <option value="asc">
              ID Ascending
            </option>

            <option value="desc">
              ID Descending
            </option>
          </select>
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