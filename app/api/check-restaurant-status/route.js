
export async function POST(request){
  const { restaurantId } = await request.json();
  // Demo logika: sve sto radi do 23:30 je otvoreno
  const now = new Date();
  const open = now.getHours() < 23 || (now.getHours()===23 && now.getMinutes()<=30);
  return Response.json({ isOpen: open });
}
