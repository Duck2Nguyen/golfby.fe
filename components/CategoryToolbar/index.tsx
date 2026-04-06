import { Grid3X3, Grid2X2, LayoutGrid, LayoutList } from 'lucide-react';

export type ViewMode = 'grid-2' | 'grid-3' | 'grid-4' | 'list';

interface CategoryToolbarProps {
  totalProducts: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
}

export function CategoryToolbar({
  totalProducts,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  perPage,
  onPerPageChange,
}: CategoryToolbarProps) {
  const viewModes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'list', icon: <LayoutList className="h-4 w-4" />, label: 'Danh sách' },
    { mode: 'grid-2', icon: <Grid2X2 className="h-4 w-4" />, label: '2 cột' },
    { mode: 'grid-3', icon: <Grid3X3 className="h-4 w-4" />, label: '3 cột' },
    { mode: 'grid-4', icon: <LayoutGrid className="h-4 w-4" />, label: '4 cột' },
  ];

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Left: View Modes */}
      <div className="flex items-center gap-3">
        <span className="hidden text-[1.3rem] text-muted-foreground sm:inline" style={{ fontWeight: 500 }}>
          Xem dưới dạng
        </span>
        <div className="flex items-center gap-0.5 rounded-lg bg-[#f5f5f5] p-1">
          {viewModes.map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`rounded-md p-2 transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={mode}
            >
              {icon}
            </button>
          ))}
        </div>
        <span className="text-[1.3rem] text-muted-foreground">{totalProducts} sản phẩm</span>
      </div>

      {/* Right: Sort & Per Page */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            className="whitespace-nowrap text-[1.3rem] text-muted-foreground"
            style={{ fontWeight: 500 }}
          >
            Hiển thị
          </label>
          <select
            value={perPage}
            onChange={e => onPerPageChange(Number(e.target.value))}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-white px-3 pr-8 text-[1.3rem] text-foreground outline-none transition-colors focus:border-primary"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            {[12, 20, 40, 60].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            className="whitespace-nowrap text-[1.3rem] text-muted-foreground"
            style={{ fontWeight: 500 }}
          >
            Sắp xếp
          </label>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-white px-3 pr-8 text-[1.3rem] text-foreground outline-none transition-colors focus:border-primary"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="name-asc">Tên: A → Z</option>
            <option value="name-desc">Tên: Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
