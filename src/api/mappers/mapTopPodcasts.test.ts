import { describe, expect, it } from 'vitest';

import { mapTopPodcasts } from './mapTopPodcasts';

describe('Apple top podcast list', () => {
  it('maps the top feed', () => {
    const podcasts = mapTopPodcasts({
      feed: {
        entry: [
          {
            id: { attributes: { 'im:id': '123' } },
            'im:name': { label: 'Live Music' },
            'im:artist': { label: 'David' },
            'im:image': [{ label: 'https://example.com/cover.jpg' }]
          }
        ]
      }
    });

    expect(podcasts).toMatchObject([{ id: '123', title: 'Live Music', author: 'David' }]);
  });
});
