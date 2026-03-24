"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, ExternalLink, Calendar, Search, Edit3 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Post = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete post: " + error.message);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Posts</h1>
                <p className="text-muted-foreground mt-2">
                  View, organize, and delete existing blog posts.
                </p>
              </div>
              <Link
                href="/admin/create-post"
                className="inline-flex items-center justify-center rounded-md bg-[#2d6a4f] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1b4332]"
              >
                Create New Post
              </Link>
            </div>

            {/* Content Area */}
            <div className="bg-card rounded-xl border opacity-100 shadow-sm">
              {/* Search Bar */}
              <div className="border-b p-4 sm:px-6">
                <div className="relative max-w-sm">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <p className="mt-2">Loading posts...</p>
                        </td>
                      </tr>
                    ) : filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                          {searchQuery
                            ? "No posts match your search."
                            : "No posts found. Start by creating one!"}
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {filteredPosts.map((post) => (
                          <motion.tr
                            key={post.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, backgroundColor: "#fecaca" }}
                            className="group transition-colors hover:bg-muted/50"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-foreground">{post.title}</div>
                              <div className="text-muted-foreground mt-1 text-xs">{post.slug}</div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td colSpan={3} className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <Link
                                  href={`/news/${post.slug}`}
                                  target="_blank"
                                  className="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors hover:bg-muted"
                                  title="View Post"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/admin/edit-post/${post.id}`}
                                  className="text-muted-foreground hover:text-foreground rounded-md p-2 transition-colors hover:bg-muted"
                                  title="Edit Post"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(post.id, post.title)}
                                  className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-500/10"
                                  title="Delete Post"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  );
}
