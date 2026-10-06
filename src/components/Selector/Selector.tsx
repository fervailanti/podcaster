'use client';

import type { ReactNode } from 'react';

import styles from './Selector.module.css';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  name?: string;
  disabled?: boolean;
};

export const Selector = ({ label, value, options, onChange, icon, name, disabled }: Props) => (
  <label className={styles.selector}>
    {icon && <span aria-hidden="true">{icon}</span>}
    <select
      aria-label={label}
      name={name}
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);
