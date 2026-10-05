import { describe, expect, it } from 'vitest';
import { normalizePodcastDetail, normalizeTopPodcasts } from './normalize';
import { matchesPodcast } from './format';

describe('Apple podcast data', () => {
  it('maps the top feed and filters titles and authors without accents', () => {
    const podcasts = normalizeTopPodcasts({
      feed: {
        entry: [
          {
            id: { attributes: { 'im:id': '123' } },
            'im:name': { label: 'Música Viva' },
            'im:artist': { label: 'Álvaro' },
            'im:image': [{ label: 'https://example.com/cover.jpg' }],
          },
        ],
      },
    });

    expect(podcasts).toHaveLength(1);
    expect(
      matchesPodcast(podcasts[0].title, podcasts[0].author, 'MUSICA'),
    ).toBe(true);
    expect(
      matchesPodcast(podcasts[0].title, podcasts[0].author, 'alvaro'),
    ).toBe(true);
  });

  it('uses the reported total and sanitizes episode HTML', () => {
    const detail = normalizePodcastDetail({
      results: [
        {
          kind: 'podcast',
          collectionId: 123,
          collectionName: 'Music',
          trackCount: 60,
        },
        {
          kind: 'podcast-episode',
          trackId: 456,
          trackName: 'Episode',
          description:
            '<p>Hello <strong>music</strong><script>alert(1)</script></p><a href="javascript:alert(1)">Bad link</a>',
          episodeUrl: 'https://example.com/audio.mp3',
        },
      ],
    });

    expect(detail.episodeCount).toBe(60);
    expect(detail.episodes).toHaveLength(1);
    expect(detail.episodes[0].descriptionHtml).toContain(
      '<strong>music</strong>',
    );
    expect(detail.episodes[0].descriptionHtml).not.toContain('<script>');
    expect(detail.episodes[0].descriptionHtml).not.toContain('javascript:');
  });
});
