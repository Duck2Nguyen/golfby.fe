'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';

import { useSession } from '@/hooks/auth';

export default function Header() {
  const { logout, data } = useSession();

  const userName =
    data?.userInfo?.firstName
      ? `${data.userInfo.firstName}${data.userInfo.lastName ? ' ' + data.userInfo.lastName : ''}`
      : 'Quản trị viên';

  return (
    <header className="sticky top-0 z-30 flex h-[6.4rem] items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
      <p className="text-[1.6rem] font-500 text-gray-500">
        Chào mừng quay lại,{' '}
        <span className="font-700 text-gray-900">{userName}</span> 👋
      </p>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button className="flex h-[3.6rem] w-[3.6rem] cursor-pointer items-center justify-center rounded-full bg-primary-500/10 text-[1.4rem] font-700 text-primary-500 transition-colors hover:bg-primary-500/20">
            {(data?.userInfo?.firstName?.[0] || 'A').toUpperCase()}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Account Actions"
          itemClasses={{
            base: 'rounded-lg px-3 py-2 data-[hover=true]:bg-gray-50',
            title: 'text-[1.4rem] font-500',
          }}
        >
          <DropdownItem key="logout" className="text-danger" color="danger" onPress={logout}>
            Đăng Xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
}
