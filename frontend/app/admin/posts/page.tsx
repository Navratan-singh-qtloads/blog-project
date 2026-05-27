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

// =========================
// TYPE
// =========================
type Post = {
  id: number;
  title: string;
  body?: string;
  image?: string;
  status?: string;
};

export default function PostPage() {

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  // =========================
  // FETCH POSTS
  // =========================
  async function fetchPosts() {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.get("/posts");

      // BACKEND ARRAY
      const data =
        response.data || [];

      // ASCENDING ORDER
      const sortedData =
        data.sort(
          (a: Post, b: Post) =>
            a.id - b.id
        );

      setPosts(sortedData);

    } catch (err) {

      console.log(err);

      setError(
        "Failed to load posts"
      );

      errorAlert(
        "Error",
        "Failed to load posts"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // DELETE POST
  // =========================
  async function deletePost(id: number) {

    // CONFIRM ALERT
    const result =
      await confirmAlert(
        "Delete Post",
        "Are you sure you want to delete this post?"
      );

    // CANCEL DELETE
    if (!result.isConfirmed)
      return;

    try {

      await api.delete(
        `/posts/${id}`
      );

      // SUCCESS ALERT
      await successAlert(
        "Deleted",
        "Post deleted successfully"
      );

      // REFRESH POSTS
      fetchPosts();

    } catch (err) {

      console.log(err);

      // ERROR ALERT
      errorAlert(
        "Error",
        "Error deleting post"
      );
    }
  }

  // ================= PAGINATION LOGIC =================

  // TOTAL PAGES
  const totalPages = Math.ceil(
    posts.length / itemsPerPage
  );

  // START INDEX
  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  // END INDEX
  const endIndex =
    startIndex +
    itemsPerPage;

  // CURRENT PAGE DATA
  const currentPosts =
    posts.slice(
      startIndex,
      endIndex
    );

  return (

    <AdminLayout>

      <div className="p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Blog Post List
          </h1>

          <Link
            href="/admin/posts/create"
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            + Create Post
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
                  Title
                </th>

                <th className="border p-3 text-left">
                  Status
                </th>

                <th className="border p-3 text-left">
                  Image
                </th>

                <th className="border p-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}
              {loading && (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center p-5"
                  >
                    Loading posts...
                  </td>

                </tr>

              )}

              {/* ERROR */}
              {error &&
                !loading && (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center p-5 text-red-500"
                  >
                    {error}
                  </td>

                </tr>

              )}

              {/* DATA */}
              {!loading &&
              !error &&
              currentPosts.length >
                0 ? (

                currentPosts.map(
                  (post) => (

                    <tr
                      key={post.id}
                    >

                      {/* ID */}
                      <td className="border p-3">
                        {post.id}
                      </td>

                      {/* TITLE */}
                      <td className="border p-3">
                        {post.title}
                      </td>

                      {/* STATUS */}
                      <td className="border p-3">

                        <span
                          className={`px-3 py-1 rounded text-white text-sm ${
                            post.status ===
                            "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {post.status ||
                            "inactive"}
                        </span>

                      </td>

                      {/* IMAGE */}
                      <td className="border p-3">

                        {post.image ? (

                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image
                              .replace(
                                /\\/g,
                                "/"
                              )
                              .trim()}`}
                            alt={
                              post.title
                            }
                            className="w-16 h-16 object-cover rounded"
                          />

                        ) : (

                          "No Image"

                        )}

                      </td>

                      {/* ACTION */}
                      <td className="border p-3">

                        <div className="flex gap-3 justify-center">

                          {/* EDIT */}
                          <Link
                            href={`/admin/posts/create?id=${post.id}`}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </Link>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deletePost(
                                post.id
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

                !loading &&
                !error && (

                  <tr>

                    <td
                      colSpan={5}
                      className="text-center p-5"
                    >
                      No Posts Found
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {/* PAGINATION */}
          <Pagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            onPageChange={
              setCurrentPage
            }
          />

        </div>

      </div>

    </AdminLayout>
  );
}