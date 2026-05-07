import { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: 'DH001',
      date: '2026-05-05',
      status: 'completed',
      items: [
        { name: 'Nhãn lồng tươi loại 1 - 1kg', quantity: 2, price: 69000 },
        { name: 'Nhãn sấy dẻo - 500g', quantity: 1, price: 125000 }
      ],
      total: 263000
    },
    {
      id: 'DH002',
      date: '2026-05-06',
      status: 'shipping',
      items: [
        { name: 'Combo nhãn tươi + nhãn sấy', quantity: 1, price: 199000 }
      ],
      total: 199000
    },
    {
      id: 'DH003',
      date: '2026-05-07',
      status: 'pending',
      items: [
        { name: 'Nhãn lồng tươi nguyên chùm - 2kg', quantity: 1, price: 135000 },
        { name: 'Hộp quà nhãn sấy cao cấp', quantity: 1, price: 280000 }
      ],
      total: 415000
    }
  ];

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ xác nhận', color: 'text-[#F4B942]', bg: 'bg-[#FFF8E7]', icon: Clock };
      case 'confirmed':
        return { label: 'Đã xác nhận', color: 'text-[#43A047]', bg: 'bg-[#DFF5E1]', icon: CheckCircle };
      case 'shipping':
        return { label: 'Đang giao', color: 'text-[#2563EB]', bg: 'bg-blue-50', icon: Truck };
      case 'completed':
        return { label: 'Hoàn thành', color: 'text-[#43A047]', bg: 'bg-[#DFF5E1]', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'text-[#DC2626]', bg: 'bg-red-50', icon: XCircle };
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-[#43A047]" />
            </div>
            <div>
              <h1 className="text-3xl text-[#1F5E3B] mb-1">Đơn hàng của tôi</h1>
              <p className="text-[#6B7280]">Quản lý và theo dõi đơn hàng của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tabs */}
          <div className="bg-white rounded-3xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#43A047] text-white'
                    : 'text-[#1F2937] hover:bg-[#F7FFF8]'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-[#43A047] text-white'
                    : 'text-[#1F2937] hover:bg-[#F7FFF8]'
                }`}
              >
                Chờ xác nhận
              </button>
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeTab === 'confirmed'
                    ? 'bg-[#43A047] text-white'
                    : 'text-[#1F2937] hover:bg-[#F7FFF8]'
                }`}
              >
                Đã xác nhận
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeTab === 'shipping'
                    ? 'bg-[#43A047] text-white'
                    : 'text-[#1F2937] hover:bg-[#F7FFF8]'
                }`}
              >
                Đang giao
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 rounded-full transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-[#43A047] text-white'
                    : 'text-[#1F2937] hover:bg-[#F7FFF8]'
                }`}
              >
                Hoàn thành
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-xl text-[#1F5E3B] mb-2">Chưa có đơn hàng</h3>
              <p className="text-[#6B7280]">Bạn chưa có đơn hàng nào trong mục này</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div key={order.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-[#F7FFF8] to-[#FFF8E7] px-6 py-4 border-b border-[#E5E7EB]">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-[#6B7280]">Mã đơn hàng</p>
                            <p className="text-lg text-[#1F5E3B] font-medium">{order.id}</p>
                          </div>
                          <div className="h-8 w-px bg-[#E5E7EB]"></div>
                          <div>
                            <p className="text-sm text-[#6B7280]">Ngày đặt</p>
                            <p className="text-[#1F2937]">{new Date(order.date).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 ${statusInfo.bg} rounded-full`}>
                          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                          <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0">
                            <div className="flex-1">
                              <p className="text-[#1F5E3B] font-medium">{item.name}</p>
                              <p className="text-sm text-[#6B7280]">Số lượng: {item.quantity}</p>
                            </div>
                            <p className="text-[#1F5E3B] font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-[#E5E7EB]">
                        <p className="text-lg text-[#1F5E3B] font-medium">Tổng tiền:</p>
                        <p className="text-2xl text-[#DC2626] font-semibold">{formatPrice(order.total)}</p>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          <span>Xem chi tiết</span>
                        </button>
                        {order.status === 'completed' && (
                          <button className="flex-1 px-6 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                            Mua lại
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="px-6 py-3 border-2 border-[#DC2626] text-[#DC2626] rounded-full hover:bg-[#DC2626] hover:text-white transition-colors">
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#43A047] to-[#388E3C] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl text-white">Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg text-[#1F5E3B] mb-4">Thông tin đơn hàng</h4>
                <div className="space-y-3 bg-[#F7FFF8] rounded-2xl p-4">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Mã đơn hàng:</span>
                    <span className="text-[#1F5E3B] font-medium">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Ngày đặt:</span>
                    <span className="text-[#1F5E3B] font-medium">
                      {new Date(selectedOrder.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Trạng thái:</span>
                    <span className={`px-3 py-1 ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color} rounded-full text-sm font-medium`}>
                      {getStatusInfo(selectedOrder.status).label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg text-[#1F5E3B] mb-4">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-[#E5E7EB] last:border-0">
                      <div>
                        <p className="text-[#1F5E3B] font-medium">{item.name}</p>
                        <p className="text-sm text-[#6B7280]">x{item.quantity}</p>
                      </div>
                      <p className="text-[#1F5E3B] font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-[#E5E7EB] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl text-[#1F5E3B] font-medium">Tổng cộng:</span>
                  <span className="text-2xl text-[#DC2626] font-semibold">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
