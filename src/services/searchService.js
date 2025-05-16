export async function searchUsersByName(name) {
  const res = await fetch(`http://localhost:8081/api/search/firstname?firstname=${name}`);
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}
