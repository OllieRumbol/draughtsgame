import { type ReactNode, useEffect, useState } from "react";
import { CornerPicture } from "@/components/board/CornerPicture";
import { crowningLength, timingsFor } from "@/components/board/timings";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import buttons from "@/styles/buttons.module.css";
import styles from "./HowToPlayPage.module.css";
import { type RulePictureData, piecesAfter } from "./rule-pictures";

type RuleExampleProps = {
  title: string;
  picture: RulePictureData;
  caption?: string;
  children: ReactNode; // the rule, in words
};

// "Show me" plays the first `shown` steps. Each new run draws the pieces again with new keys, so they return to their
// places at once instead of sliding back.
type Demo = { run: number; shown: number | null; crownShown: boolean };

// One rule: its small board picture and, beside it, the rule in words (spec section 6.1.11, item 3).
// "Show me" plays the move with the board's own motion: the computer's slide, capture fade and crowning
// (plan section 3.6). The marks fade out while it plays. A second press starts it again from the still picture.
export function RuleExample({ title, picture, caption, children }: RuleExampleProps) {
  const timings = timingsFor(usePrefersReducedMotion());
  const [demo, setDemo] = useState<Demo>({ run: 0, shown: null, crownShown: false });
  const steps = picture.steps;

  // Each step waits for the slide, any crowning, and the computer's pause between jumps (timings.ts). A new run
  // restarts the wait, even when it starts at the same step.
  useEffect(() => {
    const shown = demo.shown;
    if (shown === null) {
      return;
    }
    let delay = timings.showMeStart;
    if (shown > 0) {
      const step = steps[shown - 1];
      delay = timings.computerSlide + (step.crowned ? crowningLength(timings) : 0) + timings.computerPause;
    }
    if (shown === steps.length) {
      delay += timings.showMeReturn;
    }

    const timer = setTimeout(() => {
      setDemo((current) =>
        shown < steps.length
          ? { ...current, shown: shown + 1, crownShown: false }
          : { run: current.run + 1, shown: null, crownShown: false },
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [demo.run, demo.shown, steps, timings]);

  function showMe(): void {
    setDemo((current) => ({ run: current.run + 1, shown: 0, crownShown: false }));
  }

  function showCrown(): void {
    setDemo((current) => ({ ...current, crownShown: true }));
  }

  const animates = timings.computerSlide > 0;
  const pieces = piecesAfter(picture, demo.shown ?? 0, animates).map((piece) => ({
    ...piece,
    id: demo.run * 100 + piece.id,
    crowning: piece.crowning && !demo.crownShown,
  }));

  return (
    <div className={styles.rule}>
      <div>
        <CornerPicture
          squares={picture.squares}
          pieces={pieces}
          marks={picture.marks}
          marksShown={demo.shown === null}
          label={picture.label}
          timings={timings}
          onCrowned={showCrown}
        />
        {caption !== undefined && <p className={styles.caption}>{caption}</p>}
        {steps.length > 0 && (
          <button
            type="button"
            className={`${buttons.secondary} ${styles.showMe}`}
            aria-label={`Show me: ${title}`}
            onClick={showMe}
          >
            Show me
          </button>
        )}
      </div>
      <div>
        <h3 className={styles.ruleTitle}>{title}</h3>
        <p className={styles.ruleText}>{children}</p>
      </div>
    </div>
  );
}
