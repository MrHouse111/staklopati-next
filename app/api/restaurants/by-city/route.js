
export async function POST(request){
  const { city } = await request.json();
  if(!city){ return Response.json({ error: "Grad mora biti naveden" }, { status: 400 }); }
  const valid = ["Nova Pazova","Stara Pazova","Banovci"];
  if(!valid.includes(city)){ return Response.json({ restaurants: [] }); }
  // Demo data dok ne nakačimo pravu bazu
  const demo = {
    "Nova Pazova":[
      { id:1, name:"Njam Njam Uki", hours:"09:00-23:00", phone:"0638307697" },
      { id:2, name:"Pljeskavica Kod Žike", hours:"10:00-00:00", phone:"060123456" }
    ],
    "Stara Pazova":[
      { id:3, name:"Caribic", hours:"10:00-23:00", phone:"021111222" }
    ],
    "Banovci":[
      { id:4, name:"Biftek Banovci", hours:"08:00-22:00", phone:"064222333" }
    ]
  };
  return Response.json({ restaurants: demo[city] || [] });
}
