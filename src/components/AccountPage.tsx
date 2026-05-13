'use client';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Khách hàng',
    email: 'khachhang@example.com',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <section className="bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-[#43A047]" />
            </div>
            <div>
              <h1 className="text-3xl text-[#1F5E3B] mb-1">Tài khoản của tôi</h1>
              <p className="text-[#6B7280]">Quản lý thông tin cá nhân của bạn</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#43A047] to-[#388E3C] px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">Thông tin cá nhân</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#43A047] rounded-full hover:bg-[#F7FFF8] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm">Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#1F5E3B] mb-2">Họ và tên</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#1F5E3B] mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#1F5E3B] mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#1F5E3B] mb-2">Địa chỉ</label>
                    <textarea
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047] resize-none"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>Lưu thay đổi</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#E5E7EB] text-[#1F2937] rounded-full hover:bg-[#F7FFF8] transition-colors"
                    >
                      <X className="w-5 h-5" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#F7FFF8] rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-[#43A047]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Họ và tên</p>
                          <p className="text-lg text-[#1F5E3B] font-medium">{formData.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-[#F7FFF8] rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-[#43A047]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Số điện thoại</p>
                          <p className="text-lg text-[#1F5E3B] font-medium">{formData.phone || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-[#F7FFF8] rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#43A047]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Email</p>
                        <p className="text-lg text-[#1F5E3B] font-medium">{formData.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-[#F7FFF8] rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#43A047]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Địa chỉ</p>
                        <p className="text-lg text-[#1F5E3B] font-medium">{formData.address || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FFF8E7] to-[#DFF5E1] px-8 py-6">
              <h2 className="text-2xl text-[#1F5E3B]">Bảo mật</h2>
            </div>
            <div className="p-8">
              <button className="w-full md:w-auto px-8 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors">
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
