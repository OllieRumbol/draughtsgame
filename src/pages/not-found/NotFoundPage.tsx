import { Link } from "react-router";
import buttons from "@/styles/buttons.module.css";

// Spec section 6.1.10, item 3: an unknown address shows a short message with a link to Play.
export function NotFoundPage() {
  return (
    <>
      <title>Page not found – Draughts</title>
      <h1>Page not found</h1>
      <p>There's no page at this address.</p>
      <Link to="/" className={buttons.primary}>
        Go to Play
      </Link>
    </>
  );
}
