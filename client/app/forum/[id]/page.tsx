import PostDetail from '@/components/forum/PostDetail';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background text-foreground">
            <PostDetail id={id} />
        </div>
    );
}
