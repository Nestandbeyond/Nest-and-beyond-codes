import { useEffect, useState } from "react";

/** True only after the first client render — use before showing values stored in the browser. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
