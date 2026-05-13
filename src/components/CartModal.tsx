'use client';
import { X, Minus, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useCart } from '@/components/cart/CartProvider';

export function CartModal() {
  const { items, removeItem, updateQuantity, clearCart, total, isOpen, setIsOpen } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cod'
  });

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    clearCart();
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    setIsOpen(false);
  };

  const shippingFee = total >= 499000 ? 0 : 30000;
  const finalTotal = total + shippingFee;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-0 right-0 h-full bg-white w-full max-w-md z-50 shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl text-[#1F5E3B]">
                {checkoutStep === 'cart' && 'Giỏ hàng'}
                {checkoutStep === 'checkout' && 'Thanh toán'}
                {checkoutStep === 'success' && 'Đặt hàng thành công'}
              </Dialog.Title>
              <Dialog.Close className="text-[#6B7280] hover:text-[#1F2937]">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              {checkoutStep === 'cart' && 'Xem và quản lý sản phẩm trong giỏ hàng'}
              {checkoutStep === 'checkout' && 'Điền thông tin để hoàn tất đơn hàng'}
              {checkoutStep === 'success' && 'Đơn hàng của bạn đã được gửi thành công'}
            </Dialog.Description>

            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#6B7280] mb-4">Giỏ hàng của bạn đang trống</p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4 border-b border-[#E5E7EB] pb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-[#1F5E3B] text-sm mb-1">{item.name}</h4>
                            {item.variantName && (
                              <p className="text-xs text-[#6B7280] mb-1">Loại: {item.variantName}</p>
                            )}
                            <p className="text-sm text-[#DC2626] mb-2">{formatPrice(item.price)} / {item.unit}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 hover:bg-[#F7FFF8]"
                                >
                                  <Minus className="w-4 h-4 text-[#6B7280]" />
                                </button>
                                <span className="text-sm px-2">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1.5 hover:bg-[#F7FFF8]"
                                >
                                  <Plus className="w-4 h-4 text-[#6B7280]" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[#DC2626] hover:text-[#B91C1C]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-4 mb-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Tạm tính</span>
                        <span className="text-[#1F2937]">{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Phí giao hàng</span>
                        <span className={shippingFee === 0 ? 'text-[#43A047]' : 'text-[#1F2937]'}>
                          {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[#E5E7EB]">
                        <span className="text-[#1F5E3B]">Tổng tiền</span>
                        <span className="text-xl text-[#DC2626] font-semibold">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('checkout')}
                      className="w-full px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                    >
                      Tiến hành đặt hàng
                    </button>
                  </>
                )}
              </>
            )}

            {checkoutStep === 'checkout' && (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Địa chỉ giao hàng *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ chi tiết"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Ghi chú</label>
                  <textarea
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#1F2937] mb-3">Phương thức thanh toán</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F7FFF8]">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-[#43A047]"
                      />
                      <div>
                        <p className="text-sm text-[#1F2937]">Thanh toán khi nhận hàng</p>
                        <p className="text-xs text-[#6B7280]">Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F7FFF8]">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-[#43A047]"
                      />
                      <div>
                        <p className="text-sm text-[#1F2937]">Chuyển khoản ngân hàng</p>
                        <p className="text-xs text-[#6B7280]">Chuyển khoản trước khi giao hàng</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4 mb-4">
                  <h3 className="text-sm text-[#1F5E3B] font-medium mb-3">Đơn hàng của bạn</h3>
                  <div className="space-y-2 mb-4">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="text-[#1F2937]">{item.name}</p>
                          {item.variantName ? (
                            <p className="text-xs text-[#6B7280]">{item.variantName} x {item.quantity}</p>
                          ) : (
                            <p className="text-xs text-[#6B7280]">Số lượng: {item.quantity}</p>
                          )}
                        </div>
                        <span className="text-[#1F2937]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Tạm tính</span>
                      <span className="text-[#1F2937]">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Phí giao hàng</span>
                      <span className={shippingFee === 0 ? 'text-[#43A047]' : 'text-[#1F2937]'}>
                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#E5E7EB]">
                      <span className="text-[#1F5E3B] font-medium">Tổng tiền</span>
                      <span className="text-xl text-[#DC2626] font-semibold">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="flex-1 px-4 py-3 border-2 border-[#E5E7EB] text-[#1F2937] rounded-full hover:bg-[#F7FFF8] transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                  >
                    Gửi đơn hàng
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#DFF5E1] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-[#43A047]" />
                </div>
                <h3 className="text-2xl text-[#1F5E3B] mb-3">Đặt hàng thành công!</h3>
                <p className="text-[#6B7280] mb-8 max-w-sm mx-auto">
                  Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
                  Cảm ơn bạn đã tin tưởng Nhãn Việt!
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
