import styles from './AudioPlayer.module.css';

type Props = {
  label: string;
  src: string;
};

export const AudioPlayer = ({ label, src }: Props) => (
  <div className={styles.player}>
    <audio controls preload="metadata" src={src} aria-label={label} />
  </div>
);
