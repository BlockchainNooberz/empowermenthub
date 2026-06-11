import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, query, state, office_type } = await req.json();

    if (action === 'size_standards') {
      const url = `https://api.sba.gov/sba_gov/content/size_standards?keyword=${encodeURIComponent(query || '')}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return Response.json({ data: [], error: `SBA API returned ${res.status}` });
      const data = await res.json();
      return Response.json({ data: Array.isArray(data) ? data : (data.hits || data.results || []) });
    }

    if (action === 'find_offices') {
      const params = new URLSearchParams();
      if (state && state !== 'all') params.set('state', state);
      if (office_type && office_type !== 'all') params.set('type', office_type);
      params.set('limit', '30');
      const url = `https://api.sba.gov/sba_gov/content/local_assistance?${params.toString()}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return Response.json({ data: [], error: `SBA API returned ${res.status}` });
      const data = await res.json();
      return Response.json({ data: Array.isArray(data) ? data : (data.hits || data.results || data.items || []) });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});