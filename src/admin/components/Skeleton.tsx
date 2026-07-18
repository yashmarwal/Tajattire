function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

/** Mimics a CatalogueAdmin product card while its grid is loading */
export function CatalogueCardSkeleton() {
  return (
    <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] overflow-hidden">
      <Block className="aspect-[3/4] rounded-none" />
      <div className="p-3 space-y-2">
        <Block className="h-3 w-3/4" />
        <Block className="h-2.5 w-1/2" />
        <div className="flex gap-1.5 mt-3">
          <Block className="h-6 flex-1" />
          <Block className="h-6 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function CatalogueGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => <CatalogueCardSkeleton key={i} />)}
    </div>
  );
}

/** Mimics a single list row (Testimonials, FAQ) while loading */
export function ListRowSkeleton() {
  return (
    <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 space-y-3">
      <Block className="h-3 w-1/3" />
      <Block className="h-3 w-full" />
      <Block className="h-3 w-4/5" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => <ListRowSkeleton key={i} />)}
    </div>
  );
}

/** Mimics a table's rows (Submissions) while loading */
export function TableRowsSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-[rgba(201,168,76,0.03)]">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-4 py-3">
              <Block className="h-3 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
