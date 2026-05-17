import { useEffect, useRef, useState } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: any;
    let rafId: number;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    })();
    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
  return null;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    let x = 0, y = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.25;
      y += (ty - y) * 0.25;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (labelRef.current) labelRef.current.style.transform = `translate(${x + 30}px, ${y + 30}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      if (target && dotRef.current) {
        dotRef.current.classList.add("expand");
        setLabel(target.dataset.cursor || "");
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      if (target && dotRef.current) {
        dotRef.current.classList.remove("expand");
        setLabel("");
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={labelRef} className={`cursor-label ${label ? "show" : ""}`}>{label}</div>
    </>
  );
}
