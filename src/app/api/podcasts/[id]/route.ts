import { getPodcastDetail } from '@/podcasts/server/apple';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id))
    return Response.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    return Response.json(await getPodcastDetail(id));
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Unable to load podcast' }, { status: 502 });
  }
}
