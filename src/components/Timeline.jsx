import React from 'react';

export default function Timeline() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Welcome, {user?.firstname || "User"}!</h2>
      <p>This is your feed. More features coming soon...</p>
    </div>
  );
}
