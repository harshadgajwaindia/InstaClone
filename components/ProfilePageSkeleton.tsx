"use client";

export default function ProfilePageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 bg-gray-700 min-h-screen text-white animate-pulse">
      
      
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-600 rounded-full" />
          <div>
            <div className="w-32 h-4 bg-gray-600 rounded mb-2" />
            <div className="w-20 h-4 bg-gray-600 rounded" />
          </div>
        </div>

        <div className="w-28 h-10 bg-gray-600 rounded" />
      </div>

      
      <div className="flex items-center gap-2 border-t border-gray-500 pt-4 mb-6">
        <div className="w-5 h-5 bg-gray-600 rounded" />
        <div className="w-24 h-4 bg-gray-600 rounded" />
      </div>

      
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-600 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
