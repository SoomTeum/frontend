import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

export type Option<T extends string = string> = { value: T; label: string };

type Props<T extends string = string> = {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
};

export default function SortPillSelect<T extends string = string>({
  value,
  options,
  onChange,
  className,
  disabled,
  size = 'md',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = useMemo(
    () => options.find((o) => o.value === value) ?? options[0],
    [value, options],
  );

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current && !btnRef.current) return;
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const [activeIdx, setActiveIdx] = useState<number>(-1);
  useEffect(() => {
    if (!open) setActiveIdx(-1);
  }, [open]);

  const pillSize = size === 'sm' ? 'h-7 px-2 text-caption2' : 'h-10 px-4 text-[15px]';

  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return;
          if ((e.key === 'Enter' || e.key === ' ') && !open) {
            e.preventDefault();
            setOpen(true);
            setActiveIdx(options.findIndex((o) => o.value === value));
          } else if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
            setActiveIdx(0);
          }
        }}
        className={[
          'rounded-full border bg-white',
          'border-gray-300 text-black',
          'inline-flex items-center gap-2',
          'shadow-sm hover:bg-gray-50',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          pillSize,
        ].join(' ')}
      >
        <span className="leading-none">{current?.label ?? ''}</span>
        <ChevronDown
          size={15}
          className={`transition-transform ${open ? 'rotate-180' : ''} text-gray-400`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
          style={{ insetInlineStart: 0 }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIdx((i) => (i + 1) % options.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIdx((i) => (i - 1 + options.length) % options.length);
            } else if (e.key === 'Home') {
              e.preventDefault();
              setActiveIdx(0);
            } else if (e.key === 'End') {
              e.preventDefault();
              setActiveIdx(options.length - 1);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const pick = options[activeIdx];
              if (pick) {
                onChange(pick.value);
                setOpen(false);
                btnRef.current?.focus();
              }
            }
          }}
        >
          {options.map((opt, i) => {
            const selected = opt.value === value;
            const active = i === activeIdx;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={selected}
                type="button"
                className={[
                  'text-caption2 w-full px-2 py-2 text-left',
                  active ? 'bg-gray-100' : 'bg-white',
                  selected ? 'font-medium text-black' : 'text-gray-700',
                  'hover:bg-gray-100 focus:outline-none',
                ].join(' ')}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
