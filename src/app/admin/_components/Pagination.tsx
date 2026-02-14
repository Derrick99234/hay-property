"use client";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (next: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const start = Math.max(1, clamped - 2);
  const end = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  const from = total === 0 ? 0 : (clamped - 1) * pageSize + 1;
  const to = Math.min(clamped * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-zinc-600">
        Showing <span className="font-semibold text-zinc-900">{from}</span>–
        <span className="font-semibold text-zinc-900">{to}</span> of{" "}
        <span className="font-semibold text-zinc-900">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <PagerButton
          disabled={clamped <= 1}
          onClick={() => onPageChange(clamped - 1)}
        >
          Prev
        </PagerButton>

        {pages.map((p) => (
          <PagerButton
            key={p}
            active={p === clamped}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PagerButton>
        ))}

        <PagerButton
          disabled={clamped >= totalPages}
          onClick={() => onPageChange(clamped + 1)}
        >
          Next
        </PagerButton>
      </div>
    </div>
  );
}

function PagerButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "h-9 min-w-9 rounded-full px-3 text-xs font-semibold transition",
        disabled ? "cursor-not-allowed opacity-50" : "hover:bg-zinc-100",
        active ? "bg-zinc-900 text-white hover:bg-zinc-900" : "bg-white text-zinc-900 ring-1 ring-zinc-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
