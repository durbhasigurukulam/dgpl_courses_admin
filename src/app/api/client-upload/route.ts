// app/api/client-upload/route.ts

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getApiUrl } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const connectSid = cookieStore.get('connect.sid')?.value;

    if (!connectSid) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await req.formData();

    // Forward the request to the backend API
    const response = await fetch(getApiUrl('/api/files'), {
      method: 'POST',
      headers: {
        'Cookie': `connect.sid=${connectSid}`,
      },
      body: formData,
    });

    const responseText = await response.text();

    // Return the response as is, maintaining the same status
    return new Response(responseText, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error: any) {
    console.error('Client upload error:', error);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}