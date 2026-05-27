"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Sidebar() {

  const pathname =
    usePathname();

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
      {
      name: "Categories",
      path: "/blog/categories",
    },
    {
      name: "Tags",
      path: "/blog/tags",
    },
    {
      name: "Blog Posts",
      path: "/admin/posts",
    },
  
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Settings",
      path: "/admin/settings",
    },
  ];

  return (

    <aside className="w-64 bg-black text-white min-h-screen p-6">

      {/* Logo */}
      <h2 className="text-3xl font-bold mb-10">
        Blog CMS
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">

        {menus.map((menu) => (

          <Link
            key={menu.path}
            href={menu.path}
            className={`block px-4 py-3 rounded-lg transition-all
              
              ${
                pathname === menu.path
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-800"
              }
            `}
          >

            {menu.name}

          </Link>

        ))}

      </nav>

    </aside>
  );
}