
export async function POST(request){
  const { restaurantId } = await request.json();
  // Demo meni (mapirano na id)
  const common = {
    "Roštilj":[
      { name:"Ćevapi", portion:"300g", price:520 },
      { name:"Pljeskavica", portion:"200g", price:420 },
    ],
    "Prilozi":[
      { name:"Kajmak", price:120 },
      { name:"Lepinja", price:80 }
    ],
    "Pića":[
      { name:"Coca-Cola", portion:"0.5l", price:180 },
      { name:"Voda", portion:"0.5l", price:130 }
    ]
  };
  const menuById = {
    1: common,
    2: common,
    3: common,
    4: common
  };
  return Response.json({ restaurantName: "Restoran", menu: menuById[restaurantId] || {} });
}
