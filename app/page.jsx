
'use client';
import React, { useEffect, useState } from 'react';

export default function Main() {
  const [activeScreen, setActiveScreen] = useState('cities');
  const [selectedCity, setSelectedCity] = useState('');
  const [restaurantsByCity, setRestaurantsByCity] = useState({});
  const [restaurantStatus, setRestaurantStatus] = useState({});
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');

  const cities = ['Nova Pazova', 'Stara Pazova', 'Banovci'];

  const loadRestaurants = async (city) => {
    const res = await fetch('/api/restaurants/by-city', {method:'POST', body: JSON.stringify({ city })});
    const data = await res.json();
    const list = data.restaurants || [];
    // check status for each
    const statuses = {};
    for (const r of list) {
      const rs = await fetch('/api/check-restaurant-status', {method:'POST', body: JSON.stringify({ restaurantId: r.id })});
      const s = await rs.json();
      statuses[r.id] = s.isOpen ?? null;
    }
    setRestaurantStatus((prev)=>({...prev, ...statuses}));
    setRestaurantsByCity((prev)=>({...prev, [city]: list}));
  };

  const loadMenu = async (id) => {
    try{
      setMenuLoading(true); setMenuError(null);
      const res = await fetch('/api/get-restaurant-menu',{ method:'POST', body: JSON.stringify({ restaurantId: id })});
      if(!res.ok) throw new Error('Bad response');
      const data = await res.json();
      setMenuData(data);
      setActiveCategory(Object.keys(data.menu || {})[0] || '');
    }catch(e){
      setMenuError('Nije moguće učitati meni. Pokušaj ponovo.');
    }finally{
      setMenuLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {activeScreen==='cities' && (
        <div className="flex flex-col items-center pt-16 gap-4">
          <h1 className="text-4xl font-semibold">ŠtaKlopati</h1>
          <p className="text-gray-400">Izaberi grad</p>
          <div className="grid gap-3 w-full max-w-xs">
            {cities.map(city=> (
              <button key={city} onClick={()=>{setSelectedCity(city); setActiveScreen('restaurants'); loadRestaurants(city);}}
                className="bg-[#00bfa5] hover:bg-[#00a693] transition-colors rounded-lg py-3">
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeScreen==='restaurants' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button className="text-[#00bfa5]" onClick={()=>setActiveScreen('cities')}>← Gradovi</button>
            <h2 className="text-xl">{selectedCity}</h2>
          </div>
          <div className="grid gap-3">
            {(restaurantsByCity[selectedCity]||[]).map(r => (
              <div key={r.id} className="bg-[#1f1f1f] p-4 rounded-lg cursor-pointer hover:bg-[#2a2a2a]"
                onClick={()=>{setSelectedRestaurant(r); setActiveScreen('menu'); loadMenu(r.id);}}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-medium">{r.name}</div>
                    <div className="text-sm text-gray-400">{r.hours}</div>
                    <div className="text-sm text-gray-400">{r.phone}</div>
                  </div>
                  <div className="ml-3">
                    {restaurantStatus[r.id] != null &&
                      <span className={`px-2 py-1 rounded-full text-sm ${restaurantStatus[r.id] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {restaurantStatus[r.id] ? 'Otvoreno' : 'Zatvoreno'}
                      </span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeScreen==='menu' && selectedRestaurant && (
        <div className="pb-20">
          <div className="sticky top-0 bg-[#121212] p-4 border-b border-gray-800 flex justify-between items-center z-10">
            <button className="text-[#00bfa5]" onClick={()=>setActiveScreen('restaurants')}>← {selectedCity}</button>
            <div className="text-lg font-semibold">{selectedRestaurant.name}</div>
            <div className="w-8" />
          </div>
          {menuLoading && <div className="p-6 text-center">Učitavanje…</div>}
          {menuError && <div className="p-6 text-center text-red-400">{menuError}</div>}
          {menuData && (
            <>
              <div className="overflow-x-auto border-b border-gray-800">
                <div className="flex gap-2 p-2">
                  {Object.keys(menuData.menu).map(cat => (
                    <button key={cat} onClick={()=>setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full ${activeCategory===cat ? 'bg-[#00bfa5] text-black' : 'bg-[#1f1f1f] text-gray-200'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 grid gap-3">
                {(menuData.menu[activeCategory] || []).map((item, i) => (
                  <div key={i} className="bg-[#1f1f1f] p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && <div className="text-sm text-gray-400">{item.description}</div>}
                        {item.portion && <div className="text-xs text-gray-500 mt-1">{item.portion}</div>}
                      </div>
                      <div className="text-[#00bfa5] font-semibold">
                        {item.price ? `${item.price} RSD` : (item.sizes ? '' : '')}
                      </div>
                    </div>
                    {item.sizes && (
                      <div className="mt-2 grid gap-1">
                        {item.sizes.map((s, idx)=>(
                          <div key={idx} className="flex justify-between text-sm text-gray-300">
                            <span>{s.size}</span><span className="text-[#00bfa5]">{s.price} RSD</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
