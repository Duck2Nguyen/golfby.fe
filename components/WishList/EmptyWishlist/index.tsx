import { Heart, HeartOff } from 'lucide-react';

import { Link } from '@heroui/link';

export default function EmptyWishlist() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <HeartOff className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-[20px] text-foreground mb-2 font-600">Danh sách yêu thích trống</h2>
      <p className="text-[14px] text-muted-foreground mb-8 max-w-md mx-auto">
        Hãy thêm sản phẩm yêu thích bằng cách nhấn vào biểu tượng trái tim trên mỗi sản phẩm.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full transition-all duration-200 hover:shadow-md hover:shadow-primary/20 text-[15px] font-600"
      >
        <Heart className="w-5 h-5" />
        Khám Phá Sản Phẩm
      </Link>
    </div>
  );
}
