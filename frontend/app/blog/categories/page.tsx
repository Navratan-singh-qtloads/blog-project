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

export default function CategoriesPage() {

  const [categories, setCategories] =
    useState<any[]>([]);

  // ================= SEARCH =================
  const [search, setSearch] =
    useState("");

  // ================= SORTING =================
  const [sortOrder, setSortOrder] =
    useState("asc");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {

    try {

      const response =
        await api.get("/categories");

      setCategories(response.data);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load categories"
      );
    }
  }

  // ================= DELETE CATEGORY =================
  async function deleteCategory(id: number) {

    // CONFIRM DELETE
    const result = await confirmAlert(
      "Delete Category",
      "Are you sure you want to delete this category?"
    );

    // CANCEL
    if (!result.isConfirmed) return;

    try {

      await api.delete(
        `/categories/${id}`
      );

      // SUCCESS ALERT
      await successAlert(
        "Deleted",
        "Category deleted successfully"
      );

      // REFRESH DATA
      fetchCategories();

    } catch (error) {

      console.log(error);

      // ERROR ALERT
      errorAlert(
        "Error",
        "Error deleting category"
      );
    }
  }

  // ================= SEARCH + SORT =================
  const filteredAndSortedCategories =
    useMemo(() => {

      // SEARCH FILTER
      const filtered =
        categories.filter((category) =>
          category.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      // SORTING
      const sorted = filtered.sort(
        (a: any, b: any) => {

          if (sortOrder === "asc") {
            return a.id - b.id;
          } else {
            return b.id - a.id;
          }
        }
      );

      return sorted;

    }, [categories, search, sortOrder]);

  // ================= RESET PAGE =================
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder]);

  // ================= PAGINATION =================

  // TOTAL PAGES
  const totalPages = Math.ceil(
    filteredAndSortedCategories.length /
      itemsPerPage
  );

  // START INDEX
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  // END INDEX
  const endIndex =
    startIndex + itemsPerPage;

  // CURRENT PAGE DATA
  const currentCategories =
    filteredAndSortedCategories.slice(
      startIndex,
      endIndex
    );

  return (

    <AdminLayout>

      <div className="p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Category List
          </h1>

          <Link
            href="/blog/categories/create"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            Create Category
          </Link>

        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search category..."
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
                  Category Name
                </th>

                <th className="border p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {currentCategories.length > 0 ? (

                currentCategories.map(
                  (category) => (

                    <tr key={category.id}>

                      {/* ID */}
                      <td className="border p-3">
                        {category.id}
                      </td>

                      {/* TITLE */}
                      <td className="border p-3">
                        {category.title}
                      </td>

                      {/* ACTION */}
                      <td className="border p-3">

                        <div className="flex gap-3 justify-center">

                          {/* EDIT */}
                          <Link
                            href={`/blog/categories/create?id=${category.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </Link>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deleteCategory(
                                category.id
                              )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={3}
                    className="border p-3 text-center"
                  >
                    No Categories Found
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