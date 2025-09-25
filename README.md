1. Vai trò
- Hà Ngọc Huy: FE
- Dương Đăng Quang: FE
- Hoàng Chí Thanh: FE
- Trần Hoàng Dũng: BE
- Hoàng Nhật Minh: BE
- Nguyễn Chiêu Văn: BE (leader)

2. Công cụ
- FE: React + Redux + ant design
- BE: Java Spring

3. Database: Postgres 
- Sử dụng superbase
- Mỗi bảng chỉ sử dụng với 1 mục đích
- Tên bảng là danh từ và viết hoa, có tiền tố là TBL_
Ví dụ: TBL_ADMIN (danh sách bảng admin)

4. Request + Repo trả về API dạng Json

5. Tạo nhánh của mình trên nhánh được giao có dạng: feature/back-end-vannc
- Khi push code lên phải có dạng <fix/modify/update/remove>[vannc]: nội dung
- Ví dụ: </.fix/.>[vannc]: sửa code login
- Phải pull code từ main về nếu leader bảo hoặc mỗi lần trước khi làm hay sau khi làm phải pull code mới nếu có

6. Chỉ được push lên nhánh của mình và tạo Pull request cho leader duyệt

7. Tài khoản:
- admin: vannc 
- user: 
- pass: 123456a@
- Không có form đăng ký, admin có chức năng tạo user
- Hoặc có form đăng ký nhưng admin duyệt

8. Nếu có ý kiến, ý tưởng hoàn thiện đề tài thì cần hỏi qua leader trước

9. Tên biến không cần sử dụng tiếng anh, dùng tiếng việt không dấu nếu cần

10. Link tài liệu: https://www.youtube.com/playlist?list=PLgYFT7gUQL8GUoIDh1p8FDXCmImzVVbRi

11. Đối với BE không được phép sửa file pom, nếu có thêm thì phải hỏi ý kiến của leader

12. BE và FE làm việc trong groupId sis.hust.edu.vn.digital_signature, không tạo thư mục hay package bừa bãi

13. Vì có những người đang đi làm có thể bị trùng nên BE sẽ có port là 5555, FE sẽ có port là 5556
