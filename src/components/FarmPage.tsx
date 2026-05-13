import { MapPin, Award, Users, Sprout, Clock, CheckCircle } from 'lucide-react';

interface FarmPageProps {
  onNavigateHome?: () => void;
}

export function FarmPage({ onNavigateHome }: FarmPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl text-[#1F5E3B] mb-6">Về Vườn Nhãn Của Chúng Tôi</h1>
            <p className="text-xl text-[#1F2937] leading-relaxed">
              Từ những vườn nhãn xanh mát ở Hưng Yên và Bắc Giang, chúng tôi mang đến
              những trái nhãn lồng tươi ngon nhất cho khách hàng khắp cả nước.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1563292385-961a21367e8f?w=800"
                alt="Vườn nhãn"
                className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <div className="inline-block px-4 py-1 bg-[#DFF5E1] text-[#43A047] rounded-full text-sm mb-4">
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-4xl text-[#1F5E3B] mb-6">
                Hành trình 20 năm phát triển vườn nhãn
              </h2>
              <p className="text-[#1F2937] mb-4 leading-relaxed">
                Nhãn Việt bắt đầu từ một vườn nhãn nhỏ tại Hưng Yên năm 2004. Với tình yêu
                và tâm huyết dành cho nghề trồng nhãn, chúng tôi đã không ngừng học hỏi,
                cải tiến kỹ thuật canh tác để mang đến những trái nhãn lồng chất lượng cao nhất.
              </p>
              <p className="text-[#1F2937] mb-6 leading-relaxed">
                Ngày nay, chúng tôi tự hào là một trong những đơn vị hàng đầu chuyên cung cấp
                nhãn lồng tươi và nhãn sấy tự nhiên. Mỗi trái nhãn đều được chăm sóc tận tâm
                từ khâu trồng, thu hoạch đến đóng gói và giao hàng.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#43A047]" />
                  </div>
                  <div>
                    <h4 className="text-[#1F5E3B] mb-1">20+ năm kinh nghiệm</h4>
                    <p className="text-sm text-[#6B7280]">Trồng và chăm sóc nhãn lồng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#43A047]" />
                  </div>
                  <div>
                    <h4 className="text-[#1F5E3B] mb-1">50+ hecta vườn nhãn</h4>
                    <p className="text-sm text-[#6B7280]">Tại Hưng Yên và Bắc Giang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Features */}
      <section className="py-16 bg-[#F7FFF8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F5E3B] mb-4">Đặc điểm vườn nhãn của chúng tôi</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Chúng tôi áp dụng quy trình canh tác khoa học, kết hợp giữa kinh nghiệm
              truyền thống và công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#DFF5E1] rounded-full flex items-center justify-center mb-6">
                <Sprout className="w-8 h-8 text-[#43A047]" />
              </div>
              <h3 className="text-xl text-[#1F5E3B] mb-3">Canh tác hữu cơ</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Sử dụng phân bón hữu cơ, hạn chế hóa chất, đảm bảo nhãn lồng tươi ngon
                và an toàn cho sức khỏe người tiêu dùng.
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#DFF5E1] rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-[#43A047]" />
              </div>
              <h3 className="text-xl text-[#1F5E3B] mb-3">Thu hoạch đúng mùa</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Chỉ thu hái khi nhãn chín tới, đảm bảo độ ngọt tự nhiên, cùi dày, hạt nhỏ,
                mang lại trải nghiệm tuyệt vời nhất.
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#DFF5E1] rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-[#43A047]" />
              </div>
              <h3 className="text-xl text-[#1F5E3B] mb-3">Đội ngũ chuyên nghiệp</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Nông dân giàu kinh nghiệm, được đào tạo bài bản, luôn tận tâm chăm sóc
                từng cây nhãn như con cái của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F5E3B] mb-4">Quy trình sản xuất</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Từ vườn nhãn đến tay khách hàng, mỗi công đoạn đều được kiểm soát chặt chẽ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Trồng & chăm sóc',
                desc: 'Chăm sóc cây nhãn theo quy trình khoa học, sử dụng phân bón hữu cơ, tưới nước đúng thời điểm.',
                icon: Sprout
              },
              {
                step: '02',
                title: 'Thu hoạch',
                desc: 'Thu hái nhãn vào buổi sáng sớm khi quả chín tới, tránh va đập, giữ nguyên cành lá.',
                icon: CheckCircle
              },
              {
                step: '03',
                title: 'Chọn lọc & phân loại',
                desc: 'Phân loại theo kích cỡ, loại bỏ quả hỏng, đảm bảo chỉ những trái nhãn đạt chuẩn được đóng gói.',
                icon: Award
              },
              {
                step: '04',
                title: 'Đóng gói & vận chuyển',
                desc: 'Đóng gói cẩn thận, bảo quản lạnh, vận chuyển nhanh để giữ độ tươi ngon tối đa.',
                icon: Clock
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative">
                  <div className="bg-[#F7FFF8] border border-[#E5E7EB] rounded-2xl p-6 h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#43A047] text-white rounded-full text-lg mb-4">
                      {item.step}
                    </div>
                    <Icon className="w-8 h-8 text-[#43A047] mb-3" />
                    <h4 className="text-lg text-[#1F5E3B] mb-2">{item.title}</h4>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-[#F7FFF8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F5E3B] mb-4">Hình ảnh vườn nhãn</h2>
            <p className="text-[#6B7280]">Khám phá vẻ đẹp của vườn nhãn Việt</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <img
              src="https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=600"
              alt="Vườn nhãn 1"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1589880771001-900e13363980?w=600"
              alt="Vườn nhãn 2"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=600"
              alt="Vườn nhãn 3"
              className="w-full h-80 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#DFF5E1] to-[#FFF8E7]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl text-[#1F5E3B] mb-4">
            Trải nghiệm nhãn lồng tươi từ vườn
          </h2>
          <p className="text-lg text-[#1F2937] mb-8">
            Đặt hàng ngay hôm nay để nhận nhãn lồng tươi ngon, được thu hoạch trong ngày
          </p>
          <button
            onClick={onNavigateHome}
            className="px-10 py-4 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-lg"
          >
            Đặt hàng ngay
          </button>
        </div>
      </section>
    </div>
  );
}
