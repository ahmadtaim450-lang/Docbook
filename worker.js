export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { public_id } = await request.json();
      if (!public_id) return new Response('Missing public_id', { status: 400 });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await generateSignature(public_id, timestamp, env.CLOUDINARY_API_SECRET);

      const formData = new FormData();
      formData.append('public_id', public_id);
      formData.append('timestamp', timestamp);
      formData.append('api_key', env.CLOUDINARY_API_KEY);
      formData.append('signature', signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
        { method: 'POST', body: formData }
      );

      const result = await res.json();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};

async function generateSignature(publicId, timestamp, secret) {
  const str = `public_id=${publicId}&timestamp=${timestamp}${secret}`;
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
