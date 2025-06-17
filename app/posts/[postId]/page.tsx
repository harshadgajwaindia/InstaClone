import CommentSection from "@/components/CommentSection";
import DeletePostButton from "@/components/DeletePostButton";
import LikeButton from "@/components/LikeButton";
import prisma from "@/lib/prisma";

interface Props {
  params: {
    postId: string;
  };
}

export default async function SinglePostPage(props: Props) {
  const { postId } = await props.params;
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post)
    return (
      <div className="text-center py-10 text-xl font-semibold">
        Post Not Found
      </div>
    );

  return (
    <div className="h-screen md:flex md:items-center md:justify-center gap-8 px-4 md:px-20 py-6 max-w-6xl mx-auto">
      <div className="relative md:flex-1">
        <div className="absolute top-3 right-3 z-10">
          <DeletePostButton postId={postId} />
        </div>
        <div className="flex items-center justify-center h-full">
          {post.mediaType === "video" ? (
            <video
              src={post.mediaUrl}
              controls
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
          ) : (
            <img
              src={post.mediaUrl}
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="md:flex-1 flex flex-col gap-4 mt-6 md:mt-0">
        <LikeButton
          postId={post.id}
          initialLiked={false}
          initialLikeCount={0}
        />

        <div className="border-b pb-4">
          <p className="text-base font-medium">{post.caption}</p>
        </div>

        <div className="flex-1">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
