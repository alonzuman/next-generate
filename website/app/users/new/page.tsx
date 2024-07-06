
  import { UserForm } from '../user-form';
  import { createUser } from '../actions';
  
  export default function NewUserPage() {
    return (
      <div>
        <h1>Create New User</h1>
        <UserForm action={createUser} />
      </div>
    );
  }
  