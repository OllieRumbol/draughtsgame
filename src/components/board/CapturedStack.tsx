import type { CSSProperties } from "react";
import type { Player } from "@/game/board";
import styles from "./CapturedStack.module.css";

type CapturedStackProps = {
  count: number;
  menOf: Player; // whose men were taken: player 1's are light, player 2's are dark
  label: string; // for example "Player 1 took"
};

// The captured men, stacked beside the board (plan section 3.6). On desktop they form one upright stack. On a phone
// they form towers of up to four, side by side. CSS shows one of the two. The words carry the count, so the discs
// are hidden from screen readers.
export function CapturedStack({ count, menOf, label }: CapturedStackProps) {
  const colour = menOf === 1 ? styles.light : styles.dark;

  return (
    <div className={styles.stack}>
      <div className={styles.upright} aria-hidden="true">
        <Tower count={count} colour={colour} />
      </div>
      <div className={styles.towers} aria-hidden="true">
        {towerSizes(count).map((size, index) => (
          <Tower key={index} count={size} colour={colour} />
        ))}
      </div>
      <span>
        {label} {count}
      </span>
    </div>
  );
}

// 7 men make towers of 4 and 3.
function towerSizes(count: number): number[] {
  const sizes: number[] = [];
  for (let left = count; left > 0; left -= 4) {
    sizes.push(Math.min(4, left));
  }
  return sizes;
}

type TowerProps = {
  count: number;
  colour: string;
};

// The men lie flat, one on another. Each sits one step higher than the man below it.
function Tower({ count, colour }: TowerProps) {
  return (
    <div className={styles.tower} style={{ "--men": count } as CSSProperties} data-testid="tower">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`${styles.man} ${colour}`} style={{ "--index": index } as CSSProperties} />
      ))}
    </div>
  );
}
