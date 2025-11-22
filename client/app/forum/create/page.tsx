import PostForm from "@/components/forum/PostForm";

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>
        <PostForm />
      </div>
    </div>
  );
}
