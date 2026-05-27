"use client";

import { useEffect, useState } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import api from "@/services/api";

import AdminLayout from "@/components/admin/AdminLayout";

import {
  successAlert,
  errorAlert,
  warningAlert,
} from "@/components/common/Swal";

export default function CreatePost() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const editId =
    searchParams.get("id");

  // ================= STATES =================
  const [title, setTitle] =
    useState("");

  const [body, setBody] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  // MULTIPLE TAGS
  const [tagIds, setTagIds] =
    useState<string[]>([]);

  // STATUS
  const [status, setStatus] =
    useState("active");

  const [categories, setCategories] =
    useState<any[]>([]);

  const [tags, setTags] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  // ================= LOAD DROPDOWNS =================
  useEffect(() => {

    fetchCategories();

    fetchTags();

  }, []);

  async function fetchCategories() {

    try {

      const res =
        await api.get("/categories");

      setCategories(res.data);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load categories"
      );
    }
  }

  async function fetchTags() {

    try {

      const res =
        await api.get("/tags");

      setTags(res.data);

    } catch (error) {

      console.log(error);

      errorAlert(
        "Error",
        "Failed to load tags"
      );
    }
  }

  // ================= LOAD POST =================
  useEffect(() => {

    if (editId) {

      fetchPost(editId);
    }

  }, [editId]);

  async function fetchPost(id: string) {

    try {

      const res =
        await api.get(`/posts/${id}`);

      const post = res.data;

      setTitle(post.title || "");

      setBody(post.body || "");

      setCategoryId(
        post.category_id
          ? String(post.category_id)
          : ""
      );

      // MULTIPLE TAGS
      if (post.tag_ids) {

        setTagIds(
          post.tag_ids.map(
            (id: number) =>
              String(id)
          )
        );

      } else {

        setTagIds([]);
      }

      // STATUS
      setStatus(
        post.status || "active"
      );

      // IMAGE PREVIEW
      if (post.image) {

        setPreview(
          `${process.env.NEXT_PUBLIC_API_URL}/${post.image
            .replace(/\\/g, "/")
            .trim()}`
        );
      }

    } catch (err) {

      console.log(err);

      errorAlert(
        "Error",
        "Failed to load post"
      );
    }
  }

  // ================= SUBMIT =================
  async function submitPost() {

    // VALIDATION
    if (
      !title.trim() ||
      !body.trim() ||
      !categoryId ||
      tagIds.length === 0
    ) {

      warningAlert(
        "Validation Error",
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      // TITLE
      formData.append(
        "title",
        title
      );

      // BODY
      formData.append(
        "body",
        body
      );

      // CATEGORY
      formData.append(
        "category_id",
        categoryId
      );

      // MULTIPLE TAG IDS JSON
      formData.append(
        "tag_ids",
        JSON.stringify(tagIds)
      );

      // STATUS
      formData.append(
        "status",
        status
      );

      // AUTHOR ID
      formData.append(
        "author_id",
        "1"
      );

      // IMAGE
      if (image) {

        formData.append(
          "image",
          image
        );
      }

      // ================= UPDATE =================
      if (editId) {

        await api.put(
          `/posts/${editId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await successAlert(
          "Success",
          "Post updated successfully"
        );
      }

      // ================= CREATE =================
      else {

        await api.post(
          "/posts/",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await successAlert(
          "Success",
          "Post created successfully"
        );
      }

      // REDIRECT
      router.push("/admin/posts");

    } catch (error: any) {

      console.log(error);

      errorAlert(
        "Error",
        error?.response?.data?.detail ||
          "Error saving post"
      );

    } finally {

      setLoading(false);
    }
  }

  // ================= UI =================
  return (

    <AdminLayout>

      <div className="p-10 max-w-3xl">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6">

          {editId
            ? "Edit Post"
            : "Create Post"}

        </h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">

          {/* POST TITLE */}
          <input
            className="border p-3 w-full mb-4 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {/* POST BODY */}
          <textarea
            className="border p-3 w-full mb-4 h-32 rounded"
            placeholder="Body"
            value={body}
            onChange={(e) =>
              setBody(e.target.value)
            }
          />

          {/* CATEGORY */}
          <select
            className="border p-3 w-full mb-4 rounded"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value
              )
            }
          >

            <option value="">
              Select Category
            </option>

            {categories.map((c) => (

              <option
                key={c.id}
                value={String(c.id)}
              >
                {c.title || c.name}
              </option>

            ))}

          </select>

          {/* MULTIPLE TAGS */}
          <div className="mb-4">

            <label className="block mb-2 font-medium">

              Select Tags

            </label>

            <select
              multiple
              className="border p-3 w-full rounded h-40"
              value={tagIds}
              onChange={(e) => {

                const values =
                  Array.from(
                    e.target.selectedOptions,
                    (option) =>
                      option.value
                  );

                setTagIds(values);
              }}
            >

              {tags.map((t) => (

                <option
                  key={t.id}
                  value={String(t.id)}
                >
                  {t.title || t.name}
                </option>

              ))}

            </select>

            <p className="text-sm text-gray-500 mt-2">

              Hold Ctrl (Windows)
              or Command (Mac)
              to select multiple tags

            </p>

          </div>

          {/* STATUS */}
          <select
            className="border p-3 w-full mb-4 rounded"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
          >

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

          {/* IMAGE */}
          <input
            type="file"
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => {

              const file =
                e.target.files?.[0] ||
                null;

              setImage(file);

              if (file) {

                setPreview(
                  URL.createObjectURL(
                    file
                  )
                );
              }
            }}
          />

          {/* IMAGE PREVIEW */}
          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded mb-4"
            />

          )}

          {/* BUTTON */}
          <button
            onClick={submitPost}
            disabled={loading}
            className="bg-black text-white px-6 py-3 w-full rounded disabled:opacity-50"
          >

            {loading
              ? "Saving..."
              : editId
              ? "Update Post"
              : "Save Post"}

          </button>

        </div>

      </div>

    </AdminLayout>
  );
}