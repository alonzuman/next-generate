
  import { PostForm } from '../post-form';
  import { createPost } from '../actions';
  
  export default function NewPostPage() {
    return (
      <div>
        <h1>Create New Post</h1>
        <PostForm action={createPost} />
      </div>
    );
  }
  