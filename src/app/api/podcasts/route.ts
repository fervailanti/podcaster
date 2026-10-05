import { getTopPodcasts } from '@/podcasts/server/apple';

export const GET = async () => {
  try {
    return Response.json(await getTopPodcasts());
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Unable to load podcasts' }, { status: 502 });
  }
};
