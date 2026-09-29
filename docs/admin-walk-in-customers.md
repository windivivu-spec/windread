# Lịch vãng lai và hồ sơ khách hàng

## Tại quầy

1. Trong **Admin → Lịch hẹn**, chọn **Khóa giờ nhanh**. Chọn trực tiếp một trong bảy thợ, nhập giờ và chọn phút theo nấc 15 (mặc định 3 giờ), rồi khóa giờ từ lúc hiện tại. Thời lượng từ 15 phút đến 6 giờ. Cơ sở được xác định theo thợ, độc lập với bộ lọc lịch. Tên và số điện thoại có thể để trống.
2. Lượt vãng lai xuất hiện trên cùng lịch với booking online. Hệ thống từ chối nếu khoảng giờ đã có lịch của thợ, kể cả khoảng đệm 10 phút. Không cần chọn dịch vụ lúc khóa giờ.
3. Khách đặt lịch đến trễ: theo chính sách đang hiển thị cho khách, sau 15 phút nhân viên dùng **Hủy do đến trễ**. Nếu khách vẫn được nhận phục vụ, chọn **Tạo lượt vãng lai** từ lịch đã hủy. Lịch cũ được giữ để tra cứu; lượt mới bắt đầu ở thời điểm thao tác. Nếu giờ vừa trống đã được người khác đặt, thao tác khóa giờ bị từ chối và phải sắp xếp thợ hoặc giờ khác.
4. Khi phục vụ xong, chọn **Hoàn tất phục vụ**. Chỉ lúc này hệ thống mới tự ghi nhận hồ sơ khách có số điện thoại hợp lệ. Khách không để lại số điện thoại vẫn có lịch vãng lai, nhưng không tạo hồ sơ liên hệ.

## Hồ sơ khách

- **Admin → Khách hàng** chỉ hiện khách đã có lượt phục vụ hoàn tất hoặc hóa đơn hoàn tất. Booking chờ, bị hủy và booking spam không tự trở thành hồ sơ chăm sóc.
- Số điện thoại sau khi bỏ ký tự định dạng là khóa duy nhất; những lần phục vụ sau cập nhật cùng hồ sơ. View hiện hiển thị liên hệ, số lượt phục vụ và lần ghé gần nhất. Thu ngân và Hóa đơn được tạm ẩn khỏi Admin.
- Migration cũ đã nhập một số khách từ booking chưa phục vụ. Migration mới giữ nguyên các bản ghi lịch sử đó nhưng ẩn khỏi view khách hàng cho tới khi có phục vụ hoàn tất; không xóa dữ liệu hiện có.

## Triển khai

Áp dụng `supabase/migrations/20260928050000_walk_in_booking_and_served_customers.sql` trước khi đưa code admin mới lên môi trường chạy. Migration thêm loại lịch vãng lai, kiểm tra trùng giờ theo thợ và trigger ghi nhận khách sau hoàn tất. Sau khi triển khai, kiểm tra một lượt vãng lai, một lượt trùng giờ bị từ chối, một lượt hoàn tất và một khách xuất hiện trong Admin → Khách hàng.
