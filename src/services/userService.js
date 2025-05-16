export async function createUser(data) {
  const response = await fetch("http://localhost:8080/api/users/signup", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("Server error: " + text);
  }
  return response.json();
}
export async function updateUser(id, data) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Server error: " + text);
  }
  return res.json();
}
