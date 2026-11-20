/** Component/tiện ích giao diện dùng chung. */
export const PACKAGE_NAME = '@homecare/ui';

/** Ghép className, bỏ giá trị rỗng. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
