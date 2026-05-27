"use client";

import Sidebar from "./Sidebar";

import Header from "./Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-8">

          {children}

        </main>

      </div>

    </div>
  );
}