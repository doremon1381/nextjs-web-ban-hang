'use client';
import { Phone, Mail, MapPin, Clock, Send, Facebook, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl text-[#1F5E3B] mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-xl text-[#1F2937] leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ để được tư vấn
              về sản phẩm nhãn lồng tươi và nhãn sấy tự nhiên.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-[#F7FFF8] rounded-3xl p-8 sticky top-24">
                <h2 className="text-2xl text-[#1F5E3B] mb-6">Thông tin liên hệ</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#43A047]" />
                    </div>
                    <div>
                      <h4 className="text-[#1F5E3B] mb-1">Hotline</h4>
                      <p className="text-[#1F2937]">0866.918.366</p>
                      <p className="text-sm text-[#6B7280]">Thứ 2 - Chủ nhật: 7:00 - 21:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#43A047]" />
                    </div>
                    <div>
                      <h4 className="text-[#1F5E3B] mb-1">Email</h4>
                      <p className="text-[#1F2937]">cskh@nhanviet.vn</p>
                      <p className="text-sm text-[#6B7280]">Phản hồi trong 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#43A047]" />
                    </div>
                    <div>
                      <h4 className="text-[#1F5E3B] mb-1">Địa chỉ</h4>
                      <p className="text-[#1F2937]">
                        Vườn nhãn Nhãn Việt<br />
                        Hưng Yên / Bắc Giang<br />
                        Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#43A047]" />
                    </div>
                    <div>
                      <h4 className="text-[#1F5E3B] mb-1">Giờ làm việc</h4>
                      <p className="text-[#1F2937]">Thứ 2 - Chủ nhật</p>
                      <p className="text-sm text-[#6B7280]">7:00 - 21:00</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
                  <h4 className="text-[#1F5E3B] mb-4">Kết nối với chúng tôi</h4>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#43A047] hover:text-white hover:border-[#43A047] transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#43A047] hover:text-white hover:border-[#43A047] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center hover:bg-[#43A047] hover:text-white hover:border-[#43A047] transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl text-[#1F5E3B] mb-2">Gửi tin nhắn cho chúng tôi</h2>
                <p className="text-[#6B7280] mb-8">
                  Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
                </p>

                {isSubmitted ? (
                  <div className="bg-[#DFF5E1] border border-[#43A047] rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-[#43A047] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl text-[#1F5E3B] mb-2">Cảm ơn bạn!</h3>
                    <p className="text-[#1F2937]">
                      Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-[#1F2937] mb-2">
                          Họ tên <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nhập họ và tên"
                          className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#1F2937] mb-2">
                          Số điện thoại <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Nhập số điện thoại"
                          className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#1F2937] mb-2">
                        Email <span className="text-[#DC2626]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Nhập địa chỉ email"
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#1F2937] mb-2">
                        Chủ đề <span className="text-[#DC2626]">*</span>
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="product">Tư vấn sản phẩm</option>
                        <option value="order">Đặt hàng số lượng lớn</option>
                        <option value="delivery">Giao hàng & vận chuyển</option>
                        <option value="quality">Chất lượng sản phẩm</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#1F2937] mb-2">
                        Nội dung <span className="text-[#DC2626]">*</span>
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Nhập nội dung tin nhắn của bạn"
                        rows={6}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      <span>Gửi tin nhắn</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#F7FFF8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F5E3B] mb-4">Vị trí vườn nhãn</h2>
            <p className="text-[#6B7280]">Vườn nhãn của chúng tôi tại Hưng Yên và Bắc Giang</p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#43A047] mx-auto mb-4" />
                <h3 className="text-2xl text-[#1F5E3B] mb-2">Vườn nhãn Nhãn Việt</h3>
                <p className="text-[#6B7280]">Hưng Yên / Bắc Giang, Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1F5E3B] mb-4">Câu hỏi thường gặp</h2>
            <p className="text-[#6B7280]">Giải đáp những thắc mắc phổ biến</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Thời gian giao hàng mất bao lâu?',
                a: 'Chúng tôi giao hàng trong vòng 1-3 ngày tùy khu vực. Nội thành Hà Nội có thể nhận hàng trong ngày nếu đặt trước 10h sáng.'
              },
              {
                q: 'Nhãn sấy có chất bảo quản không?',
                a: 'Không, nhãn sấy của chúng tôi được sấy khô hoàn toàn tự nhiên, không sử dụng bất kỳ chất bảo quản hay phụ gia nào.'
              },
              {
                q: 'Tôi có thể đặt hàng số lượng lớn không?',
                a: 'Có, chúng tôi hỗ trợ đặt hàng số lượng lớn cho doanh nghiệp, nhà hàng, khách sạn. Vui lòng liên hệ hotline để được tư vấn và báo giá.'
              },
              {
                q: 'Chính sách đổi trả như thế nào?',
                a: 'Chúng tôi hỗ trợ đổi trả trong 24h nếu sản phẩm bị hư hỏng trong quá trình vận chuyển hoặc không đúng chất lượng.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#F7FFF8] border border-[#E5E7EB] rounded-2xl p-6">
                <h4 className="text-lg text-[#1F5E3B] mb-2">{item.q}</h4>
                <p className="text-[#6B7280]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
