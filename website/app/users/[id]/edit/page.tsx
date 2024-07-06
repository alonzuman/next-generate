
  import { UserForm } from '../../user-form';
  import { getUser, updateUser } from '../../actions';
  import { notFound } from 'next/navigation';
  
  export default async function EditUserPage({ params }: { params: { id: string } }) {
    const user = await getUser(params.id);
  
    if (!user) {
      return notFound()
    }
  
    return (
      <div>
        <h1>Edit User</h1>
        <UserForm action={updateUser} defaultValues={user} />
      </div>
    );
  }
  