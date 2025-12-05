# Feature Specification: FE-only E-Signature Web Application

**Feature Branch**: `001-fe-esignature-app`  
**Created**: 2025-11-05  
**Status**: Draft  
**Input**: User description: "Xây dựng ứng dụng ký điện tử phía frontend (FE-only) phục vụ cá nhân/doanh nghiệp ký và quản lý tài liệu. Mục tiêu: quy trình mời ký nhanh, trực quan, theo dõi trạng thái rõ ràng (Draft → Signing → Done)."

## Overview

Ứng dụng ký điện tử phía front-end cho phép người dùng cá nhân và doanh nghiệp tạo, gửi, ký và quản lý tài liệu điện tử. Ứng dụng tập trung vào trải nghiệm người dùng trực quan với quy trình ký đơn giản và theo dõi trạng thái tài liệu rõ ràng (Draft → Signing → Done). Front-end này giao tiếp với backend API để xử lý logic nghiệp vụ và lưu trữ dữ liệu.

**Key Value Propositions:**
- Quy trình mời ký nhanh chóng (≤ 3 bước chính)
- Giao diện trực quan, dễ sử dụng cho người không chuyên
- Theo dõi trạng thái tài liệu real-time
- Hỗ trợ đa người ký (tuần tự và song song)
- Audit trail đầy đủ cho mỗi tài liệu

**Actors:**
- **User**: Người dùng thông thường có thể tạo, ký và quản lý tài liệu của mình
- **Admin**: Quản trị viên hệ thống toàn cục (single global admin), có thể xem overview metrics và quản lý users cơ bản

## Clarifications

### Session 2025-11-05

- Q: Can the same email be invited multiple times as different signers? → A: No - Mỗi email chỉ được mời 1 lần. Validation sẽ chặn duplicate emails trong invite workflow để tránh confusion.
- Q: Timeline order preference - newest first or last? → A: Newest First - Timeline hiển thị events mới nhất ở trên cùng, giống social media feeds, để users thấy ngay latest updates.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tạo và quản lý chữ ký cá nhân (Priority: P1)

Người dùng cần có chữ ký cá nhân để sử dụng trong quá trình ký tài liệu. Họ có thể tạo nhiều mẫu chữ ký (vẽ tay hoặc gõ văn bản), xem trước, lưu trữ và chọn một mẫu làm mặc định cho việc ký nhanh.

**Why this priority**: Chữ ký cá nhân là tiên quyết cho mọi hoạt động ký tài liệu. Không có chữ ký, người dùng không thể thực hiện chức năng cốt lõi của ứng dụng. Đây là building block cơ bản nhất.

**Independent Test**: Có thể test độc lập bằng cách cho phép người dùng tạo, xem, chỉnh sửa và đặt chữ ký mặc định mà không cần có tài liệu nào. Delivers giá trị: người dùng có thể chuẩn bị chữ ký sẵn sàng trước khi nhận tài liệu cần ký.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập, **When** họ truy cập trang quản lý chữ ký, **Then** họ thấy giao diện tạo chữ ký mới với 2 tùy chọn: vẽ tay hoặc gõ văn bản
2. **Given** người dùng chọn vẽ tay, **When** họ vẽ chữ ký trên canvas, **Then** họ thấy preview chữ ký real-time và có thể lưu hoặc vẽ lại
3. **Given** người dùng chọn gõ văn bản, **When** họ nhập tên và chọn font chữ, **Then** họ thấy preview chữ ký dạng text được format và có thể lưu
4. **Given** người dùng đã có ≥2 mẫu chữ ký, **When** họ chọn một mẫu và đánh dấu "Set as Default", **Then** mẫu đó được đánh dấu mặc định và tự động điền vào các trường ký
5. **Given** người dùng xem danh sách chữ ký, **When** họ nhấn xem chi tiết một mẫu, **Then** họ thấy preview lớn và có thể chỉnh sửa hoặc xóa

---

### User Story 2 - Tải lên và chuẩn bị tài liệu để ký (Priority: P1)

Người tạo tài liệu có thể tải lên file PDF, xem trước nội dung đa trang, đặt các trường ký (Signature, Initials, Date, Text) vào vị trí cần thiết trên từng trang, điều chỉnh kích thước và căn chỉnh các trường này.

**Why this priority**: Đây là bước đầu tiên trong quy trình ký tài liệu. Không thể tiến hành ký nếu không có tài liệu và các trường ký được định vị. Core functionality của document editor.

**Independent Test**: Có thể test độc lập bằng cách upload PDF, đặt các field, lưu draft mà không cần mời người ký. Delivers giá trị: người dùng có thể chuẩn bị tài liệu hoàn chỉnh và lưu để sử dụng sau.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập, **When** họ chọn "Upload Document" và chọn file PDF, **Then** file được upload và hiển thị trong PDF viewer với tất cả các trang
2. **Given** PDF đang hiển thị trong editor, **When** người dùng kéo-thả một field "Signature" từ toolbar vào vị trí trên trang, **Then** field xuất hiện tại vị trí đó với handles để resize
3. **Given** một field đã được đặt, **When** người dùng kéo handles để thay đổi kích thước, **Then** field thay đổi kích thước mượt mà và vị trí được lưu
4. **Given** nhiều fields đã được đặt, **When** người dùng di chuyển qua các trang PDF, **Then** mỗi trang hiển thị đúng các fields đã được đặt trên trang đó
5. **Given** người dùng đã đặt xong các fields, **When** họ nhấn "Save as Draft", **Then** tài liệu được lưu với trạng thái "Draft" và hiển thị trong danh sách tài liệu

---

### User Story 3 - Mời người ký và quản lý workflow (Priority: P2)

Người tạo tài liệu có thể mời nhiều người ký tài liệu, chỉ định thứ tự ký (tuần tự hoặc song song), gán các trường ký cho từng người, và gửi lời mời qua email hoặc link.

**Why this priority**: Sau khi chuẩn bị tài liệu (P1), bước tiếp theo là phân phối đến người ký. Đây là cầu nối giữa người tạo và người ký, critical cho multi-party signing workflow.

**Independent Test**: Có thể test độc lập với tài liệu đã chuẩn bị (từ P1). Test bằng cách thêm signers, chỉ định thứ tự, gửi invitations và verify rằng notifications được gửi đi. Delivers giá trị: tài liệu được phân phối đến đúng người, đúng thứ tự.

**Acceptance Scenarios**:

1. **Given** tài liệu ở trạng thái Draft với fields đã đặt, **When** người dùng nhấn "Invite Signers", **Then** modal mở ra cho phép thêm email và tên người ký
2. **Given** modal invite đang mở, **When** người dùng thêm 3 người ký và chọn "Sequential Order", **Then** giao diện hiển thị thứ tự ký 1→2→3
3. **Given** danh sách signers đã có, **When** người dùng chọn một field và assign cho Signer 2, **Then** field đó được đánh dấu màu/icon của Signer 2
4. **Given** tất cả fields đã được assign, **When** người dùng nhấn "Send Invitations", **Then** emails/links được gửi đến người ký đầu tiên (nếu sequential) hoặc tất cả (nếu parallel)
5. **Given** invitations đã gửi, **When** người tạo xem document details, **Then** họ thấy trạng thái "Signing" và danh sách signers với status của từng người (Pending/Signed/Declined)

---

### User Story 4 - Người ký hoàn tất ký tài liệu (Priority: P1)

Người ký nhận được lời mời, mở Signing Room, xem tài liệu và các trường ký dành cho họ, điền thông tin và chữ ký, sau đó submit hoặc từ chối với lý do.

**Why this priority**: Đây là core action của người ký - action định nghĩa giá trị chính của ứng dụng. Không có signing flow, ứng dụng không hoàn thành mục đích. Critical path cho MVP.

**Independent Test**: Có thể test độc lập bằng cách tạo signing link với tài liệu có sẵn, mở link và thực hiện ký. Delivers giá trị: người ký hoàn thành nghĩa vụ ký tài liệu và tài liệu tiến triển trong workflow.

**Acceptance Scenarios**:

1. **Given** người ký nhận được email invitation, **When** họ click vào link, **Then** Signing Room mở ra với tài liệu hiển thị và các trường ký được highlight
2. **Given** Signing Room đang mở, **When** người ký xem tài liệu, **Then** họ chỉ thấy các trường ký được assign cho họ, không thấy trường của người khác
3. **Given** người ký click vào một trường Signature, **When** modal chọn chữ ký mở ra, **Then** họ có thể chọn chữ ký có sẵn hoặc vẽ/gõ mới
4. **Given** tất cả trường bắt buộc đã điền, **When** người ký nhấn "Complete Signing", **Then** tài liệu được submit, status của signer chuyển thành "Signed", và người ký tiếp theo (nếu sequential) nhận được notification
5. **Given** người ký xem tài liệu, **When** họ nhấn "Decline to Sign", **Then** modal yêu cầu lý do, sau khi submit thì document status chuyển thành "Declined" và owner nhận notification

---

### User Story 5 - Xem trạng thái và audit trail của tài liệu (Priority: P2)

Người dùng (cả owner và signers) có thể xem chi tiết trạng thái tài liệu (Draft/Signing/Done/Declined), theo dõi timeline các sự kiện (created/sent/opened/signed/declined), và tải xuống tài liệu đã hoàn tất.

**Why this priority**: Transparency và traceability quan trọng cho trust và compliance. Sau khi signing flow hoạt động (P1), việc theo dõi progress là điều users mong đợi tiếp theo.

**Independent Test**: Có thể test độc lập với tài liệu có sẵn events. Hiển thị document detail page với timeline và status. Delivers giá trị: users biết được tình trạng tài liệu và có audit trail cho compliance.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem danh sách tài liệu, **When** họ click vào một tài liệu, **Then** trang chi tiết mở ra hiển thị status badge (Draft/Signing/Done/Declined) rõ ràng
2. **Given** trang chi tiết đang mở, **When** người dùng scroll xuống timeline section, **Then** họ thấy danh sách events theo thứ tự thời gian (mới nhất trên cùng): created, sent to X, opened by X, signed by X, etc.
3. **Given** timeline đang hiển thị, **When** một signer ký tài liệu, **Then** event mới "Signed by [Name]" xuất hiện real-time trong timeline
4. **Given** tài liệu có status "Done", **When** người dùng nhấn "Download", **Then** file PDF đã ký được tải xuống với all signatures embedded (overlay)
5. **Given** tài liệu có status "Declined", **When** owner xem chi tiết, **Then** họ thấy lý do decline trong timeline event

---

### User Story 6 - Quản lý và tìm kiếm tài liệu (Priority: P2)

Người dùng có thể xem danh sách tất cả tài liệu của mình, lọc theo trạng thái (Draft/Signing/Done/Declined), tìm kiếm theo tên tài liệu, và sắp xếp theo ngày tạo/ngày sửa đổi.

**Why this priority**: Khi số lượng tài liệu tăng lên (sau khi P1 features được sử dụng), việc tổ chức và tìm kiếm trở nên cần thiết cho productivity. Essential cho long-term usage nhưng không blocking MVP.

**Independent Test**: Có thể test độc lập với dataset có sẵn các tài liệu ở nhiều trạng thái khác nhau. Test filter, search, sort functions. Delivers giá trị: users tìm được tài liệu cần thiết nhanh chóng.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập, **When** họ truy cập trang Documents, **Then** danh sách tài liệu hiển thị với columns: tên, trạng thái, ngày tạo, actions
2. **Given** danh sách documents đang hiển thị, **When** người dùng chọn filter "Status: Signing", **Then** chỉ các tài liệu có status "Signing" được hiển thị
3. **Given** người dùng gõ "contract" vào search box, **When** họ nhấn Enter, **Then** chỉ các tài liệu có tên chứa "contract" (case-insensitive) được hiển thị
4. **Given** danh sách có 50+ tài liệu, **When** người dùng click vào column header "Created Date", **Then** danh sách được sắp xếp theo ngày tạo (mới nhất/cũ nhất)
5. **Given** filters/search đang active, **When** người dùng nhấn "Clear Filters", **Then** tất cả tài liệu được hiển thị lại với state ban đầu

---

### User Story 7 - Đăng ký và xác thực người dùng (Priority: P1)

Người dùng mới có thể đăng ký tài khoản, đăng nhập/đăng xuất, reset mật khẩu khi quên, và xem/cập nhật thông tin hồ sơ cá nhân.

**Why this priority**: Authentication là gateway cho tất cả các features khác. Không thể sử dụng ứng dụng nếu không có account và login. Foundational requirement.

**Independent Test**: Có thể test độc lập toàn bộ auth flow mà không cần features khác. Test register, login, logout, forgot password, profile update. Delivers giá trị: users có thể access ứng dụng an toàn.

**Acceptance Scenarios**:

1. **Given** người dùng truy cập trang đăng ký, **When** họ điền email, mật khẩu, họ tên và nhấn "Register", **Then** account được tạo và họ được chuyển đến trang login hoặc tự động đăng nhập
2. **Given** người dùng đã có account, **When** họ nhập đúng email/password và nhấn "Login", **Then** họ được chuyển đến dashboard và session được lưu
3. **Given** người dùng đã login, **When** họ nhấn "Logout" ở navigation, **Then** session bị xóa và họ được chuyển về trang login
4. **Given** người dùng quên mật khẩu, **When** họ nhập email và nhấn "Send Reset Link", **Then** họ nhận email với link reset (hoặc hiển thị "email sent" message)
5. **Given** người dùng đã login, **When** họ truy cập Profile page và cập nhật tên/avatar, **Then** thông tin mới được lưu và hiển thị trên navigation

---

### User Story 8 - Admin Dashboard cơ bản (Priority: P3)

Admin (single global admin) có thể xem dashboard với overview metrics về usage của platform: total users, total documents, pending signatures.

**Why this priority**: Admin dashboard cung cấp insight về platform usage nhưng không critical cho MVP. Users có thể sử dụng app fully mà không cần admin dashboard.

**Independent Test**: Có thể test độc lập với mock metrics data. Test dashboard rendering và metrics display. Delivers giá trị: admin có visibility vào platform usage.

**Acceptance Scenarios**:

1. **Given** Admin đã login, **When** họ truy cập Admin Dashboard, **Then** họ thấy overview metrics cards: total users, total documents, pending signatures, documents created this month
2. **Given** Admin xem dashboard, **When** trang load, **Then** metrics được fetch từ API và hiển thị với số đếm chính xác
3. **Given** Admin xem dashboard, **When** họ chọn date range filter (e.g., "Last 7 days", "This month"), **Then** time-based metrics được cập nhật theo timeframe đã chọn
4. **Given** Dashboard đang hiển thị, **When** có document mới được tạo hoặc signed, **Then** metrics tự động refresh sau một khoảng thời gian (polling)
5. **Given** Admin click vào một metric card (e.g., "Total Documents"), **When** card được click, **Then** navigate đến documents list page với filter tương ứng (optional enhancement)

---

### Edge Cases

- **Concurrent editing**: Nếu 2 users cùng chỉnh sửa một document draft cùng lúc, làm thế nào xử lý conflicts? (Assumption: Last write wins, hoặc lock document khi đang edit)
- **Large PDF files**: Tài liệu PDF có >100 trang hoặc >20MB - làm thế nào đảm bảo performance loading và rendering? (Assumption: Pagination/lazy loading pages, file size limit ở backend)
- **Network interruption during signing**: Nếu người ký mất kết nối khi đang điền trường và submit - làm thế nào đảm bảo không mất dữ liệu? (Assumption: Auto-save draft locally, retry submission)
- **Invalid email addresses**: Khi owner mời người ký với email không hợp lệ - hệ thống thông báo lỗi ngay hay sau khi gửi? (Assumption: Validate format trước, bounce notifications sau)
- **Expired signing links**: Links mời ký có thời hạn không? Nếu có, điều gì xảy ra khi link hết hạn? (Assumption: Links expire sau N ngày, hiển thị "Link expired" page)
- **Empty signature fields**: Người ký submit mà bỏ trống fields bắt buộc - form validation phải chặn trước khi submit
- **Browser compatibility**: Signature canvas (vẽ tay) có hoạt động trên mobile browsers không? (Assumption: Support touch events, responsive design)
- **Duplicate signers**: Owner mời cùng một email 2 lần - hệ thống PHẢI ngăn chặn (validation chặn duplicate emails). Mỗi email chỉ được mời 1 lần per document để tránh confusion. User phải dùng email khác nếu muốn invite người đó với vai trò khác.
- **Document version control**: Nếu owner chỉnh sửa document sau khi đã gửi mời ký - những người đã mở link có thấy version mới không? (Assumption: Lock document khi status = Signing, không cho edit)
- **Timezone differences**: Timeline events hiển thị timezone nào khi users ở nhiều quốc gia khác nhau? (Assumption: Hiển thị theo timezone của user hiện tại, hoặc UTC)

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & User Management

- **FR-001**: Hệ thống PHẢI cho phép người dùng mới đăng ký tài khoản bằng email và mật khẩu
- **FR-002**: Hệ thống PHẢI validate email format và password strength (tối thiểu 8 ký tự)
- **FR-003**: Hệ thống PHẢI cho phép người dùng đăng nhập bằng email/password và tạo session
- **FR-004**: Hệ thống PHẢI cho phép người dùng đăng xuất và xóa session
- **FR-005**: Hệ thống PHẢI cung cấp chức năng "Forgot Password" với reset link gửi qua email
- **FR-006**: Người dùng PHẢI có thể xem và cập nhật thông tin hồ sơ cá nhân (tên, avatar, email)
- **FR-007**: Hệ thống PHẢI phân biệt 2 roles: User và Admin với guards ở cấp UI (không có backend enforcement trong scope này)

#### Signature Management

- **FR-008**: Người dùng PHẢI có thể tạo chữ ký bằng cách vẽ trên canvas (draw mode)
- **FR-009**: Người dùng PHẢI có thể tạo chữ ký bằng cách gõ văn bản với fonts có sẵn (type mode)
- **FR-010**: Hệ thống PHẢI cho phép lưu nhiều mẫu chữ ký cho mỗi người dùng
- **FR-011**: Người dùng PHẢI có thể chọn một mẫu chữ ký làm default
- **FR-012**: Hệ thống PHẢI hiển thị preview chữ ký real-time khi người dùng đang tạo
- **FR-013**: Người dùng PHẢI có thể xóa hoặc chỉnh sửa các mẫu chữ ký đã lưu
- **FR-014**: Chữ ký PHẢI được lưu dưới dạng image/SVG (không lưu trong local storage mà qua API)

#### Document Upload & Management

- **FR-015**: Hệ thống PHẢI cho phép người dùng upload file PDF (ưu tiên format, có thể support thêm formats sau)
- **FR-016**: Hệ thống PHẢI validate file type (PDF) và size (limit theo backend API)
- **FR-017**: Người dùng PHẢI thấy danh sách tất cả tài liệu của mình với columns: tên, trạng thái, ngày tạo
- **FR-018**: Hệ thống PHẢI hiển thị trạng thái tài liệu rõ ràng: Draft, Signing, Done, Declined
- **FR-019**: Người dùng PHẢI có thể lọc tài liệu theo trạng thái
- **FR-020**: Người dùng PHẢI có thể tìm kiếm tài liệu theo tên (case-insensitive, partial match)
- **FR-021**: Người dùng PHẢI có thể sắp xếp danh sách theo ngày tạo/ngày cập nhật
- **FR-022**: Hệ thống PHẢI hỗ trợ pagination cho danh sách tài liệu (handle hundreds of records)

#### PDF Editor & Field Placement

- **FR-023**: Hệ thống PHẢI hiển thị PDF viewer với tất cả các trang của tài liệu
- **FR-024**: Người dùng PHẢI có thể kéo-thả các field types (Signature, Initials, Date, Text) từ toolbar vào vị trí trên PDF
- **FR-025**: Mỗi field PHẢI có thể resize bằng cách kéo handles
- **FR-026**: Mỗi field PHẢI có thể di chuyển đến vị trí khác trên cùng trang
- **FR-027**: Hệ thống PHẢI lưu vị trí (x, y coordinates) và kích thước (width, height) của mỗi field relative to page
- **FR-028**: Người dùng PHẢI có thể xóa field đã đặt
- **FR-029**: Hệ thống PHẢI hiển thị visual indicators (grid/guides) để hỗ trợ alignment
- **FR-030**: PDF viewer PHẢI hỗ trợ zoom in/out và pan navigation
- **FR-031**: Fields trên các trang khác nhau PHẢI được lưu và hiển thị độc lập

#### Invite & Signing Workflow

- **FR-032**: Người tạo tài liệu PHẢI có thể thêm nhiều người ký với email và tên
- **FR-032a**: Hệ thống PHẢI validate và chặn duplicate email addresses - mỗi email chỉ được mời 1 lần per document
- **FR-033**: Người tạo PHẢI có thể chọn signing order: Sequential (tuần tự) hoặc Parallel (song song)
- **FR-034**: Người tạo PHẢI có thể assign từng field cho một signer cụ thể
- **FR-035**: Hệ thống PHẢI gửi invitation notification đến người ký (qua backend API)
  - Sequential: chỉ gửi cho người đầu tiên, những người sau nhận sau khi người trước sign
  - Parallel: gửi cho tất cả cùng lúc
- **FR-036**: Hệ thống PHẢI generate unique signing link cho mỗi signer
- **FR-037**: Signing Room PHẢI hiển thị PDF với chỉ các fields được assign cho signer hiện tại
- **FR-038**: Fields của signers khác PHẢI bị ẩn hoặc disabled trong Signing Room
- **FR-039**: Signer PHẢI có thể điền signature fields bằng cách chọn chữ ký có sẵn hoặc tạo mới
- **FR-040**: Signer PHẢI có thể điền date/text fields với keyboard input
- **FR-041**: Hệ thống PHẢI validate rằng tất cả required fields đã được điền trước khi cho phép submit
- **FR-042**: Signer PHẢI có thể "Decline to Sign" với lý do bắt buộc
- **FR-043**: Khi signer hoàn tất, document status PHẢI cập nhật và người tiếp theo (nếu sequential) PHẢI nhận notification
- **FR-044**: Khi tất cả signers hoàn tất, document status PHẢI chuyển thành "Done"
- **FR-045**: Khi có signer decline, document status PHẢI chuyển thành "Declined" và owner nhận notification

#### Audit Trail & Events

- **FR-046**: Hệ thống PHẢI ghi lại timeline events cho mỗi tài liệu: created, sent, opened, signed, declined
- **FR-047**: Mỗi event PHẢI có timestamp, actor (who), và action description
- **FR-048**: Timeline PHẢI hiển thị theo thứ tự thời gian với events mới nhất ở trên cùng (newest first), giống social media feeds, để users thấy ngay latest updates
- **FR-049**: Người dùng PHẢI có thể xem audit trail trong document detail page
- **FR-050**: Timeline PHẢI cập nhật real-time khi có events mới (via polling hoặc websocket)

#### Admin Features

- **FR-051**: Admin PHẢI thấy dashboard với overview metrics: total users, total documents, pending signatures, documents created this month
- **FR-052**: Admin PHẢI có thể filter metrics theo date range (last 7 days, this month, this year, custom range)
- **FR-053**: Metrics PHẢI được fetch từ backend API và update theo polling (every 30-60 seconds khi dashboard active)
- **FR-054**: Admin dashboard PHẢI có loading states và error handling cho metrics fetch failures

#### UI/UX Requirements

- **FR-057**: Ứng dụng PHẢI hỗ trợ đa ngôn ngữ (Vietnamese và English) với language switcher
- **FR-058**: Ứng dụng PHẢI hỗ trợ light mode và dark mode với theme toggle
- **FR-059**: Theme preference PHẢI được lưu và persist across sessions
- **FR-060**: Ứng dụng PHẢI responsive trên desktop, tablet, và mobile screens (mobile-first design)
- **FR-061**: Error messages PHẢI user-friendly, không hiển thị technical stack traces
- **FR-062**: Ứng dụng PHẢI hiển thị loading states (spinners, skeletons) khi đang fetch data
- **FR-063**: PDF viewer và drag-drop fields PHẢI hỗ trợ keyboard navigation
- **FR-064**: Interactive elements PHẢI có ARIA labels/roles/descriptions cho screen readers

#### Integration & API

- **FR-065**: Tất cả API calls PHẢI thông qua RTK Query với error handling thống nhất
- **FR-066**: API base URL PHẢI được cấu hình qua environment variable (`VITE_API_BASE_URL`)
- **FR-067**: Hệ thống PHẢI handle API errors gracefully với fallback UI
- **FR-068**: Authentication tokens PHẢI được quản lý an toàn (httpOnly cookies hoặc secure storage)
- **FR-069**: Hệ thống PHẢI sanitize tất cả user inputs để prevent XSS attacks

### Key Entities *(include if feature involves data)*

- **User**: Người dùng của hệ thống
  - Attributes: id, email, name, avatar, role (User/Admin)
  - Relationships: Có nhiều Signatures, Có nhiều Documents (as owner hoặc signer)

- **Signature**: Mẫu chữ ký cá nhân của user
  - Attributes: id, userId, type (draw/type), imageData (base64/URL), isDefault, createdAt
  - Relationships: Thuộc về một User

- **Document**: Tài liệu cần ký
  - Attributes: id, title, fileUrl, status (Draft/Signing/Done/Declined), ownerId, createdAt, updatedAt
  - Relationships: Thuộc về một User (owner), Có nhiều Fields, Có nhiều Signers, Có nhiều AuditEvents

- **Field**: Trường cần điền trên tài liệu (signature, initials, date, text)
  - Attributes: id, documentId, type (Signature/Initials/Date/Text), pageNumber, positionX, positionY, width, height, signerId, value (filled data), isRequired
  - Relationships: Thuộc về một Document, Được assign cho một Signer

- **Signer**: Người được mời ký tài liệu
  - Attributes: id, documentId, email, name, order (sequence number), status (Pending/Signed/Declined), signingUrl (unique link), declineReason
  - Relationships: Thuộc về một Document, Có nhiều Fields được assign

- **AuditEvent**: Sự kiện trong lifecycle của tài liệu
  - Attributes: id, documentId, eventType (created/sent/opened/signed/declined), actorId, actorEmail, timestamp, metadata
  - Relationships: Thuộc về một Document


## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng có thể hoàn tất quy trình mời ký (từ upload PDF đến gửi invitations) trong ≤ 3 bước chính và ≤ 5 phút
- **SC-002**: Người ký có thể hoàn tất việc ký tài liệu trên desktop browsers phổ biến (Chrome, Firefox, Safari, Edge) mà không gặp critical errors trong happy path
- **SC-003**: Trạng thái tài liệu (Draft → Signing → Done) cập nhật và hiển thị trên UI trong vòng ≤ 2 giây sau khi người dùng thực hiện action (giả định backend response time hợp lý)
- **SC-004**: Người dùng có thể tìm kiếm và lọc tài liệu trong danh sách có vài trăm mục (≤500 documents) với response time ≤ 1 giây
- **SC-005**: Vị trí và nội dung của fields trên PDF hiển thị nhất quán (pixel-perfect trong margin of error 2-3px) giữa Owner view (editor) và Signer view (signing room)
- **SC-006**: Ứng dụng hỗ trợ PDF tài liệu lên đến 50 trang và kích thước ≤ 10MB với performance chấp nhận được (page load ≤ 3s)
- **SC-007**: 95% người dùng thử nghiệm có thể hoàn tất việc tạo chữ ký đầu tiên trong ≤ 2 phút mà không cần hướng dẫn
- **SC-008**: Ứng dụng responsive tốt trên màn hình từ 320px (mobile) đến 2560px (large desktop) - các elements không bị overflow hoặc hidden
- **SC-009**: Keyboard navigation hoạt động cho tất cả critical workflows (login, signature creation, field placement, signing) - users có thể hoàn tất tasks chỉ với keyboard
- **SC-010**: Language switch (vi ↔ en) và Theme switch (light ↔ dark) hoạt động instant (≤ 500ms) và không gây re-fetch data không cần thiết

## Out of Scope

Các tính năng sau đây KHÔNG nằm trong phạm vi của giai đoạn này:

- **PKI Infrastructure**: Không implement real Public Key Infrastructure, certificates, hoặc cryptographic signatures
- **Timestamp Authority**: Không tích hợp timestamp server hoặc trusted timestamping
- **Legal Compliance**: Không đảm bảo tuân thủ pháp lý (eIDAS, ESIGN Act, UETA) - chỉ là UI/UX cho workflow ký
- **Private Key Management**: Không lưu trữ hoặc quản lý private keys trong front-end
- **Payment Integration**: Payment flows chỉ là placeholder UI, không có real payment gateway
- **eKYC/Identity Verification**: Không có tích hợp eKYC thật (chỉ giả định users đã verified)
- **CRM/ERP Integration**: Không tích hợp với external systems như Salesforce, SAP, etc.
- **Advanced OCR**: Không có automatic field detection bằng OCR - users phải manual place fields
- **Backend Development**: Front-end này consume existing backend API, không tự tạo backend
- **File Storage Service**: Không implement file storage - giả định backend handle việc lưu trữ PDFs
- **Email Service**: Không gửi email thực - giả định backend API handle email notifications
- **Mobile Native Apps**: Chỉ responsive web app, không có iOS/Android native apps
- **Offline Mode**: Không hỗ trợ offline signing hoặc local storage của documents
- **Bulk Operations**: Không có bulk send, bulk download, hoặc batch processing (có thể add trong phase sau)
- **Templates Library**: Không có pre-made document templates (có thể add sau)
- **Version Control**: Không có document versioning hoặc revision history trong phase này
- **Collaborative Editing**: Không có real-time collaborative editing của document draft
- **Advanced Analytics**: Admin dashboard chỉ có basic metrics, không có advanced analytics/reports

## Assumptions & Dependencies

### Assumptions

- Backend API đã tồn tại và cung cấp đầy đủ endpoints cho các chức năng trên
- Backend handle tất cả business logic validation, authorization, và data persistence
- Backend gửi email notifications và generate signing links
- Backend xử lý file upload/storage và PDF rendering
- Users sử dụng modern browsers (Chrome, Firefox, Safari, Edge - 2 versions gần nhất)
- Users có internet connection ổn định (không hỗ trợ offline mode)
- Authentication tokens được backend issue và front-end chỉ lưu trữ securely
- PDF files đã được validated ở backend (file type, size, không corrupted)
- Signing links có expiration time được backend quản lý
- Concurrent editing conflicts được backend xử lý (last write wins hoặc optimistic locking)

### Dependencies

- **Backend API**: Front-end hoàn toàn phụ thuộc vào backend API cho data và business logic
- **PDF.js hoặc tương tự**: Cần PDF rendering library để hiển thị PDF trong browser
- **Canvas API**: Cần HTML5 Canvas API cho signature drawing feature
- **React Router**: Routing và navigation
- **Redux Toolkit & RTK Query**: State management và API caching
- **Ant Design**: UI component library
- **Tailwind CSS**: Utility CSS framework
- **react-i18next**: Internationalization
- **Zod hoặc Yup**: Form validation schemas
- **Vitest + RTL + MSW**: Testing infrastructure

### Constraints

- **Browser Compatibility**: Chỉ support modern browsers, không support IE11 hoặc cũ hơn
- **File Format**: Ưu tiên PDF, có thể không support Word, Excel trong giai đoạn đầu
- **Performance**: PDF rendering có thể chậm với files rất lớn (>50 trang, >10MB) - cần có loading states
- **Security**: Client-side security chỉ là protective layer, không replace server-side validation
- **Accessibility**: Target WCAG 2.1 Level AA nhưng có thể có limitations với PDF viewer
- **Localization**: Chỉ support 2 ngôn ngữ (vi, en) trong phase 1
- **Mobile Experience**: Optimized cho desktop first, mobile có thể có limitations với complex PDF editing

## Reference Inspiration

- **UI/Flow Reference**: [Documenso](https://documenso.com/) - Tham khảo giao diện và luồng người dùng cho inspiration, KHÔNG sao chép mã nguồn

## Next Steps

1. ✅ **Clarification Phase**: COMPLETED - All clarifications resolved (Session 2025-11-05)
2. **Planning Phase**: Decompose requirements thành technical tasks và estimate efforts (Ready to proceed with `/speckit.plan`)
3. **Design Phase**: Create wireframes/mockups cho key screens và flows
4. **Implementation Phase**: Develop theo priority order (P1 → P2 → P3)
5. **Testing Phase**: Write và run tests theo acceptance scenarios
6. **Review Phase**: User testing và iterate based on feedback
