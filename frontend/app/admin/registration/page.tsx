"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");
      router.push("/admin/login");

    } catch (error) {
      alert("Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Register Admin
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}