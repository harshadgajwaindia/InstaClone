"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 👇 Declare User type here
type User = {
  id: string;
  username: string;
  profilePic: string;
};

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]); // <- Add type here also

  useEffect(() => {
    if (search.length === 0) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?query=${search}`)
        .then((res) => res.json())
        .then((data) => setResults(data.users));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="relative md:flex md:flex-col md:items-center">
      <input
        type="text"
        placeholder="Search here"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-b border-gray-600 p-2 py-4 rounded w-full md:ml-64 md:w-150"
      />

      {results.length > 0 && (
        <div>
          {results.map((user: User) => (
            <div
              key={user.id}
              className="flex items-center p-2 hover:bg-gray-900 md:w-150 md:ml-64"
            >
              <img
                src={user.profilePic}
                alt="pfp"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
