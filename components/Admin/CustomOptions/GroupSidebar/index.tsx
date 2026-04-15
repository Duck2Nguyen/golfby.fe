import { Plus, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react';

import type { CustomOptionGroup } from '../types';

interface GroupSidebarProps {
  activeGroupId: string | null;
  filteredGroups: CustomOptionGroup[];
  groups: CustomOptionGroup[];
  isGroupPanelCollapsed: boolean;
  onCreateGroup: () => void;
  onRenameGroup: (groupId: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSelectGroup: (groupId: string) => void;
  onToggleCollapse: () => void;
  searchQuery: string;
}

export default function GroupSidebar({
  activeGroupId,
  filteredGroups,
  groups,
  isGroupPanelCollapsed,
  onCreateGroup,
  onRenameGroup,
  onSearchQueryChange,
  onSelectGroup,
  onToggleCollapse,
  searchQuery,
}: GroupSidebarProps) {
  return (
    <aside
      className={`flex min-h-0 flex-col border-r border-gray-200 transition-all duration-200 ${
        isGroupPanelCollapsed ? 'col-span-1' : 'col-span-3'
      }`}
    >
      <div className={`border-b border-gray-200 ${isGroupPanelCollapsed ? 'px-2 py-3' : 'p-4'}`}>
        <div
          className={`flex gap-2 ${
            isGroupPanelCollapsed ? 'flex-row items-center justify-between' : 'items-start justify-between'
          }`}
        >
          {!isGroupPanelCollapsed && (
            <div>
              <p className="text-[1.6rem] font-600 text-gray-900">Nhóm Tùy Chọn Custom</p>
              <p className="mt-1 text-[1.2rem] text-gray-500">
                Quản lý module custom độc lập theo từng group.
              </p>
            </div>
          )}

          {isGroupPanelCollapsed && <p className="pl-2 text-[1.6rem] font-600 text-gray-900">Nhóm</p>}

          <button
            aria-label={isGroupPanelCollapsed ? 'Mở rộng panel nhóm' : 'Thu gọn panel nhóm'}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 ${
              isGroupPanelCollapsed ? 'shrink-0' : 'ml-auto'
            }`}
            onClick={onToggleCollapse}
            title={isGroupPanelCollapsed ? 'Mở rộng panel nhóm' : 'Thu gọn panel nhóm'}
            type="button"
          >
            {isGroupPanelCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {!isGroupPanelCollapsed && (
        <>
          <div className="p-4">
            <label className="mb-1 block text-[1.2rem] text-gray-600">Tìm nhóm</label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="h-10 w-full rounded-lg border border-gray-200 py-0 pr-3 pl-9 text-[1.3rem]"
                onChange={event => onSearchQueryChange(event.target.value)}
                placeholder="Tìm nhóm..."
                type="text"
                value={searchQuery}
              />
            </div>

            <button
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[1.3rem] font-500 text-white"
              onClick={onCreateGroup}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Tạo nhóm
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
            {filteredGroups.map(group => {
              const active = group.id === activeGroupId;

              return (
                <div
                  className={`w-full rounded-lg border px-3 py-3 cursor-pointer text-left transition-colors ${
                    active ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectGroup(group.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectGroup(group.id);
                    }
                  }}
                  key={group.id}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[1.3rem] font-600 text-gray-900">{group.name}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        aria-label="Sửa tên nhóm"
                        className="rounded p-1.5 text-gray-500 hover:bg-white/70 hover:text-gray-700"
                        onClick={event => {
                          event.stopPropagation();
                          onRenameGroup(group.id);
                        }}
                        title="Sửa tên nhóm"
                        type="button"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[1.1rem] text-gray-600">
                        #{group.sortOrder + 1}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1 text-[1.2rem] text-gray-500">
                    {group.options.length} tùy chọn | {group.conditions.length} điều kiện
                  </p>
                </div>
              );
            })}

            {filteredGroups.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-[1.2rem] text-gray-500">
                Không tìm thấy nhóm nào
              </div>
            )}
          </div>
        </>
      )}

      {isGroupPanelCollapsed && (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-1 py-4 text-center">
          <p className="text-[1.1rem] text-gray-500">Đang thu gọn danh sách nhóm</p>
          <span className="rounded-md bg-gray-100 px-2 py-1 text-[1.2rem] font-600 text-gray-700">
            {groups.length} nhóm
          </span>
        </div>
      )}
    </aside>
  );
}
