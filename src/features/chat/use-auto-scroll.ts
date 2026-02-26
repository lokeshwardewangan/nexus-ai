import { useCallback, useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD = 80; // px from the bottom still considered "at bottom"

/**
 * Keeps a scroll container pinned to the bottom as new content streams in —
 * but only while the user is already near the bottom. If they scroll up to
 * read, auto-scroll pauses and `showJumpButton` exposes a "jump to latest"
 * affordance.
 */
export function useAutoScroll<T>(dependency: T) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const [showJumpButton, setShowJumpButton] = useState(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distanceFromBottom < BOTTOM_THRESHOLD;
    pinnedRef.current = pinned;
    setShowJumpButton(!pinned);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    pinnedRef.current = true;
    setShowJumpButton(false);
  }, []);

  // Stick to the bottom on new content only when the user hasn't scrolled away.
  useEffect(() => {
    const el = containerRef.current;
    if (el && pinnedRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [dependency]);

  return { containerRef, handleScroll, scrollToBottom, showJumpButton };
}
