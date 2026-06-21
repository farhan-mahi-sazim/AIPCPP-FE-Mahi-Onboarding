export function getClassName(
  pathname: string,
  href: string,
  classNames: { activeButton: string; inactiveButton: string },
): string {
  return pathname.includes(href) ? classNames.activeButton : classNames.inactiveButton;
}
