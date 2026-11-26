import { Link } from "react-router";
import { CornerPicture } from "@/components/board/CornerPicture";
import buttons from "@/styles/buttons.module.css";
import styles from "./NotFoundPage.module.css";

// Spec section 6.1.10, item 3: an unknown address shows a short message with a link to Play. Above it, an empty
// corner of the board, as the design shows.
export function NotFoundPage() {
  return (
    <>
      <title>Page not found – Draughts</title>
      <div className={styles.picture}>
        <CornerPicture squares={3} pieces={[]} label="An empty corner of a draughts board." />
      </div>
      <h1>Page not found</h1>
      <p>There's no page at this address.</p>
      <Link to="/" className={buttons.primary}>
        Go to Play
      </Link>
    </>
  );
}
