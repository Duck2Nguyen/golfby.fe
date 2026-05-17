'use client';

const deliveryCoverageRows = [
  ['Đà Nẵng', 'Huyện Hoàng Sa'],
  ['Hải Phòng', 'Đảo Bạch Long Vĩ'],
  ['Khánh Hòa', 'Huyện Trường Sa'],
  ['Kiên Giang', 'Huyện Bắc Ái'],
  ['Ninh Thuận', 'Huyện Cồn Cỏ'],
];

const deliveryTimeRows = [
  ['Nội tỉnh', '7-15 ngày làm việc'],
  ['Nội vùng', '7-15 ngày làm việc'],
  ['Liên vùng (giữa 3 thành phố HCM, Hà Nội và Đà Nẵng)', '7-15 ngày làm việc'],
  [
    'Liên vùng (từ 3 thành phố lớn HCM, Hà Nội, Đà Nẵng đến các thành phố khác thuộc vùng khác)',
    '10-20 ngày làm việc',
  ],
];

const returnConditions = [
  'Hàng đã mua không được trả lại.',
  'Khách hàng có thể đổi sản phẩm một lần duy nhất trong vòng 07 ngày kể từ ngày mua hàng, với điều kiện: không áp dụng cho các sản phẩm trong chương trình khuyến mãi.',
  'Điều kiện áp dụng chính sách đổi hàng: sản phẩm phải còn giữ hóa đơn bán hàng, còn nguyên nhãn mác, tem giá, không bị dơ bẩn, hư hỏng do tác động bên ngoài sau khi rời khỏi cửa hàng.',
  'Sản phẩm mua tại cửa hàng có thể đổi tại bất kỳ cửa hàng nào thuộc hệ thống GolfBy trên toàn quốc.',
  'Sản phẩm đổi phải có giá trị bằng hoặc cao hơn sản phẩm đã mua; trường hợp sản phẩm đổi có giá trị thấp hơn, GolfBy không hoàn trả phần tiền chênh lệch.',
];

const hcmDistricts = [
  'quận 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 Tân Bình, Bình Tân, Tân Phú, Phú Nhuận, Bình Thạnh, Gò Vấp, TP. Thủ Đức (Quận 2 cũ).',
];

const hanoiDistricts = [
  'Khu vực nội thành: Quận Ba Đình, Bắc Từ Liêm, Cầu Giấy, Đống Đa, Hà Đông, Hai Bà Trưng, Hoàn Kiếm, Hoàng Mai, Long Biên, Nam Từ Liêm, Tây Hồ, Thanh Xuân.',
  'Khu vực ngoại thành: Huyện Ba Vì, Chương Mỹ, Đan Phượng, Đông Anh, Gia Lâm, Hoài Đức, Mê Linh, Mỹ Đức, Phú Xuyên, Phú Thọ, Quốc Oai, Sóc Sơn, Thạch Thất, Thanh Oai, Thanh Trì, Thường Tín, Ứng Hòa.',
];

const shippingFeeSections = [
  {
    title: '1. Đối với khu vực Hà Nội, Hồ Chí Minh',
    items: [
      'Miễn phí giao hàng cho các đơn hàng có giá trị từ 3.000.000 VNĐ trở lên.',
      'Đối với các đơn hàng có giá trị dưới 3.000.000 VNĐ, GolfBy sẽ thông báo chi phí vận chuyển sau khi làm việc với đơn vị vận chuyển.',
      'Thời gian nhận hàng: từ 7 đến 15 ngày kể từ khi đặt hàng, không bao gồm ngày lễ và cuối tuần.',
    ],
  },
  {
    title: '2. Đối với các khu vực khác',
    items: [
      'Miễn phí giao hàng cho các đơn hàng có giá trị từ 3.000.000 VNĐ trở lên và có kích thước nhỏ gọn.',
      'Với các đơn hàng khác, chi phí vận chuyển sẽ được áp dụng dựa trên bảng giá của đơn vị vận chuyển.',
      'Thời gian giao hàng: dao động từ 10 đến 20 ngày kể từ thời điểm đặt hàng, tùy thuộc vào vị trí địa lý và số lượng sản phẩm.',
      'Trước khi giao hàng, GolfBy sẽ liên hệ xác nhận và thông báo chi phí vận chuyển để khách hàng nắm rõ.',
    ],
  },
];

function ShippingPolicyTab() {
  return (
    <div className="mx-auto max-w-[124rem] space-y-14 text-[1.4rem] leading-[2.3rem] text-[#5D5D5D]">
      <section className="space-y-5">
        <div className="space-y-4">
          <h3 className="text-[2.2rem] font-700 leading-[2.8rem] text-[#2B2B2B]">Trả hàng</h3>
          <p>
            Nhằm hỗ trợ Quý Khách Hàng trong quá trình sử dụng sản phẩm, GolfBy xin gửi đến quý khách chính
            sách đổi hàng như sau (áp dụng cho cả đơn hàng online và tại cửa hàng):
          </p>
        </div>

        <ol className="space-y-4 pl-5">
          {returnConditions.map((condition, index) => (
            <li key={condition} className="pl-2">
              <span className="font-700 text-[#3A3A3A]">{index + 1}. </span>
              {condition}
            </li>
          ))}
        </ol>

        <p>Rất mong Quý Khách Hàng thông cảm và tuân thủ chính sách để trải nghiệm mua sắm được tốt nhất!</p>
      </section>

      <section className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-[2.2rem] font-700 leading-[2.8rem] text-[#2B2B2B]">Chính sách giao hàng</h3>
          <p>
            Với mục tiêu mang đến sự tiện lợi và nhanh chóng cho khách hàng khi mua sản phẩm, GolfBy áp dụng
            chính sách vận chuyển như sau:
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[1.55rem] font-700 uppercase tracking-[0.04em] text-[#3B3B3B]">
            I. Quy định phạm vi giao hàng
          </h4>
          <p>
            www.golfby.com.vn phục vụ giao hàng cho Khách hàng trên toàn quốc, ngoại trừ một số khu vực sau:
          </p>

          <div className="overflow-hidden rounded-none border border-[#E8E8E8] bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F2F2F2] text-[#4B4B4B]">
                  <th className="px-5 py-4 font-700">Tỉnh</th>
                  <th className="px-5 py-4 font-700">Quận/Huyện</th>
                </tr>
              </thead>
              <tbody>
                {deliveryCoverageRows.map(([province, district], index) => (
                  <tr key={province} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'}>
                    <td className="px-5 py-4">{province}</td>
                    <td className="px-5 py-4">{district}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            (*) Trong các trường hợp có phát sinh dịch bệnh hoặc trong các trường hợp bất khả kháng tại thời
            điểm phát sinh theo quy định của cơ quan quản lý nhà nước, vùng giao hàng có thể thay đổi theo quy
            định của cơ quan quản lý nhà nước phát sinh trong khu vực này, www.golfby.com.vn được quyền từ
            chối giao hàng.
          </p>
          <p>
            (*) Đơn hàng sẽ được giao tới tận nhà của khách hàng, ngoại trừ các trường hợp như: khu vực văn
            phòng hạn chế ra vào, khu vực chung cư/cao tầng (chỉ phục vụ giao tại chân tòa nhà) hoặc bên trong
            các khu vực hạn chế đi lại (khu vực quân sự, biên giới, ...).
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[1.55rem] font-700 uppercase tracking-[0.04em] text-[#3B3B3B]">
            II. Quy định kiểm tra hàng hóa khi giao nhận
          </h4>
          <p>
            Nhằm đáp ứng nhu cầu và bảo vệ tối đa quyền lợi khách hàng khi sử dụng dịch vụ, chúng tôi triển
            khai chính sách hỗ trợ việc xem và kiểm tra hàng hóa khi giao hàng. Khách hàng khi nhận phải kiểm
            tra sơ bộ và ký vào biên bản đồng kiểm (nếu có).
          </p>
          <p>
            Khi nhận hàng từ nhân viên giao nhận, Khách hàng có thể mở niêm phong thùng hàng của
            www.golfby.com.vn để kiểm tra hàng hóa (số lượng, màu sắc, tình trạng, chủng loại, kích cỡ...).
          </p>
          <p className="font-700 italic text-[#2E2E2E]">
            Lưu ý: việc kiểm tra sẽ không bao gồm việc thử sản phẩm và kiểm tra sâu chi tiết của sản phẩm.
          </p>
          <p>
            Nếu nhân viên giao nhận không thực hiện đồng kiểm thì khách hàng có thể từ chối nhận sản phẩm tại
            thời điểm đó.
          </p>
          <p className="font-700 text-[#2E2E2E]">
            Khách hàng BẮT BUỘC phải chi trả chi phí vận chuyển nếu từ chối nhận hàng sau khi đã đồng kiểm đối
            với hình thức chuyển Hỏa Tốc.
          </p>
          <p>
            Khách hàng sử dụng tối đa quyền lợi trên trước khi nhận hàng để được hỗ trợ tốt nhất trong mọi
            tình huống nếu phát sinh yêu cầu đổi trả.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[1.55rem] font-700 uppercase tracking-[0.04em] text-[#3B3B3B]">
            III. Quy định thời gian giao hàng
          </h4>
          <p>Thời gian phục vụ giao hàng:</p>
          <p>Phục vụ giao hàng trong giờ hành chính từ thứ 2 đến thứ 7 (trừ Chủ nhật và ngày Lễ, Tết).</p>

          <div className="overflow-hidden rounded-none border border-[#E8E8E8] bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F2F2F2] text-[#4B4B4B]">
                  <th className="px-5 py-4 font-700">Khu vực</th>
                  <th className="px-5 py-4 font-700">Giao hàng tiêu chuẩn</th>
                </tr>
              </thead>
              <tbody>
                {deliveryTimeRows.map(([area, time], index) => (
                  <tr key={area} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]'}>
                    <td className="px-5 py-4">{area}</td>
                    <td className="px-5 py-4">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            (**) Chi tiết phân nội thành, ngoại thành: tùy vào từng nhà cung cấp dịch vụ vận chuyển sẽ có cách
            thức phân nội thành, ngoại thành khác nhau
          </p>

          <div className="space-y-4">
            <p className="font-700 text-[#2E2E2E]">Tại Hà Nội:</p>
            <ul className="space-y-2 pl-5">
              {hanoiDistricts.map(item => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>

            <p className="font-700 text-[#2E2E2E]">Tại Tp. Hồ Chí Minh:</p>
            <ul className="space-y-2 pl-5">
              {hcmDistricts.map(item => (
                <li key={item} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p>Tại các tỉnh, thành phố khác: tùy theo phạm vi quy định của đơn vị giao nhận.</p>

          <p className="space-y-2">
            Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ logistics về cung cấp chứng từ
            hàng hóa trong quá trình giao nhận:
          </p>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">
              Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ hàng hóa trong quá trình giao nhận.
            </li>
            <li className="list-disc">
              golfby.com.vn có trách nhiệm cung cấp đầy đủ và chính xác các chứng từ liên quan đến hàng hóa
              cho tổ chức cung cấp dịch vụ logistics và bên nhận hàng.
            </li>
            <li className="list-disc">
              Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi
              golfby.com.vn.
            </li>
            <li className="list-disc">
              Đơn vị vận chuyển sẽ chỉ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc Nguyên đai, nguyên
              kiện, cung cấp chứng từ là phiếu giao hàng trong đó có thông tin như: Thông tin người nhận (bao
              gồm: Tên người nhận, số điện thoại và địa chỉ người nhận, tên hàng hóa).
            </li>
            <li className="list-disc">
              Đơn vị vận chuyển có quyền và trách nhiệm cung cấp hóa đơn cho cơ quan quản lý nhà nước khi có
              yêu cầu.
            </li>
            <li className="list-disc">
              Trên bao bì tất cả các đơn hàng đều có thông tin: Tên người nhận, số điện thoại và địa chỉ người
              nhận.
            </li>
            <li className="list-disc">
              Để đảm bảo an toàn cho hàng hóa golfby.com.vn sẽ gửi kèm Phiếu bán hàng hợp lệ của sản phẩm
              trong bưu kiện (nếu có), sau khi khách hàng xác nhận golfby.com.vn sẽ xuất hóa đơn điện tử và
              gửi qua mail của khách hàng cung cấp.
            </li>
            <li className="list-disc">
              Hóa đơn tài chính hoặc phiếu bán hàng là căn cứ hỗ trợ quá trình xử lý khiếu nại như: xác định
              giá trị thị trường của hàng hóa, đảm bảo hàng hóa lưu thông hợp lệ v.v.
            </li>
          </ul>

          <p>
            Trường hợp phát sinh chậm trễ trong việc giao hàng hoặc sản phẩm không được bán quá 10 ngày khách
            hàng có thể hủy đơn hàng mà không chịu bất kỳ chi phí nào.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[1.55rem] font-700 uppercase tracking-[0.04em] text-[#3B3B3B]">
            IV. Quy định phí giao hàng
          </h4>

          {shippingFeeSections.map(section => (
            <div key={section.title} className="space-y-4">
              <p className="font-700 text-[#2E2E2E]">{section.title}</p>
              <ul className="space-y-2 pl-5">
                {section.items.map(item => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p>
            Lưu ý: Chính sách này nhằm đảm bảo dịch vụ giao hàng hiệu quả và minh bạch, đem đến trải nghiệm
            mua sắm tốt nhất cho quý khách hàng, không bao gồm ngày lễ và cuối tuần.
          </p>
          <p>Xin cảm ơn Quý Khách Hàng đã tin tưởng và ủng hộ GolfBy!</p>
        </div>
      </section>
    </div>
  );
}

export default ShippingPolicyTab;
