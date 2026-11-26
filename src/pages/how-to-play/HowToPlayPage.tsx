import type { MouseEvent } from "react";
import { Link } from "react-router";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import buttons from "@/styles/buttons.module.css";
import links from "@/styles/links.module.css";
import styles from "./HowToPlayPage.module.css";
import { RuleExample } from "./RuleExample";
import { JUMPING_AGAIN, KINGS, MOVING, TAKING, WINNING } from "./rule-pictures";

// The page's three parts, for the contents links at the top (spec section 6.1.11, item 3).
const PARTS = [
  { id: "rules", title: "The rules" },
  { id: "house-rules", title: "Our house rules" },
  { id: "using-the-game", title: "Using the game" },
];

// How to play (spec section 6.1.11, items 3 and 4): the goal, the rules in section 2.1 with a small board picture
// each, how our house rules differ from standard English draughts, and how to use the game. The text is drafted from
// spec section 2.1, and the owner approves the wording.
export function HowToPlayPage() {
  const reducedMotion = usePrefersReducedMotion();

  // The site uses the address's hash for its pages, so a contents link cannot use it to jump to a part. It scrolls to
  // the part's heading instead, and moves the focus there, so the keyboard and a screen reader follow. A click with a
  // modifier key, such as Ctrl to open a new tab, is left to the browser, which opens How to play at the top.
  function goToPart(event: MouseEvent<HTMLAnchorElement>, id: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    const heading = document.getElementById(id);
    heading?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    heading?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.page}>
      <title>How to play – Draughts</title>
      <h1>How to play</h1>
      <nav className={styles.contents} aria-label="On this page">
        <span>On this page:</span>
        {PARTS.map((part) => (
          <a key={part.id} href="#/howtoplay" className={links.link} onClick={(event) => goToPart(event, part.id)}>
            {part.title}
          </a>
        ))}
      </nav>
      <p className={styles.lead}>
        Take all of your opponent's pieces, or leave them with no move. Each player starts with twelve men on the dark
        squares. The light men start at the bottom, and the dark men at the top.
      </p>

      <h2 id="rules" tabIndex={-1} className={styles.part}>
        The rules
      </h2>
      <RuleExample title="Moving" picture={MOVING}>
        Men move one square diagonally forward, onto an empty dark square. Light men move up the board, and dark men
        move down.
      </RuleExample>
      <RuleExample title="Taking" picture={TAKING}>
        When an opponent's man is diagonally in front of yours, and the square beyond it is empty, you can jump over it
        and take it. Taking is your choice: you never have to.
      </RuleExample>
      <RuleExample title="Jumping again" picture={JUMPING_AGAIN}>
        After a jump, the same piece can jump again if there is another piece to take. You can stop after any jump. A
        piece can only be taken once in a turn.
      </RuleExample>
      <RuleExample title="Kings" picture={KINGS}>
        A man that reaches the far side becomes a king, and that ends the turn. A king is two men stacked, with a brass
        band. It moves one square diagonally in any direction, and it jumps in any direction too. During a chain of
        jumps, a king can land back on the square it started from. Only a king can take a king.
      </RuleExample>
      <RuleExample title="Winning" picture={WINNING} caption="Light to move, and blocked">
        If it's your turn and you can't move, you lose. A player with no pieces left can't move, so taking every piece
        wins too. You can also give up. There are no draws.
      </RuleExample>

      <h2 id="house-rules" tabIndex={-1} className={styles.part}>
        Our house rules
      </h2>
      <p>These are the rules our family played by. They differ from standard English draughts in four ways.</p>
      <table className={styles.compare}>
        <thead>
          <tr>
            <th scope="col" className={styles.ruleColumn}>
              <span className="visually-hidden">Rule</span>
            </th>
            <th scope="col">Standard English draughts</th>
            <th scope="col">Our house rules</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Taking</th>
            <td>You must take when you can</td>
            <td className={styles.ours}>Taking is your choice</td>
          </tr>
          <tr>
            <th scope="row">Jumping again</th>
            <td>You must finish every jump in the chain</td>
            <td className={styles.ours}>You can stop after any jump</td>
          </tr>
          <tr>
            <th scope="row">Men and kings</th>
            <td>Any piece can take a king</td>
            <td className={styles.ours}>Only a king can take a king</td>
          </tr>
          <tr>
            <th scope="row">First move</th>
            <td>Dark moves first</td>
            <td className={styles.ours}>You choose who moves first</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.aside}>
        <p>
          <strong>Why is taking a choice?</strong> Grandad liked forced taking. I thought the game was more tactical
          without it.{" "}
          <Link to="/about" className={links.link}>
            Read about Ernest
          </Link>
        </p>
      </div>

      <h2 id="using-the-game" tabIndex={-1} className={styles.part}>
        Using the game
      </h2>
      <div className={styles.ways}>
        <section className={styles.card} aria-labelledby="mouse-or-touch">
          <h3 id="mouse-or-touch" className={styles.cardTitle}>
            Mouse or touch
          </h3>
          <ul className={styles.list}>
            <li>Click or tap one of your pieces to pick it up. Cream dots show where it can go.</li>
            <li>Click a dot to move there. Click the piece again to put it down, unless it has just jumped.</li>
            <li>
              After a jump, the piece stays up if it can jump again. Click the next dot, or press{" "}
              <strong>End turn</strong>.
            </li>
            <li>
              <strong>Show tips</strong> puts a ring on every square you can finish a move on.
            </li>
            <li>
              <strong>Undo</strong> takes back the last turn. Against the computer, it takes back the computer's reply
              and your last turn.
            </li>
            <li>
              <strong>Give up</strong> ends the game. <strong>New game</strong> goes back to the choices.
            </li>
          </ul>
        </section>
        <section className={styles.card} aria-labelledby="keyboard">
          <h3 id="keyboard" className={styles.cardTitle}>
            Keyboard
          </h3>
          <ul className={styles.list}>
            <li>
              <kbd className={styles.key}>Tab</kbd> moves between the buttons and onto the board.
            </li>
            <li>The arrow keys move from square to square.</li>
            <li>
              <kbd className={styles.key}>Enter</kbd> or <kbd className={styles.key}>Space</kbd> picks up a piece, or
              moves it to the square you are on.
            </li>
            <li>
              <kbd className={styles.key}>Escape</kbd> puts the piece down, unless it has just jumped.
            </li>
            <li>A screen reader reads each square's row and column, and what stands on it. Every move is read out.</li>
          </ul>
        </section>
      </div>

      <p className={styles.end}>
        <Link to="/" className={`${buttons.primary} ${styles.start}`}>
          Start a game
        </Link>
      </p>
    </div>
  );
}
