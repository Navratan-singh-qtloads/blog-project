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

export default function CategoriesPage() {

  const [categories, setCategories] =
    useState<any[]>([]);

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

      // ASCENDING ORDER
      const sortedCategories =
        response.data.sort(
          (a: any, b: any) =>
            a.id - b.id
        );

      setCategories(sortedCategories);

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

  // ================= PAGINATION =================

  // TOTAL PAGES
  const totalPages = Math.ceil(
    categories.length / itemsPerPage
  );

  // START INDEX
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  // END INDEX
  const endIndex =
    startIndex + itemsPerPage;

  // CURRENT PAGE DATA
  const currentCategories =
    categories.slice(
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