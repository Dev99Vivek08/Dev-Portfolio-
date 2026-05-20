"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let raf: number;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mouseX + "px";
        cursorRef.current.style.top = mouseY + "px";
      }
    };

    const follow = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = followerX + "px";
        followerRef.current.style.top = followerY + "px";
      }
      raf = requestAnimationFrame(follow);
    };

    const expand = () => {
      if (cursorRef.current) { cursorRef.current.style.width = "14px"; cursorRef.current.style.height = "14px"; }
      if (followerRef.current) { followerRef.current.style.width = "44px"; followerRef.current.style.height = "44px"; }
    };

    const shrink = () => {
      if (cursorRef.current) { cursorRef.current.style.width = "10px"; cursorRef.current.style.height = "10px"; }
      if (followerRef.current) { followerRef.current.style.width = "32px"; followerRef.current.style.height = "32px"; }
    };

    document.addEventListener("mousemove", move, { passive: true });
    follow();

    const attachHover = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });
    };

    attachHover();

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={followerRef} className="cursor-follower" aria-hidden="true" />
    </>
  );
}
