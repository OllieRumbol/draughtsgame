type CrownIconProps = {
  size: number;
};

// The crown set into the frame beside "For Ernest", drawn with the design's path (docs/design/site.html).
// It is decoration, so it is hidden from screen readers.
export function CrownIcon({ size }: CrownIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 8.5l4.2 3.6L12 5l4.8 7.1L21 8.5l-1.9 9.5H4.9z" />
      <rect x="5" y="19" width="14" height="2.2" rx="1" />
    </svg>
  );
}
