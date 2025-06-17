export default function PostSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 rounded-lg shadow-sm bg-neutral-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-neutral-700 rounded-full" />
        <div className="h-4 bg-neutral-700 rounded w-1/3" />
      </div>

      <div className="w-full aspect-square bg-neutral-700 rounded-md" />

      <div className="h-4 bg-neutral-700 rounded w-1/4 mt-2" />
      <div className="h-4 bg-neutral-700 rounded w-1/2" />
    </div>
  );
}
