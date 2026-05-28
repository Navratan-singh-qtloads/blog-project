import Link from "next/link";

type Post = {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  category?: string;
  created_at?: string;
  image?: string;
  status?: string;
};

async function getPosts(): Promise<Post[]> {

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    // =========================
    // ONLY ACTIVE POSTS
    // =========================
    const activePosts = data.filter(
      (post: Post) =>
        post.status?.toLowerCase() === "published"
    );

    // =========================
    // ASCENDING ORDER
    // =========================
    const sortedPosts =
      activePosts.sort(
        (a: Post, b: Post) =>
          a.id - b.id
      );

    return sortedPosts;

  } catch (error) {

    console.log(error);

    return [];
  }
}

export default async function HomePage() {

  const posts =
    await getPosts();

  return (

    <main className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <section className="bg-black text-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <p className="uppercase tracking-[5px] text-sm text-gray-400 mb-4">
            FastAPI + Next.js Blog
          </p>

          <h1 className="text-5xl font-bold leading-tight max-w-3xl">
            Modern Blog CMS with
            FastAPI & Next.js
          </h1>

          <p className="text-gray-300 mt-6 max-w-2xl text-lg">
            A clean, fast and SEO-friendly blog platform
            built using FastAPI, PostgreSQL and Next.js App Router.
          </p>

        </div>

      </section>

      {/* POSTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h2 className="text-3xl font-bold">
              Latest Articles
            </h2>

            <p className="text-gray-500 mt-2">
              Explore recently published posts
            </p>

          </div>

        </div>

        {/* NO POSTS */}
        {posts.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <h3 className="text-2xl font-semibold mb-3">
              No published Posts Found
            </h3>

            <p className="text-gray-500">
              Start creating blog posts from admin dashboard.
            </p>

          </div>

        ) : (

          /* POSTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300"
              >

                {/* IMAGE */}
                <div className="h-52 overflow-hidden">

                  {post.image ? (

                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image
                        .replace(/\\/g, "/")
                        .trim()}`}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />

                  ) : (

                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>

                  )}

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  {/* CATEGORY */}
                  <p className="text-sm text-blue-600 font-medium mb-2">

                    {post.category || "Blog"}

                  </p>

                  {/* TITLE */}
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">

                    {post.title}

                  </h3>

                  {/* EXCERPT */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">

                    {post.excerpt ||
                      `${post.body?.slice(0, 100)}...`}

                  </p>

                  {/* DATE */}
                  <p className="text-xs text-gray-400 mb-4">

                    {post.created_at
                      ? new Date(
                          post.created_at
                        ).toLocaleDateString()
                      : ""}

                  </p>

                  {/* READ MORE */}
                  <Link
                    href={`/blog/${post.id}`}
                    className="block text-center w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Read More
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}