import { listPosts } from './actions';
  import Link from 'next/link';
  
  export default async function PostsPage() {
    const posts = await listPosts();
  
    return (
      <div>
        <h1>Posts</h1>
        <Link href="/posts/new">Create New Post</Link>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <pre>
                  {JSON.stringify(post, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  