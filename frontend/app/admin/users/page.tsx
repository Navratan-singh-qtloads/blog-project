"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import Pagination from "@/components/common/Pagination";

import {
  successAlert,
  errorAlert,
  confirmAlert,
} from "@/components/common/Swal";

import api from "@/services/api";

type User = {
  id: number;
  name: string;
  email: string;
  status?: string;
};

export default function AdminUsersPage() {

  // ================= STATES =================
  const [users, setUsers] =
    useState<User[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const itemsPerPage = 10;

  // ================= LOAD USERS =================
  async function loadUsers() {

    setLoading(true);

    try {

      // USERS API
      const response =
        await api.get("/users");

      // ASCENDING ORDER
      const sortedUsers =
        response.data.sort(
          (a: User, b: User) =>
            a.id - b.id
        );

      setUsers(sortedUsers);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load users"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadUsers();

  }, []);

  // ================= CHANGE STATUS =================
  async function changeStatus(user: User) {

    const newStatus =
      user.status?.toLowerCase() ===
      "active"
        ? "Inactive"
        : "Active";

    const confirm = await confirmAlert(
      "Change Status",
      `Are you sure you want to change status to ${newStatus}?`
    );

    if (!confirm.isConfirmed) return;

    try {

      // UPDATE USER STATUS API
      await api.put(`/users/${user.id}`, {
        status: newStatus,
      });

      successAlert(
        "Success",
        `User status changed to ${newStatus}`
      );

      // UPDATE LOCAL STATE
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id
            ? {
                ...u,
                status: newStatus,
              }
            : u
        )
      );

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to update status"
      );
    }
  }

  // ================= PAGINATION =================
  const startIndex =
    (page - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentUsers =
    users.slice(
      startIndex,
      endIndex
    );

  const totalPages =
    Math.ceil(
      users.length / itemsPerPage
    );

  return (

    <AdminLayout>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Users List
        </h1>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                ID
              </th>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {/* LOADING */}
            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-10 text-center"
                >
                  Loading...
                </td>

              </tr>

            ) : currentUsers.length === 0 ? (

              /* NO USERS */
              <tr>

                <td
                  colSpan={5}
                  className="p-10 text-center"
                >
                  No Users Found
                </td>

              </tr>

            ) : (

              /* USERS LIST */
              currentUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* ID */}
                  <td className="p-4">
                    {user.id}
                  </td>

                  {/* NAME */}
                  <td className="p-4">
                    {user.name}
                  </td>

                  {/* EMAIL */}
                  <td className="p-4">
                    {user.email}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.status?.toLowerCase() ===
                        "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {user.status || "Active"}

                    </span>

                  </td>

                  {/* ACTION */}
                  <td className="p-4">

                    <button
                      onClick={() =>
                        changeStatus(user)
                      }
                      className={`px-4 py-2 rounded-lg text-white ${
                        user.status?.toLowerCase() ===
                        "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >

                      {user.status?.toLowerCase() ===
                      "active"
                        ? "Inactive"
                        : "Active"}

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="mt-8">

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

      </div>

    </AdminLayout>
  );
}