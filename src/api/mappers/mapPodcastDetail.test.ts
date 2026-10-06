import { describe, expect, it } from 'vitest';

import { mapPodcastDetail } from './mapPodcastDetail';

describe('Apple podcast data', () => {
  it('uses the reported total and sanitizes episode HTML', () => {
    const detail = mapPodcastDetail({
      results: [
        {
          kind: 'podcast',
          collectionId: 123,
          collectionName: 'Music',
          trackCount: 60
        },
        {
          kind: 'podcast-episode',
          trackId: 456,
          trackName: 'Episode',
          description:
            '<p>Hello <strong>music</strong></p><a href="https://example.com">Visit website</a><script>alert(1)</script><a href="javascript:alert(1)">Bad link</a>',
          episodeUrl: 'https://example.com/audio.mp3'
        }
      ]
    });

    expect(detail.episodeCount).toBe(60);
    expect(detail.episodes).toHaveLength(1);
    expect(detail.episodes[0].descriptionHtml).toContain('<strong>music</strong>');
    expect(detail.episodes[0].descriptionHtml).toContain(
      '<a href="https://example.com">Visit website</a>'
    );
    expect(detail.episodes[0].descriptionHtml).not.toContain('<script>');
    expect(detail.episodes[0].descriptionHtml).not.toContain('javascript:');
  });
});
