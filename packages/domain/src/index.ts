/** Logic nghiệp vụ thuần (không I/O). Nội dung thật thêm ở P06/P08. */
export const PACKAGE_NAME = '@homecare/domain';

/** Loại nhân sự (CLAUDE.md: BS, DD, KTV). */
export const STAFF_KINDS = ['BS', 'DD', 'KTV'] as const;
export type StaffKind = (typeof STAFF_KINDS)[number];
