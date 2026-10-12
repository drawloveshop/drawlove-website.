# drawlove-website.

## Google Search

Website: https://drawlove226-netizen.github.io/drawlove-website./

Sitemap: https://drawlove226-netizen.github.io/drawlove-website./sitemap.xml

Đã thêm tiêu đề, mô tả, canonical, Open Graph và dữ liệu có cấu trúc WebSite/Organization. Không thêm giá hoặc đánh giá giả. Trong Google Search Console, thêm thuộc tính URL-prefix với đúng URL website, xác minh bằng thẻ HTML, gửi sitemap.xml và dùng URL Inspection để yêu cầu lập chỉ mục trang chủ. Giữ nguyên thẻ xác minh khi cập nhật website.

robots.txt chỉ có hiệu lực tại gốc hostname; file trong /drawlove-website./ không điều khiển Googlebot. Vì dự án là GitHub Pages dưới thư mục repository, không thêm robots.txt tại thư mục này. Google quyết định việc lập chỉ mục và thứ hạng; SEO và sitemap không đảm bảo kết quả tức thì.

Website giới thiệu DrawLove, chạy tĩnh trên GitHub Pages, không cần backend.

## Nội dung

- 6 danh mục: Locket Gold, CapCut, ChatGPT, Meitu, Wink, Gemini.
- Không hiển thị số tiền, giá gạch ngang hoặc giá khuyến mãi.
- Lời nhắc duy nhất về bảng giá: “Xem bảng giá tại tin nổi bật trên Instagram”.
- Mọi nút Chọn gói mở https://ig.me/m/drawlove.shop.226.
- Trang Instagram: https://www.instagram.com/drawlove.shop.226/.
- Không có giỏ hàng, thanh toán hoặc đặt hàng trực tiếp.
- 12 sản phẩm từ thông tin shop cung cấp: 6 Locket Gold, 2 CapCut, 1 ChatGPT, 1 Meitu, 1 Wink, 1 Gemini. Giữ nguyên thời lượng video, hạn sử dụng, số thiết bị và bảo hành được cung cấp; không thêm cam kết tính năng.
- Ảnh SVG tại gốc repository là minh họa danh mục do DrawLove sử dụng, có thể thay bằng ảnh sản phẩm chính thức sau.

## Bổ sung sản phẩm

Sửa mảng tương ứng trong `products.json`. Mỗi sản phẩm cần có `name`, `image`, `description`, `features`. Các thông số tùy chọn là `videoDuration`, `validity`, `warranty`; chỉ ghi những gì shop đã xác nhận. Ảnh nên đặt trong thư mục `images/`, sử dụng đường dẫn tương đối như `images/locket-01.jpg` để tương thích GitHub Pages dưới tên repository.

Không thêm trường giá hoặc số tiền vào dữ liệu. Giao diện chỉ đọc các trường đã liệt kê. Nút Chọn gói mở inbox và thẻ sản phẩm hiển thị tin nhắn gợi ý theo tên gói; không sử dụng tham số điền sẵn Instagram chưa được xác nhận.

## GitHub Pages

Trong Settings → Pages, chọn Deploy from a branch → main → / (root). Các file `index.html`, `styles.css`, `app.js`, `products.json` nằm tại gốc repository. Thay đổi trên main sẽ được GitHub Pages triển khai lại. Không có dependency npm hoặc bước build.

## Kiểm tra tại máy

Chạy máy chủ HTTP tĩnh trong thư mục dự án (ví dụ `python -m http.server 8000`) và mở http://localhost:8000. Không mở bằng file:// vì danh mục được tải qua fetch.

Kiểm tra cả 6 nút danh mục, trạng thái không có sản phẩm, liên kết Instagram và bố cục điện thoại/máy tính. Khi bổ sung dữ liệu, kiểm tra từng nút Chọn gói mở đúng tài khoản và thông số khớp nguồn của shop.

