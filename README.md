# 🩺 SứcKhỏe AI

Ứng dụng web (thuần HTML/CSS/JS, không cần backend) giúp:

1. **Phân tích triệu chứng** người dùng nhập (cùng tuổi, nhiệt độ, thai kỳ, dị ứng) để gợi ý các bệnh có khả năng.
2. **Gợi ý nhóm thuốc** thường dùng (chỉ nhóm/hoạt chất không kê đơn; kháng sinh luôn yêu cầu đơn bác sĩ), tự loại thuốc không phù hợp (vd. NSAID với sốt xuất huyết, trẻ <12 tuổi, thai phụ).
3. **Cảnh báo cấp cứu** khi có dấu hiệu nguy hiểm (gọi 115).
4. **Tìm bệnh viện, phòng khám, nhà thuốc trong bán kính tối đa 10 km** quanh vị trí người dùng (GPS hoặc nhập địa chỉ), hiển thị bản đồ, khoảng cách, số điện thoại và chỉ đường.

> ⚠️ **Miễn trừ trách nhiệm:** Đây là công cụ tham khảo, **không phải chẩn đoán y khoa** và không thay thế bác sĩ. Bộ luật chấm điểm trong `src/knowledge.js` là bản đơn giản hoá, cần bác sĩ chuyên môn rà soát trước khi dùng thực tế.

## Chạy thử
```bash
npm start        # hoặc: python3 -m http.server 8000
npm test         # chạy test (Node >= 18)
```
Mở `http://localhost:8000`. Định vị GPS cần `https` hoặc `localhost`.

## Cấu trúc
| File | Vai trò |
|---|---|
| `src/knowledge.js` | Triệu chứng, bệnh, nhóm thuốc, dấu hiệu nguy hiểm |
| `src/engine.js` | Chấm điểm bệnh + điều chỉnh theo hồ sơ |
| `src/geo.js` | Overpass API (OpenStreetMap), Nominatim, Haversine, giới hạn 10 km |
| `src/app.js`, `index.html`, `style.css` | Giao diện |

## Quyền riêng tư
Phân tích chạy hoàn toàn trên trình duyệt. Chỉ toạ độ vị trí được gửi tới Overpass/Nominatim (OpenStreetMap) để tìm địa điểm; không lưu dữ liệu sức khoẻ.

## Hướng phát triển
Mở rộng cơ sở tri thức cùng chuyên gia y tế, thêm tiếng Anh, tích hợp mô hình ML/LLM có kiểm chứng, dữ liệu nhà thuốc chính thức (Sở Y tế).

Giấy phép: MIT
