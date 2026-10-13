"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { isActive, type NavGroup } from "@/lib/nav";

type Props = {
  group: NavGroup;
  path: string;
  lang: Lang;
  onNavigate?: () => void;
};

/**
 * 桌面一级下拉：hover 或 click 展开；点击外部 / Esc 关闭；
 * 键盘可达（Tab 聚焦、↑↓ 移动、Enter 选中、Esc 关闭）。
 * 方向用逻辑属性（start-/top-full），RTL 下自动从一侧展开。
 */
export default function NavDropdown({ group, path, lang, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const groupActive = group.items.some((it) => isActive(path, it.href));

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const focusItem = (i: number) => {
    const el = itemRefs.current[i];
    if (el) el.focus();
  };

  const onBtnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    const n = group.items.length;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cur = document.activeElement;
      const idx = itemRefs.current.findIndex((el) => el === cur);
      focusItem((idx + 1) % n);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cur = document.activeElement;
      const idx = itemRefs.current.findIndex((el) => el === cur);
      focusItem((idx - 1 + n) % n);
    }
  };

  const main = t(group.labelKey, lang);
  const tip =
    group.zhKey && lang !== "zh" ? t(group.zhKey, lang) || undefined : undefined;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onBtnKeyDown}
        title={tip}
        className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
          groupActive
            ? "text-accent"
            : "text-muted hover:bg-surface-2 hover:text-fg"
        }`}
      >
        {main}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          onKeyDown={onPanelKeyDown}
          className="nav-drop absolute top-full start-0 z-30 mt-1 min-w-[180px] rounded-xl border border-line bg-surface p-1.5 shadow-lg"
        >
          {group.items.map((it, i) => {
            const on = isActive(path, it.href);
            return (
              <Link
                key={it.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={it.href}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  on
                    ? "bg-accent-soft text-accent"
                    : "text-fg hover:bg-surface-2"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {t(it.labelKey, lang)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
