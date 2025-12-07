import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { createOrder, seedProducts } from '../api';

export default function BookOrder(){
  const [description, setDescription] = useState('');
  const [productIds, setProductIds] = useState([]);

  useEffect(()=>{
    // ensure products exist
    seedProducts().catch(()=>{});
  },[])

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await createOrder({ orderDescription: description, productIds });
      // redirect back to root
      window.location.href = '/';
    }catch(err){ alert(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Book Order</h2>
        <label className="block mb-2">Order Description</label>
        <input className="w-full border px-3 py-2 mb-4" value={description} onChange={e=>setDescription(e.target.value)} />

        <label className="block mb-2">Products (comma-separated IDs)</label>
        <input className="w-full border px-3 py-2 mb-4" onChange={e=>setProductIds(e.target.value.split(',').map(s=>Number(s.trim())).filter(Boolean))} />

        <div className="flex gap-2">
          <Button type="submit">BookOrder</Button>
          <Button onClick={()=>{ window.location.href = '/'}}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
