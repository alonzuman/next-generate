
  import { getUser } from '../actions';
  import { notFound } from 'next/navigation';
  
  export default async function UserPage({ params }: { params: { id: string } }) {
    const user = await getUser(params.id);
  
    if (!user) {
      return notFound()
    }
  
    return (
      <div>
        <h1>User Details</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    );
  }
  