# Tiến độ các phiên Claude Code

Thứ tự: P00 → P01 → … → P15. Mỗi phiên giả định phiên trước đã merge.

## Giai đoạn 0

- [x] P00 – Khởi tạo repo: plan.md, CLAUDE.md, prompts.md, .gitignore

## Giai đoạn 1 – Nền tảng

- [x] P01 – Khung monorepo & môi trường local: pnpm + turborepo, web/api/packages/workers, docker-compose, CI
- [ ] P02 – Cơ sở dữ liệu & seed danh mục: schema 7.2, PostGIS, EXCLUDE, audit_log băm, role DB, seed
- [ ] P03 – Mã hóa & tiện ích dữ liệu nhạy cảm: AES-256-GCM xoay khóa, SĐT/tên/ngày sinh, redact log
- [ ] P04 – Đăng nhập, 2FA, phân quyền, nhật ký: Argon2id, TOTP, RBAC 6.4, audit, RLS clinician

## Giai đoạn 2 – Nghiệp vụ lõi

- [ ] P05 – Bản đồ: geocode, quãng đường xe máy, gán zone, tab Khu vực
- [ ] P06 – Nhân sự & lịch rảnh: availability FT/PT/ngoại lệ, CRUD nhân viên, tab Nhân sự
- [ ] P07 – Người bệnh, tra SĐT, phiếu tiếp nhận A–F, tab Khách hàng
- [ ] P08 – Gợi ý nhân viên & giao ca: scoring, appointments, ca lặp lại, chống giao trùng
- [ ] P09 – Tổng quan lịch (ngày/tuần/tháng) & lộ trình

## Giai đoạn 3 – Nhân viên y tế & đầu ra

- [ ] P10 – App nhân viên y tế (PWA): ca của tôi, check-in/out GPS, sinh hiệu, chữ ký
- [ ] P11 – Phiếu giao ca PDF & xuất Excel có watermark
- [ ] P12 – Gửi Zalo ZNS & thông báo, chế độ dry-run
- [ ] P13 – Báo cáo (materialized view) & Cài đặt

## Giai đoạn 4 – Chuyển đổi, bảo mật, go-live

- [ ] P14 – Chuyển dữ liệu từ trang mẫu (dry-run + transaction)
- [ ] P15 – Đóng gói, deploy, sao lưu, giám sát, runbook, UAT checklist
