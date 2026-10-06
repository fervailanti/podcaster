import type { ReactNode } from 'react';

import styles from './SearchBar.module.css';

type Props = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
  icon?: ReactNode;
};

export const SearchBar = ({ label, onChange, placeholder, value, icon = '⌕' }: Props) => (
  <label className={styles.search}>
    <span aria-hidden="true">{icon}</span>
    <input
      type="search"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </label>
);
