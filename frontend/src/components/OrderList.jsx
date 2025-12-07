import { useEffect, useState } from 'react';
import Button from './Button';
import { fetchOrders, createOrder, deleteOrder, seedProducts } from '../api';

function OrderRow({ order, onDelete }) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{order.id}</td>
      <td className="px-4 py-2">{order.orderDescription}</td>
      <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
      <td className="px-4 py-2">{order.products.map(p=>p.productName).join(', ')}</td>
      <td className="px-4 py-2"><button className="text-red-600" onClick={()=>onDelete(order.id)}>Delete</button></td>
    </tr>
  )
}

export default function OrderList(){
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');

  const load = async ()=>{
    try{
      const data = await fetchOrders();
      setOrders(data);
    }catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{ load() }, []);

  const handleDelete = async (id)=>{
    if(!confirm('Delete order?')) return;
    try{
      await deleteOrder(id);
      await load();
    }catch(err){ alert(err.message) }
  }

  const filtered = orders.filter(o=> {
    if(!q) return true;
    const s = q.toLowerCase();
    return String(o.id).includes(s) || (o.orderDescription||'').toLowerCase().includes(s);
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <input placeholder="Search by id or description" value={q} onChange={e=>setQ(e.target.value)} className="border px-3 py-2 rounded w-80" />
          <Button onClick={async ()=>{ await seedProducts(); await load(); }}>Seed Products</Button>
        </div>
        <div>
          <a href="/book-order" className="inline-block"><Button>Book Order</Button></a>
        </div>
      </div>

      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2">ID</th>
            <th className="text-left px-4 py-2">Description</th>
            <th className="text-left px-4 py-2">Created</th>
            <th className="text-left px-4 py-2">Products</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(o=> <OrderRow key={o.id} order={o} onDelete={handleDelete} />)}
        </tbody>
      </table>
    </div>
  )
}
