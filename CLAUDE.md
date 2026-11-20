# CLAUDE.md – repo homecare (Công cụ điều phối zone – Axel Homecare)

Hệ thống điều phối khám tại nhà cho Axel Homecare. Trung tâm: Phòng khám Đa khoa Hồng Lạc, 177 Nguyễn Chí Thanh, P. Chợ Lớn, TP.HCM (10.758815, 106.663633). Bán kính phục vụ 12 km.
Tài liệu gốc: `docs/plan.md`. Khi có mâu thuẫn, plan.md là chuẩn. Nếu cần thay đổi plan, hỏi trước rồi mới sửa.

## Ngôn ngữ
- Trao đổi với người dùng, viết mô tả PR và commit message bằng **tiếng Việt**.
- Tên biến, hàm, bảng, cột viết bằng tiếng Anh.
- Mọi chữ hiển thị trên giao diện phải đi qua i18n (`packages/i18n/vi.json`, `en.json`). Không viết cứng chữ trong component.

## Stack
- Monorepo pnpm + turborepo.
- `apps/web`: Next.js 15, TypeScript, Tailwind, next-intl. Gồm web điều phối và PWA nhân viên ở route group `/staff`.
- `apps/api`: NestJS, REST, OpenAPI.
- `packages/db`: Prisma + SQL migration viết tay cho PostGIS, RLS, trigger.
- `packages/domain`: logic thuần, không I/O (slot, availability, scoring, zone).
- `packages/map-provider`: interface `MapProvider` + `VietmapProvider` (chính), `TomTomProvider` (dự phòng), `FakeProvider` (test).
- `workers`: BullMQ (pdf, excel, zalo, routing-prefetch).
- Hạ tầng: PostgreSQL 16 + PostGIS + pgcrypto, Redis 7, object storage S3-compatible. Chạy local bằng `infra/docker-compose.yml`.

## Lệnh thường dùng
```bash
pnpm i
docker compose -f infra/docker-compose.yml up -d   # postgres, redis, minio
pnpm db:migrate && pnpm db:seed
pnpm dev            # web + api
pnpm test           # unit (vitest/jest)
pnpm test:e2e       # playwright
pnpm lint && pnpm typecheck
```
Cập nhật mục này nếu lệnh thay đổi.

## QUY TẮC BẮT BUỘC (không được vi phạm)

### Dữ liệu & bảo mật
1. **Không dùng dữ liệu bệnh nhân thật** trong repo, seed, test, fixture, log hay ảnh chụp màn hình. Chỉ dùng dữ liệu giả (họ tên giả, SĐT dạng `0900000xxx`).
2. **Không commit bí mật**: API key, mật khẩu, khóa mã hóa. Dùng `.env` (đã có trong `.gitignore`) và luôn cập nhật `.env.example`.
3. Các trường **dữ liệu sức khỏe** phải mã hóa ở tầng ứng dụng bằng AES-256-GCM, qua `packages/crypto`:
   - bệnh nền, dị ứng chi tiết, thuốc đang dùng, lý do khám, y lệnh, ghi chú sau khám.
   - Khóa lấy từ KMS / biến môi trường, không bao giờ hard-code.
4. **SĐT** lưu 3 dạng:
   - `phone_enc` (mã hóa),
   - `phone_hash` (HMAC-SHA256 của số đã chuẩn hóa, dùng để tra cứu),
   - `phone_masked` (dạng `090****456`).
   API mặc định chỉ trả SĐT đã che. Muốn xem số đầy đủ phải gọi `POST /patients/:id/reveal-phone` (có ghi nhật ký).
5. Mọi thao tác **ghi** và mọi thao tác **đọc dữ liệu nhạy cảm** đều ghi `audit_log`:
   - xem hồ sơ, hiện SĐT, xuất Excel/PDF, đăng nhập/đăng xuất, sửa/hủy/xóa.
   - Ghi qua `AuditInterceptor` / `auditService.log()`.
   - `changes` lưu dạng `[[field, old, new]]`, **không chứa dữ liệu sức khỏe dạng rõ** (chỉ ghi `"(đã thay đổi)"`).
6. `audit_log` chỉ cho INSERT. Không viết code UPDATE/DELETE bảng này. Không gỡ trigger băm chuỗi.
7. Phân quyền theo **ma trận mục 6.4 của plan**. Kiểm tra ở API (guard) **và** trong CSDL (RLS cho role `clinician`). Không chỉ ẩn nút ở giao diện.
8. Gọi dịch vụ bản đồ chỉ gửi địa chỉ hoặc tọa độ. **Không gửi** tên, SĐT hay thông tin sức khỏe ra dịch vụ bên ngoài.
9. Log ứng dụng (pino) phải lọc bỏ các trường nhạy cảm (`*_enc`, `phone`, `reason`, `order`, `history`, `allergy`, `meds`, `notes`).

### Nghiệp vụ (đã chốt, không tự ý đổi)
- **Định danh người bệnh** = họ tên (chuẩn hóa bỏ dấu, chữ thường) + ngày sinh dd/mm/yyyy. Trùng tên khác ngày sinh thì cảnh báo và tạo hồ sơ mới.
- **Tra SĐT** chuẩn hóa: bỏ dấu cách/chấm/gạch, đổi `+84` / `84` thành `0`. Một SĐT có thể thuộc nhiều người bệnh. Khách mới thì SĐT tự chép xuống "SĐT liên hệ chính".
- **Phiếu tiếp nhận**: chưa đủ mục bắt buộc thì không giao ca được.
  - Dị ứng = "Có" thì bắt buộc ghi chi tiết.
  - Dịch vụ `requires_order` (truyền dịch, tiêm, đặt sonde) bắt buộc có y lệnh BS.
- **Địa chỉ**: tỉnh/TP + phường/xã **mới** (sau 01/07/2025) + một ô "số nhà + tên đường" + tòa nhà/căn hộ.
  - Khi geocode, bỏ tên phường/quận ra khỏi chuỗi tìm kiếm và bias theo tâm phường.
  - Kết quả cách tâm phường > 300 m thì cảnh báo, cho kéo ghim chỉnh tay.
- **Zone** = cụm quận cũ, gán theo phường mới → quận cũ → zone. Có tọa độ thì kiểm tra thêm bằng `ST_Contains`.

  | Zone | Quận cũ |
  |---|---|
  | Z1 Chợ Lớn | Q.5, Q.10, Q.11 |
  | Z2 Trung tâm | Q.1, Q.3, Q.4 |
  | Z3 Tây Nam | Q.6, Q.8, Bình Chánh |
  | Z4 Tây | Bình Tân, Tân Phú |
  | Z5 Bắc | Tân Bình, Phú Nhuận, Gò Vấp |
  | Z6 Đông Bắc | Bình Thạnh, Q.2 cũ, Thủ Đức, Q.9 |
  | Z7 Nam | Q.7, Nhà Bè, Cần Giờ |
  | Z8 Bắc xa | Q.12, Hóc Môn, Củ Chi |

  Ngoài vùng = cách phòng khám > 12 km theo đường xe máy. Vòng 4/8/12 km chỉ dùng để tính phụ phí.
- **Giờ làm & slot**: phòng khám 07:00–17:00. Slot BS 90 phút, ĐD 60 phút, KTV 60 phút. Tất cả cấu hình được trong `settings`.
- **Loại nhân sự**: `BS`, `DD`, `KTV` (kỹ thuật viên VLTL/PHCN).
- **Lịch nhân viên**:
  - FT: giờ phòng khám trừ nghỉ trưa (mặc định 12:00–13:00), nghỉ 1 ngày cố định/tuần.
  - PT: nhiều khung giờ cho mỗi thứ trong tuần.
  - Ngoại lệ theo ngày: `off` / `ranges` / `full`.
  - Có giới hạn số ca tối đa mỗi ngày.
- **Quãng đường**: luôn là đường **xe máy** (Vietmap `vehicle=motorcycle`), không dùng đường chim bay. Cache vào `travel_legs`. Giá trị nhập tay (`source='manual'`) được ưu tiên hơn giá trị từ API.
- **Gợi ý nhân viên** (`packages/domain/scoring`):
  1. lọc loại nhân sự
  2. loại người trùng ca
  3. điểm xuất phát = ca trước trong ngày, nếu không có thì nhà nhân viên
  4. kịp giờ cả ca trước và ca sau (+ đệm 10 phút)
  5. trong khung giờ làm, chưa vượt số ca tối đa, đủ kỹ năng
  6. phụ trách đúng zone thì cộng ưu tiên
  7. xếp theo số phút di chuyển
  - Ma trận quãng đường lấy bằng **một** lần gọi Matrix API.
- **Trạng thái ca**: `new` → `confirmed` → `in_progress` → `done`; hoặc `cancelled` (**bắt buộc lý do**) / `no_show`.
  - Ca `done` chỉ admin/manager sửa được.
  - Xóa hẳn: chỉ admin.
  - Người bệnh và ca dùng xóa mềm.
- Không cho 1 nhân viên có 2 ca chồng giờ. Chặn bằng `EXCLUDE USING gist` trong CSDL, không chỉ kiểm tra ở code.

### Thời gian
- Lưu `timestamptz` (UTC). Hiển thị và tính slot theo `Asia/Ho_Chi_Minh`.
- Ngày hiển thị dạng `dd/mm/yyyy`.

## Cách làm việc
- Mỗi phiên chỉ làm **một phần** (theo `docs/prompts.md`). Làm trên nhánh riêng `feat/<ten-ngan>` và mở PR khi xong.
- Trước khi code: đọc `docs/plan.md` mục liên quan, rồi nêu ngắn gọn kế hoạch trong PR.
- Logic nghiệp vụ đặt trong `packages/domain`, phải có unit test, các ca biên ghi rõ trong tên test (tiếng Việt cũng được).
- Mỗi migration có rollback. Không sửa migration đã merge, mà tạo migration mới.
- Chạy `pnpm lint && pnpm typecheck && pnpm test` trước khi mở PR. Ghi kết quả vào mô tả PR.
- Mô tả PR có các mục: **Làm gì · Vì sao · Cách kiểm tra (từng bước, cho người không phải dev) · Ảnh chụp màn hình (dữ liệu giả) · Việc còn lại**.
- Không thêm thư viện lớn nếu chưa nêu lý do trong PR. Ưu tiên thư viện đã có trong stack.
- Nếu yêu cầu mâu thuẫn với các quy tắc bắt buộc ở trên: **dừng lại và hỏi**, không tự quyết.
- Giữ file này cập nhật khi đổi lệnh, cấu trúc hay quy ước.
