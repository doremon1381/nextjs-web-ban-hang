Hãy đọc kỹ file `rule.md` trong dự án hiện tại trước khi làm.

Nhiệm vụ:
Bổ sung hệ thống “biến thể sản phẩm” cho website bán nhãn hiện tại.

Yêu cầu quan trọng:
- Chỉ làm theo `rule.md` và design system hiện tại.
- Không sửa những phần tôi đã chỉnh trước đó nếu không liên quan.
- Không redesign lại toàn bộ website.
- Không đổi màu, font, spacing, radius, shadow, header, footer, layout chính nếu không cần thiết.
- Chỉ bổ sung UI liên quan đến product variant/chọn biến thể sản phẩm.
- Không tự thêm chức năng ngoài phạm vi.
- Nếu có phần nào chưa chắc chắn hoặc không có trong design hiện tại, hãy giữ nguyên thiết kế hiện có và không tự sáng tạo quá xa.

Bối cảnh:
Website chỉ bán các sản phẩm liên quan đến nhãn:
1. Nhãn lồng tươi
2. Nhãn sấy
3. Combo / quà biếu nếu hiện tại website đã có

Vì sản phẩm có nhiều cách đóng gói/khối lượng khác nhau, cần bổ sung biến thể sản phẩm.

Ví dụ:
- Nhãn lồng tươi:
  - 1kg
  - 2kg
  - 5kg
  - Hộp quà

- Nhãn sấy:
  - Túi 250g
  - Túi 500g
  - Hộp quà

- Combo:
  - Combo dùng thử
  - Combo gia đình
  - Combo quà biếu

Mục tiêu:
Người dùng phải chọn đúng biến thể trước khi thêm sản phẩm vào giỏ hàng. Giỏ hàng và checkout phải hiển thị rõ sản phẩm đang chọn là biến thể nào.

---

# 1. Cập nhật Product Card

Ở các ProductCard hiện tại, hãy bổ sung cách hiển thị giá phù hợp với sản phẩm có nhiều biến thể.

Yêu cầu:
- Nếu sản phẩm có nhiều biến thể, hiển thị giá dạng:
  “Từ 69.000đ”
  hoặc
  “Từ 69.000đ / kg”
- Không cần hiển thị toàn bộ biến thể ngay trên card nếu làm card bị rối.
- Khi bấm vào ảnh sản phẩm hoặc tên sản phẩm, chuyển tới trang chi tiết sản phẩm.
- Nếu ProductCard có nút “Thêm vào giỏ”, hãy xử lý theo hướng:
  - Nếu chưa chọn biến thể, nút nên dẫn tới trang chi tiết sản phẩm hoặc mở phần chọn biến thể nếu design hiện tại có quick modal.
  - Không thêm sản phẩm vào giỏ một cách mơ hồ khi chưa biết khách chọn 1kg, 2kg, 500g hay hộp quà.

Ưu tiên:
- Card vẫn giữ giao diện gọn, sạch, giống hiện tại.
- Không làm card quá nhiều thông tin.

---

# 2. Cập nhật Product Detail Page

Nếu đã có Product Detail Page, hãy chỉnh trang đó.
Nếu chưa có Product Detail Page, hãy tạo frame mới theo đúng style hiện tại, nhưng chỉ trong phạm vi cần thiết cho product variant.

Trang chi tiết sản phẩm cần có khu vực chọn biến thể rõ ràng.

Trong phần thông tin sản phẩm, thêm block:

Tiêu đề:
“Chọn loại”

Hoặc theo từng sản phẩm:
- “Chọn khối lượng”
- “Chọn đóng gói”
- “Chọn biến thể”

UI biến thể nên dùng dạng card nhỏ hoặc pill button.

Ví dụ dạng card nhỏ:

[1kg]
69.000đ

[2kg]
135.000đ

[5kg]
320.000đ

[Hộp quà]
390.000đ

Yêu cầu UI:
- Biến thể đang chọn phải có trạng thái active rõ ràng.
- Active state dùng màu xanh chính của website.
- Default state nền trắng, border nhẹ.
- Disabled state nếu có thì dùng màu xám nhạt, chữ xám, không nổi bật.
- Khi chọn biến thể, giá chính bên trên phải tương ứng với biến thể đó.
- Đơn vị cũng phải tương ứng: kg, túi, hộp, combo.
- Nếu có giá cũ, hiển thị giá cũ cạnh giá mới.
- Nếu có tồn kho hoặc trạng thái còn hàng, hiển thị gần khu vực chọn biến thể.

Ví dụ hiển thị:

Tên sản phẩm:
Nhãn lồng tươi loại 1

Giá:
69.000đ / kg

Chọn loại:
[1kg] [2kg] [5kg] [Hộp quà]

Số lượng:
[-] 1 [+]

Button:
[Thêm vào giỏ]
[Mua ngay] nếu design hiện tại đã có

---

# 3. Quy tắc biến thể theo loại sản phẩm

Hãy dùng biến thể phù hợp với từng nhóm sản phẩm.

Với sản phẩm nhãn lồng tươi:
- 1kg
- 2kg
- 5kg
- Hộp quà

Thông tin nên thể hiện:
- Đơn vị: kg, túi, thùng, hộp
- Gợi ý nội dung: tươi trong ngày, đóng gói chống dập, phù hợp ăn gia đình/quà biếu

Với sản phẩm nhãn sấy:
- Túi 250g
- Túi 500g
- Hộp quà

Thông tin nên thể hiện:
- Đơn vị: túi, hộp
- Gợi ý nội dung: dẻo thơm, bảo quản lâu, không chất bảo quản nếu design hiện tại có nhắc

Với combo/quà biếu nếu đang có:
- Combo dùng thử
- Combo gia đình
- Combo quà biếu

Không bắt buộc thêm combo nếu trong giao diện hiện tại không có.

---

# 4. Cập nhật Cart Modal / Cart Drawer

Nếu thiết kế hiện tại có giỏ hàng, hãy cập nhật item trong giỏ để hiển thị biến thể.

Mỗi dòng sản phẩm trong giỏ cần hiển thị:
- Ảnh sản phẩm
- Tên sản phẩm
- Biến thể đã chọn
- Giá theo biến thể
- Số lượng
- Tổng tiền dòng hàng
- Nút tăng/giảm số lượng
- Nút xóa

Ví dụ:

Nhãn lồng tươi loại 1
Loại: 2kg
135.000đ / túi
Số lượng: [-] 1 [+]

Hoặc:

Nhãn sấy dẻo
Loại: Túi 500g
125.000đ / túi
Số lượng: [-] 2 [+]

Yêu cầu:
- Không chỉ hiển thị tên sản phẩm chung chung.
- Phải thấy rõ khách đã chọn biến thể nào.
- Nếu cùng một sản phẩm nhưng khác biến thể, phải hiển thị thành 2 dòng riêng trong giỏ.

Ví dụ:
- Nhãn lồng tươi loại 1 - 1kg
- Nhãn lồng tươi loại 1 - 2kg

Đây là 2 item khác nhau.

---

# 5. Cập nhật Checkout Summary

Nếu thiết kế hiện tại có checkout form hoặc order summary, hãy cập nhật phần tóm tắt đơn hàng.

Trong order summary, mỗi sản phẩm cần có:
- Tên sản phẩm
- Biến thể
- Số lượng
- Giá
- Thành tiền

Ví dụ:

Nhãn sấy dẻo
Túi 500g x 2
250.000đ

Nhãn lồng tươi loại 1
2kg x 1
135.000đ

Yêu cầu:
- Phần checkout phải rõ ràng để khách kiểm tra trước khi gửi đơn.
- Không làm thay đổi form checkout hiện tại nếu không cần.
- Chỉ bổ sung thông tin biến thể trong danh sách sản phẩm.

---

# 6. Cập nhật Orders / Order Detail nếu có

Nếu hiện tại website đã có trang đơn hàng hoặc modal chi tiết đơn hàng, hãy bổ sung hiển thị biến thể trong từng sản phẩm của đơn.

Ví dụ:

Mã đơn: #NV001
Sản phẩm:
- Nhãn lồng tươi loại 1
  Loại: 2kg
  Số lượng: 1
  Giá: 135.000đ

- Nhãn sấy dẻo
  Loại: Túi 500g
  Số lượng: 2
  Giá: 250.000đ

Nếu trang Orders không có trong Figma hoặc không liên quan, không cần tự tạo mới.

---

# 7. State cần thể hiện

Nếu design system hiện tại có state, hãy thể hiện các trạng thái sau:

Variant button/card:
- Default
- Hover nếu có trong design system
- Selected / Active
- Disabled / Out of stock nếu phù hợp

Quantity selector:
- Default
- Không cho giảm dưới 1
- Disabled nếu hết hàng nếu có

Add to cart:
- Default
- Hover
- Disabled nếu chưa chọn biến thể hoặc hết hàng

Không cần tạo loading/error phức tạp nếu design hiện tại chưa có.

---

# 8. Data model để Figma ghi chú cho developer

Hãy thêm ghi chú/spec ngắn trong Figma hoặc phần note cho developer rằng frontend cần data model dạng:

Product:
- id
- slug
- name
- description
- images
- category
- badge nếu có
- rating nếu có
- variants

ProductVariant:
- id
- name
- price
- oldPrice nếu có
- unit
- stock nếu có
- isDefault nếu có

CartItem:
- productId
- variantId
- name
- slug
- variantName
- price
- quantity
- image
- unit

Lưu ý:
Trong giỏ hàng, key duy nhất phải là productId + variantId, không chỉ là productId.

---

# 9. Không được làm

- Không đổi toàn bộ ProductCard nếu chỉ cần chỉnh nhẹ.
- Không sửa header/footer/global layout.
- Không thêm wishlist nếu chưa có.
- Không thêm review input nếu chưa có.
- Không thêm thanh toán online nếu chưa có.
- Không thêm admin nếu chưa có.
- Không tự tạo quá nhiều biến thể khiến UI rối.
- Không thay đổi nội dung/màu/font tôi đã chỉnh trước đó.

---

# 10. Output mong muốn

Sau khi hoàn thành, Figma cần có:

1. ProductCard cập nhật phù hợp với sản phẩm có biến thể.
2. Product Detail Page có phần chọn biến thể rõ ràng.
3. Cart Modal/Drawer hiển thị biến thể đã chọn.
4. Checkout Summary hiển thị biến thể.
5. Order Detail hiển thị biến thể nếu trong design hiện tại có Orders.
6. Các state cơ bản của variant selector:
   - Default
   - Selected
   - Disabled nếu có
7. Ghi chú ngắn cho developer về data model Product / ProductVariant / CartItem.

Yêu cầu cuối:
Hãy giữ nguyên style hiện tại, chỉ bổ sung product variant để website bán nhãn hoạt động đúng hơn.