
  import { getPost } from '../actions';
  import { notFound } from 'next/navigation';
  
  export default async function PostPage({ params }: { params: { id: string } }) {
    const post = await getPost(params.id);
  
    if (!post) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Post Details</h1>
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>
    );
  }
  