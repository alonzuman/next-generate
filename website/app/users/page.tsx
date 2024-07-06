import { listUsers } from './actions';
  import Link from 'next/link';
  
  export default async function UsersPage() {
    const users = await listUsers();
  
    return (
      <div>
        <h1>Users</h1>
        <Link href="/users/new">Create New User</Link>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Link href={`/users/${user.id}`}>
                <pre>
                  {JSON.stringify(user, null, 2)}
                </pre>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  