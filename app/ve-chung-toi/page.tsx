import React from 'react';

import { Header } from '@/components/Header';

export const metadata = {
  title: 'Về Chúng Tôi - GolfBy',
  description: 'Tìm hiểu về GolfBy - thương hiệu cung cấp sản phẩm golf chính hãng',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <article className="max-w-none">
          <div className="page-width page-width--narrow">
            <div className="container">
              <h1 className="main-page-title text-[2.4rem] font-700 mb-8">Về Chúng Tôi</h1>
              
              <div className="rte text-[1.4rem] leading-[2.1rem] text-muted-foreground">
                
                {/* Section 1 */}
                <div className="mb-8">
                  <h3 className="text-[1.6rem] font-700 mb-4 text-foreground">Về GolfBy - Chúng Tôi Là Ai?</h3>
                  <p>
                    GolfBy là thương hiệu chuyên cung cấp các sản phẩm golf chính hãng và chất lượng cao, được nhập khẩu trực tiếp từ các thương hiệu hàng đầu thế giới. Chúng tôi tự hào là đối tác đáng tin cậy của cộng đồng golfer tại Việt Nam, mang đến giải pháp toàn diện cho cả người chơi chuyên nghiệp lẫn người mới bắt đầu hành trình chinh phục môn thể thao đầy đẳng cấp này.
                  </p>
                </div>

                <hr className="border-border/60 my-8" />

                {/* Section 2 */}
                <div className="mb-8">
                  <h3 className="text-[1.6rem] font-700 mb-4 text-foreground">Sứ Mệnh Của GolfBy</h3>
                  <p className="mb-4">
                    Chúng tôi cam kết mang lại giá trị tốt nhất cho khách hàng thông qua việc cung cấp:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="font-700">Sản phẩm chính hãng:</strong> Bảo đảm chất lượng với nguồn gốc rõ ràng từ các thương hiệu uy tín như Callaway, Titleist, Taylormade, Mizuno, Ping, và nhiều hãng khác.</li>
                    <li><strong className="font-700">Giá cả cạnh tranh:</strong> Đem đến các sản phẩm với mức giá hợp lý và ưu đãi hấp dẫn.</li>
                    <li><strong className="font-700">Dịch vụ khách hàng tận tâm:</strong> Hỗ trợ bạn từ khâu tư vấn chọn sản phẩm đến hậu mãi, đảm bảo sự hài lòng tuyệt đối.</li>
                  </ul>
                </div>

                <hr className="border-border/60 my-8" />

                {/* Section 3 */}
                <div className="mb-8">
                  <h3 className="text-[1.6rem] font-700 mb-4 text-foreground">Chúng Tôi Cung Cấp Gì?</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="font-700">Gậy Golf:</strong> Các dòng gậy driver, iron, putter, wedge từ các thương hiệu hàng đầu.</li>
                    <li><strong className="font-700">Bóng Golf:</strong> Đa dạng chủng loại, phù hợp với mọi phong cách chơi.</li>
                    <li><strong className="font-700">Phụ kiện Golf:</strong> Từ găng tay, túi golf, mũ, đến kính và các vật dụng hỗ trợ khác.</li>
                    <li><strong className="font-700">Dịch vụ cá nhân hóa:</strong> Tùy chỉnh sản phẩm như bóng golf, áo golf, mũ golf theo yêu cầu của khách hàng.</li>
                  </ul>
                </div>

                <hr className="border-border/60 my-8" />

                {/* Section 4 */}
                <div className="mb-8">
                  <h3 className="text-[1.6rem] font-700 mb-4 text-foreground">Vì Sao Chọn GolfBy?</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li><strong className="font-700">Chất lượng hàng đầu:</strong> Sản phẩm nhập khẩu trực tiếp, đảm bảo chính hãng 100%.</li>
                    <li><strong className="font-700">Chuyên môn cao:</strong> Đội ngũ của chúng tôi am hiểu về golf, sẵn sàng tư vấn để bạn tìm được sản phẩm phù hợp nhất.</li>
                    <li><strong className="font-700">Dịch vụ độc quyền:</strong> Ngoài bán sản phẩm, chúng tôi còn cung cấp các dịch vụ như đặt trước sản phẩm mới, thửa gậy golf theo yêu cầu.</li>
                    <li><strong className="font-700">Uy tín & Minh bạch:</strong> GolfBy xây dựng niềm tin bằng sự minh bạch trong mọi giao dịch và chính sách hậu mãi.</li>
                  </ol>
                </div>

                <hr className="border-border/60 my-8" />

                {/* Section 5 */}
                <div>
                  <h3 className="text-[1.6rem] font-700 mb-4 text-foreground">Tầm Nhìn & Giá Trị Cốt Lõi</h3>
                  <ul className="list-[disc] pl-6 space-y-2">
                    <li><strong className="font-700">Tầm nhìn:</strong> Trở thành thương hiệu hàng đầu tại Việt Nam trong lĩnh vực phân phối và cung cấp sản phẩm, dịch vụ golf.</li>
                    <li><strong className="font-700">Giá trị cốt lõi:</strong> Chất lượng – Tận tâm – Uy tín.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
