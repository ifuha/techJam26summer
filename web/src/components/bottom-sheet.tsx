"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

export type BottomSheetProps = {
  header: ReactNode;
  children: ReactNode;
  resetKey?: string | number;
};

const MAX_HEIGHT = 480;

export function BottomSheet({ header, children, resetKey }: BottomSheetProps) {
  const [expanded, setExpanded] = useState(true);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartExpanded = useRef(true);

  useEffect(() => {
    setExpanded(true);
  }, [resetKey]);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setNaturalHeight(el.scrollHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartY.current = event.clientY;
    dragStartExpanded.current = expanded;
    setDragOffset(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragOffset === null) return;
    setDragOffset(event.clientY - dragStartY.current);
  };

  const cappedHeight = Math.min(naturalHeight, MAX_HEIGHT);

  const endDrag = () => {
    if (dragOffset === null || cappedHeight === 0) {
      setDragOffset(null);
      return;
    }
    const baseHeight = dragStartExpanded.current ? cappedHeight : 0;
    const liveHeight = Math.min(
      cappedHeight,
      Math.max(0, baseHeight - dragOffset),
    );
    setExpanded(liveHeight > cappedHeight / 2);
    setDragOffset(null);
  };

  const height =
    dragOffset === null
      ? expanded
        ? cappedHeight
        : 0
      : Math.min(
          cappedHeight,
          Math.max(
            0,
            (dragStartExpanded.current ? cappedHeight : 0) - dragOffset,
          ),
        );

  return (
    <div className="mx-2.75">
      <div className="min-w-full bg-[#FAF9F6] px-3.25 pt-2 pb-4 rounded-t-xl shadow-2xl">
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-label={expanded ? "ドラッグして閉じる" : "ドラッグして開く"}
          className="w-full flex justify-center py-2 touch-none"
        >
          <span className="w-10 h-1 rounded-full bg-gray-300" />
        </button>
        {header}
        <div
          className="overflow-y-auto overscroll-contain"
          style={{
            height,
            transition: dragOffset === null ? "height 0.2s ease" : "none",
          }}
        >
          <div ref={detailsRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
