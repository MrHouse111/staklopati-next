
export async function POST(request){
  const { password } = await request.json();
  if(!password) return Response.json({ success:false, error:"Lozinka je obavezna" }, { status: 400 });
  return Response.json({ success: password==='12345' , error: password==='12345'? undefined : 'Pogrešna admin lozinka' });
}
