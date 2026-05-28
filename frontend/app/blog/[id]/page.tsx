import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body?: string;
  excerpt?: string;
  image?: string;
  category?: string;
  created_at?: string;
};

async function getPost(id: string): Promise<Post | null> {

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();

  } catch (error) {

    return null;

  }
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const post = await getPost(id);

  // NOT FOUND
  if (!post) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-4xl font-bold mb-4">
            Post Not Found
          </h1>

          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Back Home
          </Link>

        </div>

      </div>

    );
  }

  return (

    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow overflow-hidden">

        {/* IMAGE */}
        {post.image && (

          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image.replace("\\", "/")}`}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />

        )}

        {/* CONTENT */}
        <div className="p-8">

          {/* CATEGORY */}
          <p className="text-sm text-blue-600 font-medium mb-3">

            {post.category || "Blog"}

          </p>

          {/* TITLE */}
          <h1 className="text-4xl font-bold mb-4">
            {post.title}
          </h1>

          {/* DATE */}
          <p className="text-gray-400 text-sm mb-8">

            {post.created_at
              ? new Date(
                  post.created_at
                ).toLocaleDateString()
              : ""}

          </p>

          {/* EXCERPT */}
          {post.excerpt && (

            <div className="bg-gray-100 p-5 rounded-xl mb-8">

              <p className="text-lg text-gray-700 italic">
                {post.excerpt}
              </p>

            </div>

          )}

          {/* BODY */}
          <div className="prose max-w-none">

            <p className="text-gray-700 leading-8 whitespace-pre-line">
              {post.body}
            </p>

          </div>

          {/* BACK */}
          <div className="mt-10">

            <Link
              href="/"
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              ← Back to Blog
            </Link>

          </div>

        </div>

      </div>

    </main>

  );
}