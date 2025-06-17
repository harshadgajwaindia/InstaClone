"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
      } else {
        alert("error logging in");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="hidden md:block">
          <img
            className="w-[380px] h-auto"
            src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
            alt="Instagram preview"
          />
        </div>

        <div className="flex flex-col">
          <form
            onSubmit={handleSubmit}
            className="border border-gray-700 p-4 flex flex-col justify-center items-center"
          >
            <div className="p-5 text-center">
              <h1 className="font-sans text-4xl">Instagram</h1>
              <h3 className="text-sm mt-2">
                Log in to see photos and videos from your friends.
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <input
                className="p-2 w-64 border border-gray-500 bg-neutral-900 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
              />

              <input
                className="p-2 w-64 border border-gray-500 bg-neutral-900 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>

            <div className="py-4">
              <button
                type="submit"
                className="w-64 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          <div className="text-center py-6">
            <div className="border border-gray-700 p-4">
              <h3>Don't have an account?</h3>
              <Link className="text-blue-500" href="/signup">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
