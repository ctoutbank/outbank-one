export function GET(request: Request) {
  console.log("Hello from Vercel!", request);
  return new Response("Hello from Vercel!");
}
