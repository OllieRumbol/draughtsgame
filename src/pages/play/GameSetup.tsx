import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { BoardPicture } from "@/components/board/BoardPicture";
import { STARTING_BOARD } from "@/game/board";
import type { Settings } from "@/game/game-state";
import buttons from "@/styles/buttons.module.css";
import styles from "./GameSetup.module.css";
import { DEFAULT_SETTINGS } from "./play-state";
import { levelName } from "./status-text";

type GameSetupProps = {
  onStart: (settings: Settings) => void;
  focusHeading: boolean; // true when the player came here with New game
};

const LEVELS: Settings["level"][] = ["easy", "normal", "hard"];

// The first player as an option value, and back.
const FIRST_PLAYERS: Record<"1" | "2", Settings["firstPlayer"]> = { "1": 1, "2": 2 };

// Game setup (spec sections 6.1.1 and 6.4.2, item 1), laid out as the design shows: the choices and Start game in a
// card, beside the starting board on desktop and above it on a phone.
export function GameSetup({ onStart, focusHeading }: GameSetupProps) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const againstComputer = settings.opponent === "computer";

  // New game removes the controls the player used, so the focus goes to this screen's heading.
  useEffect(() => {
    if (focusHeading) {
      headingRef.current?.focus();
    }
  }, [focusHeading]);

  function change(update: Partial<Settings>): void {
    setSettings((current) => ({ ...current, ...update }));
  }

  // The level is for the computer only, so a two-player game keeps the default level, whatever was chosen
  // while the computer was the opponent.
  function start(): void {
    onStart(againstComputer ? settings : { ...settings, level: DEFAULT_SETTINGS.level });
  }

  return (
    <div className={styles.setup}>
      <section className={styles.card} aria-labelledby="setup-heading">
        <h1 id="setup-heading" ref={headingRef} tabIndex={-1} className={styles.heading}>
          New game
        </h1>
        <p className={styles.welcome}>
          Draughts with our family's house rules, for two players or against the computer.{" "}
          <Link to="/about" className={styles.link}>
            Why this game exists
          </Link>
        </p>
        <form action={start}>
          <Choice
            legend="Opponent"
            name="opponent"
            value={settings.opponent}
            options={[
              { value: "twoPlayers", label: "Two players" },
              { value: "computer", label: "The computer" },
            ]}
            onChange={(opponent) => change({ opponent })}
          />
          {againstComputer && (
            <Choice
              legend="Level"
              name="level"
              value={settings.level}
              options={LEVELS.map((level) => ({ value: level, label: levelName(level) }))}
              onChange={(level) => change({ level })}
            />
          )}
          <Choice
            legend="Who moves first"
            name="firstPlayer"
            value={settings.firstPlayer === 1 ? "1" : "2"}
            options={[
              { value: "1", label: againstComputer ? "You" : "Player 1" },
              { value: "2", label: againstComputer ? "The computer" : "Player 2" },
            ]}
            hint={againstComputer ? "You have the light men." : "Player 1 has the light men."}
            onChange={(first) => change({ firstPlayer: FIRST_PLAYERS[first] })}
          />
          <button type="submit" className={`${buttons.primary} ${styles.start}`}>
            Start game
          </button>
        </form>
      </section>
      <div className={styles.picture}>
        <BoardPicture
          board={STARTING_BOARD}
          label="The starting board: twelve dark men at the top, twelve light men at the bottom."
        />
      </div>
    </div>
  );
}

// One choice's values are a fixed set, such as the opponents, so a value is checked when the code is compiled.
type ChoiceProps<Value extends string> = {
  legend: string;
  name: string;
  value: Value;
  options: { value: Value; label: string }[];
  hint?: string;
  onChange: (value: Value) => void;
};

// One choice as a row of radio buttons, drawn as one segmented control, as in the design.
function Choice<Value extends string>({ legend, name, value, options, hint, onChange }: ChoiceProps<Value>) {
  return (
    <fieldset className={styles.choice}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.segments}>
        {options.map((option) => (
          <label key={option.value} className={styles.segment}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {hint !== undefined && <p className={styles.hint}>{hint}</p>}
    </fieldset>
  );
}
