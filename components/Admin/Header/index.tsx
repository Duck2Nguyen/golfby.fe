'use client';

import { useRef, useState, useEffect } from 'react';
import { Bell, Menu, User, LogOut, Search, Settings, ChevronDown } from 'lucide-react';

import { useSession } from '@/hooks/auth';

interface HeaderProps {
  onToggleSidebarAction: () => void;
  title: string;
}

export default function Header({ onToggleSidebarAction, title }: HeaderProps) {
  const { logout, data } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = data?.userInfo?.firstName
    ? `${data.userInfo.firstName}${data.userInfo.lastName ? ' ' + data.userInfo.lastName : ''}`
    : 'Quản trị viên';

  const initials = (data?.userInfo?.firstName?.[0] || 'A').toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:hidden"
          onClick={onToggleSidebarAction}
          type="button"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>

        <h1 className="truncate text-[1.8rem] font-600 text-gray-900 sm:text-[2rem]">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="h-9 w-[20rem] rounded-lg border-0 bg-gray-100 py-0 pr-4 pl-9 text-[1.3rem] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 lg:w-[24rem]"
            placeholder="Tìm kiếm..."
            type="text"
          />
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden"
          type="button"
        >
          <Search className="h-5 w-5 text-gray-500" />
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          type="button"
        >
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative flex flex-row items-center" ref={profileRef}>
          <button className="flex h-[3.6rem] w-[3.6rem] cursor-pointer items-center justify-center rounded-full bg-primary-light text-[1.4rem] font-700 text-primary transition-colors hover:bg-primary-100">
            {initials}
          </button>

          <button
            className="hidden items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 sm:flex"
            onClick={() => setShowProfile(prev => !prev)}
            type="button"
          >
            <div className="text-left">
              <p className="text-[1.3rem] font-500 text-gray-900">{userName}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {showProfile && (
            <div className="absolute top-full right-0 z-50 mt-2 w-[20rem] rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[1.3rem] text-gray-700 transition-colors hover:bg-gray-100"
                type="button"
              >
                <User className="h-4 w-4 text-gray-500" />
                Hồ sơ cá nhân
              </button>
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[1.3rem] text-gray-700 transition-colors hover:bg-gray-100"
                type="button"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                Cài đặt
              </button>
              <div className="my-1 border-t border-gray-200" />
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[1.3rem] text-red-500 transition-colors hover:bg-red-50"
                onClick={logout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
