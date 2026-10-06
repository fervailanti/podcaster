import { afterEach, expect, it, vi } from 'vitest';

import { QUERY_DEFAULT_OPTIONS } from '../config';
import { getQueryClient } from './queryClient';

afterEach(() => vi.unstubAllGlobals());

it('reuses the configured query client in the browser', () => {
  const queryClient = getQueryClient();

  expect(getQueryClient()).toBe(queryClient);
  expect(queryClient.getDefaultOptions()).toEqual(QUERY_DEFAULT_OPTIONS);
});

it('creates a separate query client for each server render', () => {
  vi.stubGlobal('window', undefined);

  expect(getQueryClient()).not.toBe(getQueryClient());
});
