const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchOrders() {
  const res = await fetch(`${BASE}/api/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${BASE}/api/products`);
  // products endpoint may not exist; try seed helper first
  if (!res.ok) {
    // ignore
    return [];
  }
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch(`${BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export async function updateOrder(id, payload) {
  const res = await fetch(`${BASE}/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${BASE}/api/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}

export async function seedProducts() {
  const res = await fetch(`${BASE}/api/seed-products`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed products');
  return res.json();
}

export default { fetchOrders, createOrder, updateOrder, deleteOrder, seedProducts };
