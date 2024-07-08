
  import { PostForm } from '../../post-form';
  import { getPost, updatePost } from '../../actions';
  import { notFound } from 'next/navigation';
  
  export default async function EditPostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);
  
    if (!post) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Edit Post</h1>
        <PostForm action={updatePost} defaultValues={post} />
      </div>
    );
  }
  