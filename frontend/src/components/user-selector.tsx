import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  displayName: string;
}

export const UserSelector = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/current-user');
        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="header-user">
        <span className="header-label">USERS</span>
        <select className="header-user-select" aria-label="User" disabled>
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="header-user">
        <span className="header-label">USERS</span>
        <div className="header-user-info">
          <div className="user-name">No User</div>
          <div className="user-email">Please authenticate</div>
        </div>
      </div>
    );
  }

  // Display displayName, fallback to name, show email below
  const displayText = user.displayName || user.name || 'User';

  return (
    <div className="header-user">
      <span className="header-label">USERS</span>
      <div className="header-user-info">
        <div className="user-name">{displayText}</div>
        <div className="user-email">{user.email}</div>
      </div>
    </div>
  );
}
