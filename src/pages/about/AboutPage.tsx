import type { ReactNode } from "react";
import boardStyles from "@/components/board/Board.module.css";
import { CrownIcon } from "@/components/board/CrownIcon";
import links from "@/styles/links.module.css";
import styles from "./AboutPage.module.css";
import ernestPhoto from "./ernest.jpg";

// The tribute from `About.js` on `main` at commit da953ce, in three paragraphs (spec section 6.1.11, item 5).
// "past away" is corrected to "passed away". The owner accepted five more edits on 2026-11-26, one line at a time:
// "we played", "understood the game better, I won more games", "Grandad still loved playing, even when", the rule
// sets sentence split in two with "players", and "have as much fun playing this game".
const TRIBUTE = [
  "This game was made in loving memory of my grandad, Ernest Rumbol, who sadly passed away in December of 2020. My grandad taught me this game many years ago. Over the years we played thousands of games together.",
  "As I got older and understood the game better, I won more games. However, Grandad still loved playing, even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets. His favourite was forcing players to take a piece when they could, but I thought the game was more tactical if you didn't.",
  "I hope that people have as much fun playing this game as we did. May my grandad rest in peace.",
];

// About (spec section 6.1.11, items 5 to 7): Ernest's name, his photo, the tribute, the family board and how the game
// is built. It has no project plan cards and no list of tools (item 6).
export function AboutPage() {
  return (
    <>
      <title>About – Draughts</title>
      <h1>Ernest Rumbol</h1>
      <div className={styles.about}>
        <figure className={styles.photo}>
          {/* The owner supplied this photo on 2026-11-27. It is 600 px wide, twice its widest size on the page. */}
          <PhotoFrame>
            <img
              className={`${styles.picture} ${styles.portrait}`}
              src={ernestPhoto}
              alt="Ernest Rumbol"
              width={600}
              height={804}
            />
          </PhotoFrame>
          {/* The owner's words, 2026-11-27, with "you kind" corrected to "your kind", and a full stop added at the end. */}
          <figcaption className={styles.caption}>
            Ernest Rumbol, the perfect grandad. I miss the games we used to play and the warmth of your kind loving
            heart. Love you Grandad.
          </figcaption>
        </figure>
        <div className={styles.prose}>
          {TRIBUTE.map((paragraph) => (
            <p key={paragraph} className={styles.tribute}>
              {paragraph}
            </p>
          ))}
          {/* The tribute ends with the mark on the board's frame (plan section 3.6, "For Ernest on About"). */}
          <p className={styles.signOff}>
            <CrownIcon size={16} />
            For Ernest
          </p>
          <figure className={styles.boardPhoto}>
            <PhotoPlaceholder
              title="The family board"
              label="Placeholder for a photo of the family draughts board"
              shape="landscape"
            />
            <figcaption className={styles.caption}>The board we played on</figcaption>
          </figure>
          <h2 className={styles.part}>How it's built</h2>
          <p>
            The game is a React and TypeScript web app, hosted on GitHub Pages. The computer's moves come from a
            separate API, built with .NET and Azure Functions. The code for both is on GitHub:{" "}
            <OutsideLink href="https://github.com/OllieRumbol/draughtsgame">the web app</OutsideLink> and{" "}
            <OutsideLink href="https://github.com/OllieRumbol/DraughtsGameFunction">the API</OutsideLink>.
          </p>
        </div>
      </div>
    </>
  );
}

type OutsideLinkProps = {
  href: string;
  children: string;
};

// A link that leaves the site, with a small arrow after it (the owner's choice of link look, 2026-11-26). The arrow
// is decoration: the link's words say where it goes.
function OutsideLink({ href, children }: OutsideLinkProps) {
  return (
    <a className={`${links.link} ${links.outside}`} href={href}>
      {children}
      <svg className={links.external} viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 9L9 3M4 3H9V8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </a>
  );
}

type PhotoPlaceholderProps = {
  title: string;
  label: string; // the text alternative (spec section 6.4.4)
  shape: "portrait" | "landscape";
};

// A visible placeholder in the board's walnut frame, as the design shows, until the owner supplies the photo
// (spec section 6.1.11, item 5).
function PhotoPlaceholder({ title, label, shape }: PhotoPlaceholderProps) {
  return (
    <PhotoFrame>
      <div className={`${styles.placeholder} ${styles[shape]}`} role="img" aria-label={label}>
        <strong className={styles.placeholderTitle}>{title}</strong>
        <span>Placeholder until the owner supplies it</span>
      </div>
    </PhotoFrame>
  );
}

type PhotoFrameProps = {
  children: ReactNode;
};

// The board's walnut frame and brass inlay round a photo or its placeholder, as the design shows.
function PhotoFrame({ children }: PhotoFrameProps) {
  return (
    <div className={`${boardStyles.frame} ${styles.frame}`}>
      <div className={boardStyles.inlay}>{children}</div>
    </div>
  );
}
