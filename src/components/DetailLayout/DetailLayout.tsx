import type { ComponentProps, ReactNode } from 'react';

import { Sidebar } from '../Sidebar/Sidebar';
import styles from './DetailLayout.module.css';

type Props = {
  children: ReactNode;
  sidebar?: ComponentProps<typeof Sidebar>;
};

export const DetailLayout = ({ children, sidebar }: Props) => (
  <div className={`${styles.layout} ${sidebar ? '' : styles.withoutSidebar}`}>
    {sidebar && <Sidebar {...sidebar} />}
    <div className={styles.content}>{children}</div>
  </div>
);
