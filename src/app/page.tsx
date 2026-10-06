import type { Metadata } from 'next';

import { queries } from '@/api/queries';
import { PrefetchBoundary } from '@/api/tanstack/PrefetchBoundary';
import { getAppMetadata } from '@/i18n/server';
import { HomeScreen } from '@/screens/HomeScreen/HomeScreen';

export const generateMetadata = async (): Promise<Metadata> => getAppMetadata('home', '/');

const HomePage = () => (
  <PrefetchBoundary query={queries.topPodcasts()}>
    <HomeScreen />
  </PrefetchBoundary>
);

export default HomePage;
