
'use client';
import React, { useState } from 'react';

export default function Admin() {
  const [pwd, setPwd] = useState('');
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard');

  const verify = async () => {
    const res = await fetch('/api/verify-admin-password', {method:'POST', body: JSON.stringify({ password: pwd })});
    const data = await res.json();
    if(data.success){ setOk(true); setError(''); } else { setError(data.error || 'Greška'); }
  };

  if(!ok){
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#1f1f1f] p-6 rounded-lg w-full max-w-sm">
          <h1 className="text-xl mb-4">Admin Panel</h1>
          <input type="password" className="w-full p-2 rounded bg-[#2a2a2a] mb-2" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="Admin lozinka" />
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <button onClick={verify} className="w-full bg-[#00bfa5] py-2 rounded">Prijavi se</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex gap-3 mb-4">
        {['dashboard','cities','restaurants','menu','rewards'].map(k=>(
          <button key={k} onClick={()=>setTab(k)} className={`px-3 py-2 rounded ${tab===k?'bg-[#00bfa5] text-black':'bg-[#1f1f1f]'}`}>{k}</button>
        ))}
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded">{tab} (coming soon)</div>
    </div>
  )
}
