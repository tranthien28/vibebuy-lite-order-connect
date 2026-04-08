# VibeBuy System Documentation

Tài liệu này cung cấp cái nhìn tổng quan về hệ thống, phạm vi (scope) và cấu trúc thư mục của plugin **VibeBuy - Order via Messaging for WooCommerce**.

---

## 1. Tổng Quan Hệ Thống (System Overview)

**VibeBuy** là một công cụ chuyển đổi bán hàng (Chat-to-Buy) dành cho WooCommerce. Nó cho phép khách hàng đặt hàng nhanh chóng thông qua các nền tảng nhắn tin phổ biến (WhatsApp, Telegram, Discord, v.v.) thay vì quy trình checkout truyền thống.

### Mô hình hoạt động:
1. **Frontend**: Hiển thị nút "Order via Messaging" trên trang sản phẩm WooCommerce.
2. **Interaction**: Khi khách hàng nhấn nút, một Modal hiện ra để nhập thông tin (Tên, Số điện thoại, Số lượng, Ghi chú).
3. **Processing**: Dữ liệu được gửi về Server qua REST API, lưu trữ vào database để theo dõi (Inquiry/Lead).
4. **Redirection**: Sau khi lưu, khách hàng được chuyển hướng đến ứng dụng nhắn tin với nội dung tin nhắn được soạn sẵn chứa chi tiết đơn hàng.

---

## 2. Phạm vi Plugin (Plugin Scope)

Hệ thống được chia thành hai phần chính để quản lý tính năng và mô hình kinh doanh:

### A. VibeBuy Lite (`vibebuy-order-connect-lite`)
- **Core Engine**: Quản lý việc đăng ký các channel (WhatsApp, Telegram, Discord có sẵn miễn phí).
- **Basic Ordering**: Quy trình đặt hàng cơ bản qua các kênh đã chọn.
- **Inquiry Management**: Lưu trữ tối đa 10 leads gần nhất trong Dashboard.
- **Settings**: Cấu hình các số điện thoại, ID kênh và giao diện nút cơ bản.
- **WooCommerce Integration**: Tự động hook vào các vị trí tiêu chuẩn của WooCommerce.

### B. VibeBuy Pro (`vibebuy-order-connect-pro`)
Mở rộng tính năng từ bản Lite thông qua các filter và hook:
- **Unlimited Leads Storage**: Loại bỏ giới hạn 10 leads, lưu trữ và quản lý không giới hạn toàn bộ dữ liệu khách hàng. Export dữ liệu sang CSV dễ dàng.
- **Omnichannel Support**: Mở khóa toàn bộ 11+ kênh nhắn tin (Zalo, Messenger, TikTok, Instagram, Discord, v.v.).
- **Advanced Analytics**: Dashboard báo cáo dữ liệu thực tế 100%, biểu đồ nhiệt (Heatmap) khách hàng, và phân tích xu hướng theo giờ.
- **Granular Targeting**: Nhắm mục tiêu chi tiết theo Hệ điều hành (iOS, Android, Win, Mac), Trình duyệt (Chrome, Safari, Firefox), và Quốc gia.
- **Inventory Logic**: Tùy chỉnh hiển thị dựa trên ngưỡng tồn kho (Stock Threshold) - chỉ hiện nút khi kho còn dưới X sản phẩm.
- **Social Shortcut Bar**: Hiển thị thêm các icon nổi (Floating) cho các link mạng xã hội phụ mà không làm choán diện tích trang.
- **Business Scheduling**: Tự động bật/tắt widget theo khung giờ làm việc 7 ngày trong tuần và loại trừ các ngày nghỉ lễ (Holidays).
- **Premium Customization**: Tùy chỉnh mã màu Hex bất kỳ, Whitelabel hoàn toàn (Xóa "Powered by VibeBuy"), và chế độ hiển thị Smart Responsive.
- **Post-Submission Action**: Điều hướng khách hàng tới trang Cảm ơn (Thank-you page) hoặc URL tùy chỉnh sau khi gửi yêu cầu.

---

## 3. Cấu trúc Thư mục (File Structure)

Hệ thống tuân thủ cấu trúc chuẩn của WordPress Plugin kết hợp với quy trình phát triển hiện đại (Vite + React).

### Thư mục chính: `vibebuy-order-connect-lite`

```text
vibebuy-order-connect-lite/
├── assets/                 # Chứa các file JS/CSS đã được build (production)
├── inc/                    # Logic PHP xử lý Backend
│   ├── channels/           # Định nghĩa các kênh nhắn tin (Base, WhatsApp, ...)
│   ├── database/           # Xử lý DB (Schema, CRUD leads)
│   ├── integrations/       # Tích hợp với bên thứ 3 (WooCommerce, ...)
│   ├── class-vibebuy-admin.php     # Quản lý giao diện Admin WP
│   ├── class-vibebuy-api.php       # Định nghĩa REST API Endpoints
│   ├── class-vibebuy-frontend.php  # Xử lý hiển thị ngoài Frontend
│   ├── class-vibebuy-loader.php    # Khởi tạo và kết nối các thành phần
│   └── ...
├── src/                    # Source code React (Frontend)
│   ├── components/         # Các UI Components (Analytics, Modal, ...)
│   ├── widget/             # Logic xử lý Widget hiển thị ngoài web
│   ├── App.jsx             # Entry point cho React Admin
│   └── main.jsx            # Entry point cho React Widget
├── templates/              # File PHP templates dùng để render HTML
├── vibebuy-order-connect-lite.php # File khởi tạo chính của Plugin
├── vite.config.js          # Cấu hình Build cho React
└── tailwind.config.js      # Cấu hình Styling
```

### Thư mục chính: `vibebuy-order-connect-pro`

```text
vibebuy-order-connect-pro/
├── inc/
│   ├── class-vibebuy-pro-analytics.php # Logic xử lý dữ liệu báo cáo
│   ├── class-vibebuy-pro-api.php       # Pro Endpoints (Analytics data)
│   ├── class-vibebuy-pro-features.php  # Hook để mở khóa các tính năng Pro
│   └── class-vibebuy-pro-loader.php    # Khởi tạo các thành phần Pro
└── vibebuy-order-connect-pro.php       # File khởi tạo chính (Kiểm tra dependency Lite)
```

---

## 4. So sánh Lite vs Pro (Comparison)

Hệ thống được thiết kế theo mô hình "Freemium". Bản Lite cung cấp đủ các tính năng cốt lõi để bán hàng, trong khi bản Pro tập trung vào tự động hóa, tối ưu chuyển đổi và báo cáo nâng cao.

| Tính năng | VibeBuy Lite | VibeBuy Pro |
| :--- | :---: | :---: |
| **Kênh nhắn tin (Channels)** | WhatsApp, Telegram, Discord | **Full Channels (Zalo, Messenger,...)** |
| **Lưu trữ Leads** | Chỉ giữ 10 leads gần nhất | **Lưu trữ không giới hạn** |
| **Export Data (CSV)** | Không hỗ trợ | **Xuất Inquiries & Analytics sang CSV** |
| **Dữ liệu Analytics** | Dữ liệu mẫu (Professional Mock) | **Dữ liệu thực tế 100% (Real-time)** |
| **Biến nội dung (Live Tags)** | Cơ bản (Tên, SP, Giá) | **Nâng cao (SKU, Variation, Device)** |
| **Giờ làm việc (Schedule)** | Không có (Hiện 24/7) | **Tùy chỉnh theo khung giờ & Ngày lễ** |
| **Nhắm mục tiêu (Targeting)** | Tất cả khách hàng | **Theo Quốc gia, Thiết bị, Kho hàng** |
| **Whitelabel** | Hiện "Powered by VibeBuy" | **Ẩn Branding hoàn toàn** |

---

## 5. Ràng buộc & Cơ chế Mở khóa (Constraints & Unlocking)

Plugin sử dụng hệ thống **Filter Hooks** của WordPress để bản Pro có thể "ghi đè" các giới hạn của bản Lite mà không cần thay đổi code gốc của Lite:

### A. Giới hạn Kênh (Channel Limit)
Trong bản Lite, người dùng có thể cấu hình WhatsApp, Telegram và Discord, nhưng tại một thời điểm **chỉ được phép kích hoạt (Bật) duy nhất một kênh** để hiển thị trên website. Khi bật một kênh mới, kênh cũ sẽ tự động bộ tắt. 

Bản Pro sẽ loại bỏ giới hạn này, cho phép kích hoạt không giới hạn số lượng kênh cùng lúc (Omnichannel).

### B. Giới hạn Dữ liệu (Lead Cleanup)
Mỗi khi một inquiry mới được lưu, bản Lite sẽ chạy lệnh `DELETE` các bản ghi cũ nếu số lượng vượt quá 10. Bản Pro sẽ ngăn chặn hành động này, đảm bảo dữ liệu của bạn luôn được bảo toàn cho việc marketing sau này.

### C. Biến thể sản phẩm (Variations)
Bản Lite chỉ gửi tên sản phẩm chung. Bản Pro sử dụng Hook `vibebuy_template_replacements` để truy xuất sâu vào dữ liệu WooCommerce, lấy ra chính xác khách hàng đang chọn Size nào, Màu nào để gửi qua tin nhắn.

---

## 6. Cấu trúc Database & Settings (Database & Settings structure)

- **Backend**:
  - PHP >= 7.4
  - WordPress Hook System (Actions/Filters)
  - WP REST API
  - Custom Database Table (`wp_vibebuy_leads`)
- **Frontend**:
  - React.js (Chạy cả trong Admin Dashboard và Widget ngoài trang chủ)
  - Vite (Công cụ Build nhanh)
  - Tailwind CSS (Styling hiện đại)
  - Heroicons (Bộ icon tối giản)
- **Database Schema**:
  - `id`: Định danh lead.
  - `channel_id`: Kênh khách hàng chọn (whatsapp, telegram...).
  - `product_id`: Sản phẩm khách quan tâm.
  - `customer_name/email/phone`: Thông tin khách hàng.
  - `customer_country/ip`: Dữ liệu vị trí để phân tích.
  - `created_at`: Thời gian ghi nhận.

---

## 5. Cấu trúc Database & Settings (Database & Settings structure)

### A. Cấu hình Plugin (Settings)
Toàn bộ cài đặt của plugin được lưu trữ tập trung tại bảng `wp_options` của WordPress:
- **Key**: `vibebuy_lite_settings`
- **Kiểu dữ liệu**: Serialized Array (Mảng tuần tự hóa).
- **Nội dung**: Bao gồm các cấu hình về kênh nhắn tin (số điện thoại, token), giao diện (màu sắc, vị trí nút), và các logic điều khiển (bật/tắt auto-fill, auto-off).

### B. Lưu trữ Leads & Analytics (Database)
Plugin sử dụng một bảng cơ sở dữ liệu tùy chỉnh để lưu trữ mọi yêu cầu đặt hàng của khách:
- **Tên bảng**: `wp_vibebuy_leads` (với `wp_` là prefix của site).
- **Các trường quan trọng**:
    - `user_id`: ID của khách nếu họ đã đăng nhập.
    - `product_id`: ID của sản phẩm mà khách đang xem.
    - `customer_ip` & `customer_country`: Dùng để xác định vị trí khách hàng.
    - `channel_id`: Kênh khách chọn (whatsapp, telegram...).
    - `created_at`: Thời điểm phát sinh yêu cầu.

---

## 6. Cơ chế Analytics (How Analytics Works)

Hệ thống Analytics trong bản **Pro** không chỉ đơn thuần là liệt kê danh sách, mà thực hiện các truy vấn thời gian thực (Real-time) trên bảng `wp_vibebuy_leads`:

1.  **Conversion Rate (CR)**: Tính toán dựa trên tỷ lệ giữa số lượt nhấn nút (Clicks) và số Inquiry thực tế được lưu vào DB.
2.  **Top Products**: Hệ thống đếm tần suất xuất hiện của `product_id` trong bảng leads để biết sản phẩm nào đang "hot" trên các kênh nhắn tin.
3.  **Customer Distribution**: Sử dụng trường `customer_country` để vẽ bản đồ phân bố khách hàng toàn cầu.
4.  **Hourly Trends**: Phân tích trường `created_at` để xác định khung giờ khách hàng thường xuyên liên hệ nhất (Sáng, Trưa, Chiều, Tối).

---

## 7. Cơ chế Nhận diện Hội thoại (Conversation Logic)

Làm sao hệ thống hiểu khi nào có một hội thoại mới và nó thuộc về ai?

1.  **Product Context**: Mỗi khi khách nhấn nút "Order", Frontend sẽ tự động đính kèm `product_id` của trang hiện tại. Vì vậy, Admin luôn biết khách đang hỏi về sản phẩm nào.
2.  **User Tracking**:
    - Nếu khách **đã đăng nhập**: Hệ thống gắn `user_id` vào lead.
    - Nếu khách **vãng lai**: Hệ thống sử dụng IP Address (`customer_ip`) kết hợp với thông tin Phone/Email mà họ nhập để định danh.
3.  **Auto Re-fill**: Khi một khách hàng quay lại mua sản phẩm khác, hệ thống sẽ kiểm tra trong DB các lead cũ của IP/User đó để tự động điền (Auto-fill) tên và số điện thoại, giúp tăng trải nghiệm người dùng.
4.  **Duplicate Control**: Plugin có tùy chọn `orderModal_autoOff` (Tự động ẩn nút nếu đã gửi yêu cầu) hoặc `orderModal_allowRepeat` (Cho phép gửi lại nhiều lần) dựa trên việc tra cứu dữ liệu cũ trong bảng `wp_vibebuy_leads`.

---

## 9. Cấu trúc & Quy cách WordPress Plugin (Plugin Standards)

Để đảm bảo Plugin vận hành ổn định và được chấp nhận trên kho lưu trữ chính thức của WordPress, hệ thống tuân thủ các quy tắc sau:

### A. Cấu trúc file chuẩn (File Structure)
- **`uninstall.php`**: Một file bắt buộc để dọn dẹp sạch sẽ database (xóa bảng `leads` và các `options`) khi người dùng xóa plugin.
- **`languages/`**: Chứa các file `.pot`, `.po`, `.mo` để hỗ trợ đa ngôn ngữ (i18n).
- **`inc/`**: Tách biệt logic xử lý khỏi file khởi tạo chính.

### B. Quy tắc đặt tên (Naming Conventions)
- **Prefixing**: Toàn bộ class (`VibeBuy_`), hàm (`vibebuy_`), và hằng số (`VIBEBUY_`) đều được bắt đầu bằng tiền tố định danh duy nhất để tránh xung đột với các plugin khác.
- **Class naming**: Sử dụng định dạng `class-vibebuy-*.php` theo chuẩn WordPress Coding Standards.

### C. Bảo mật & Hiệu năng (Security & Performance)
- **Data Sanitization**: Mọi dữ liệu từ người dùng gửi về đều được lọc qua `sanitize_text_field`, `sanitize_email`, `rest_sanitize_boolean` trước khi lưu vào DB.
- **Data Escaping**: Dữ liệu hiển thị ra màn hình được bảo vệ bằng `esc_url`, `esc_attr`, `esc_html`.
- **Nonces & Permissions**: Sử dụng `wp_rest` nonces cho các request API và luôn kiểm tra `current_user_can('manage_options')` đối với các thao tác quản trị.
- **Prepared SQL**: Toàn bộ câu lệnh SQL đều sử dụng `$wpdb->prepare()` để chống lại tấn công SQL Injection.
- **Object Caching**: Sử dụng `wp_cache_get`/`set` cho các truy vấn nặng (như tính toán Leads hoặc Analytics) để giảm tải cho database.

### D. Internationalization (i18n)
Toàn bộ chuỗi văn bản trong code đều được bao bọc bởi hàm `__()` hoặc `_e()` với text-domain `vibebuy-order-connect-lite`, sẵn sàng cho việc dịch thuật ra bất kỳ ngôn ngữ nào.

---

> [!IMPORTANT]
> Hệ thống được xây dựng để đảm bảo tính **Forward Compatibility** (Tương thích ngược). Các thay đổi trong bản Lite sẽ không làm hỏng bản Pro và ngược lại, nhờ vào việc sử dụng triệt để hệ thống Hook của WordPress.

---

## 10. Luồng Dữ liệu (Data Flow)

1. **Khách hàng** điền form tại Frontend Widget.
2. JavaScript gửi `POST` request tới `/wp-json/vibebuy/v1/connect`.
3. **Backend (`VibeBuy_API`)**:
   - Kiểm tra tính hợp lệ.
   - Gọi `VibeBuy_DB::save_connection()` để lưu vào DB.
   - Trả về URL chuyển hướng (Deep link tới App nhắn tin).
4. **Frontend** nhận URL và thực hiện `window.location.href`.

---

> [!NOTE]
> Hệ thống được thiết kế theo hướng **Decoupled Architecture**, giúp bản Lite có thể chạy độc lập, và bản Pro chỉ đóng vai trò là một "Expansion Pack" bổ sung logic thông qua các Filter có sẵn trong bản Lite.

---

## 11. Kiến trúc Tiêm Tính năng (Pro Injection Architecture)

Hệ thống tuân thủ nghiêm ngặt mô hình **"Lite-centric with Pro Injection"**:
1. **Lite là cốt lõi**: Bản Lite chứa toàn bộ khung xương của hệ thống. Các giới hạn (như số lượng Leads, số lượng Channels) không được fix cứng mà được bao bọc bởi các **WordPress Filters**. 
   - Ví dụ: `apply_filters('vibebuy_lead_limit', 10)`.
2. **Pro là phần mở rộng**: Khi bản Pro được cài đặt, nó sẽ "tiêm" (inject) logic mới vào các filter này.
   - Ví dụ: `add_filter('vibebuy_lead_limit', '__return_false')` để loại bỏ giới hạn.
3. **Không sửa code gốc**: Bản Pro không bao giờ can thiệp trực tiếp vào file của bản Lite, đảm bảo việc cập nhật bản Lite không làm hỏng tính năng của Pro.

## 12. Xác thực Bản quyền & Kích hoạt (License & Activation)

Cơ chế bảo mật và kích hoạt tính năng Pro:
1. **Kiểm tra trạng thái**: Bản Lite chỉ mở khóa các tính năng nâng cao nếu nhận được tín hiệu `is_pro = true`.
2. **Xác thực License**: Tín hiệu `is_pro` chỉ được trả về khi:
   - Plugin VibeBuy Pro đang **Active**.
   - License Key đã được nhập và **xác thực thành công** với Server của VibeBuy.
3. **Gỡ bỏ nhãn PRO**: Khi license hợp lệ, hệ thống React sẽ tự động ẩn tất cả các nhãn "PRO" (badges) và các thông báo yêu cầu nâng cấp, mang lại trải nghiệm mượt mà cho người dùng trả phí.

## 13. Quy chuẩn UI Dashboard (Dashboard UI Standards)

Để đảm bảo trải nghiệm người dùng đồng nhất, hệ thống Dashboard tuân thủ các quy tắc thiết kế sau:
1. **Thành phần dùng chung (Global Classes)**: Các thẻ card, tiêu đề, ô nhập liệu và nhãn đều được định nghĩa tập trung trong `App.css`.
   - `.vb-section-card`: Bo góc 20px, shadow nhẹ, viền xám nhạt.
   - `.vb-page-title`: Font font-black, size XL, màu slate-900.
   - `.vb-input`: Nền xám nhạt (gray-50), focus có viền xanh dương.
2. **Đồng nhất giữa các Tab**: Toàn bộ các tab từ Dashboard, Inquiries đến Settings đều phải có cùng layout padding, cùng kiểu font chữ và tương tác hover.
3. **Live Preview Chính xác**: Trình xem trước (Live Preview) trong Admin phải mô phỏng chính xác 1:1 so với Widget ngoài Frontend, đặc biệt là cách xử lý **Sản phẩm đơn** và **Sản phẩm biến thể (WooCommerce Variations)**.
