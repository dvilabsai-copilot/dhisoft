'use client';

import {
  type FormEvent,
  useEffect,
  useState,
} from 'react';

type Role = 'EDITOR' | 'VIEWER' | 'SUPER_ADMIN';

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

export default function UserManagement({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'EDITOR' as Role,
  });

  async function fetchUsers(
    signal?: AbortSignal,
  ): Promise<User[]> {
    const response = await fetch('/api/admin/users', {
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Could not load users. Status: ${response.status}`,
      );
    }

    return response.json() as Promise<User[]>;
  }

  async function refreshUsers(): Promise<void> {
    try {
      const loadedUsers = await fetchUsers();

      setUsers(loadedUsers);
      setError('');
    } catch (caughtError) {
      console.error(
        'Failed to load admin users:',
        caughtError,
      );

      setError('Could not load users.');
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal)
      .then((loadedUsers) => {
        setUsers(loadedUsers);
        setError('');
      })
      .catch((caughtError: unknown) => {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Failed to load admin users:',
          caughtError,
        );

        setError('Could not load users.');
      });

    return () => {
      controller.abort();
    };
  }, []);

  async function create(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setError(
          'Could not create user. Check the fields and try again.',
        );
        return;
      }

      setForm({
        email: '',
        name: '',
        password: '',
        role: 'EDITOR',
      });

      await refreshUsers();
    } catch (caughtError) {
      console.error(
        'Failed to create admin user:',
        caughtError,
      );

      setError(
        'Could not create user. Please try again.',
      );
    }
  }

  async function update(
    id: string,
    patch: Partial<Pick<User, 'role' | 'isActive'>>,
  ): Promise<void> {
    setError('');

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patch),
        },
      );

      if (!response.ok) {
        setError('Could not update user.');
        return;
      }

      await refreshUsers();
    } catch (caughtError) {
      console.error(
        'Failed to update admin user:',
        caughtError,
      );

      setError(
        'Could not update user. Please try again.',
      );
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">
        Access control
      </p>

      <h1 className="text-3xl font-bold">
        Admin users
      </h1>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-red-700"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={create}
        className="mt-6 grid gap-3 rounded-2xl bg-white p-6 md:grid-cols-5"
      >
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
          className="rounded-lg border px-3 py-2"
        />

        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(event) =>
            setForm({
              ...form,
              name: event.target.value,
            })
          }
          className="rounded-lg border px-3 py-2"
        />

        <input
          required
          minLength={12}
          type="password"
          placeholder="Temporary password"
          value={form.password}
          onChange={(event) =>
            setForm({
              ...form,
              password: event.target.value,
            })
          }
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={form.role}
          onChange={(event) =>
            setForm({
              ...form,
              role: event.target.value as Role,
            })
          }
          className="rounded-lg border px-3 py-2"
        >
          <option>EDITOR</option>
          <option>VIEWER</option>
          <option>SUPER_ADMIN</option>
        </select>

        <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white">
          Add user
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5"
          >
            <div>
              <p className="font-bold">
                {user.name}{' '}

                {user.id === currentUserId && (
                  <span className="text-xs text-blue-600">
                    (you)
                  </span>
                )}
              </p>

              <p className="text-sm text-slate-500">
                {user.email}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                disabled={user.id === currentUserId}
                value={user.role}
                onChange={(event) =>
                  void update(user.id, {
                    role: event.target.value as Role,
                  })
                }
                className="rounded-lg border px-3 py-2"
              >
                <option>EDITOR</option>
                <option>VIEWER</option>
                <option>SUPER_ADMIN</option>
              </select>

              <button
                disabled={user.id === currentUserId}
                onClick={() =>
                  void update(user.id, {
                    isActive: !user.isActive,
                  })
                }
                className="rounded-full border px-3 py-2 disabled:opacity-40"
              >
                {user.isActive
                  ? 'Deactivate'
                  : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}