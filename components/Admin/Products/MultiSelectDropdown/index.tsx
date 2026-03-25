'use client';

import { useMemo, useState } from 'react';
import { X, Plus, Search } from 'lucide-react';

export interface MultiSelectItem {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  allowMultiple?: boolean;
  className?: string;
  items: MultiSelectItem[];
  label: string;
  onAddNewAction?: (label: string) => void;
  onSelectionChangeAction: (ids: string[]) => void;
  placeholder?: string;
  selectedIds: string[];
  showAddNew?: boolean;
}

export default function MultiSelectDropdown({
  allowMultiple = true,
  className = '',
  items,
  label,
  onAddNewAction,
  onSelectionChangeAction,
  placeholder = 'Tìm kiếm...',
  selectedIds,
  showAddNew = true,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedItems = useMemo(
    () => items.filter(item => selectedIds.includes(item.id)),
    [items, selectedIds],
  );

  const filteredItems = useMemo(
    () => items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery],
  );

  const canAddNew =
    showAddNew &&
    onAddNewAction &&
    searchQuery.trim().length > 0 &&
    !items.some(item => item.label.toLowerCase() === searchQuery.trim().toLowerCase());

  const handleToggleItem = (itemId: string) => {
    if (!allowMultiple) {
      onSelectionChangeAction([itemId]);
      setIsOpen(false);

      return;
    }

    if (selectedIds.includes(itemId)) {
      onSelectionChangeAction(selectedIds.filter(id => id !== itemId));

      return;
    }

    onSelectionChangeAction([...selectedIds, itemId]);
  };

  const handleRemoveSelected = (itemId: string) => {
    onSelectionChangeAction(selectedIds.filter(id => id !== itemId));
  };

  const handleAddNew = () => {
    if (!onAddNewAction || !searchQuery.trim()) {
      return;
    }

    onAddNewAction(searchQuery.trim());
    setSearchQuery('');
  };

  const menuDropdown = isOpen ? (
    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
      <div className="border-b border-border p-2.5">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            className="h-9 w-full rounded-md bg-input-background pr-3 pl-9 text-[1.3rem] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={event => setSearchQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key !== 'Enter' || !canAddNew) {
                return;
              }

              event.preventDefault();
              handleAddNew();
            }}
            placeholder={placeholder}
            type="text"
            value={searchQuery}
          />
        </div>
      </div>

      {canAddNew && (
        <button
          className="flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-[1.3rem] text-primary transition-colors hover:bg-primary/5"
          onClick={handleAddNew}
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span>
            Thêm &quot;
            {searchQuery.trim()}
            &quot;
          </span>
        </button>
      )}

      <div className="max-h-60 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="px-3 py-6 text-center text-[1.3rem] text-muted-foreground">
            Không tìm thấy kết quả
          </div>
        ) : (
          <div className="p-1.5">
            {filteredItems.map(item => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <button
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[1.3rem] text-foreground transition-colors hover:bg-muted"
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  type="button"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected ? 'border-primary bg-primary' : 'border-border bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className={className}>
      <label className="mb-1.5 block text-[1.3rem] font-500 text-foreground">{label}</label>

      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedItems.map(item => (
            <div
              className="flex h-7 items-center gap-1.5 rounded-md bg-primary/10 px-2.5 text-[1.3rem] text-primary"
              key={item.id}
            >
              <span>{item.label}</span>
              <button
                className="rounded-sm p-0.5 transition-colors hover:bg-primary/20"
                onClick={() => handleRemoveSelected(item.id)}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-input-background px-3.5 text-[1.4rem] transition-colors hover:border-primary/30"
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
      >
        <span className="text-muted-foreground">
          {selectedItems.length > 0 ? `${selectedItems.length} đã chọn` : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {menuDropdown}
    </div>
  );
}
