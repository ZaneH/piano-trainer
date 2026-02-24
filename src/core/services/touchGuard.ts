export const DOUBLE_TAP_THRESHOLD_MS = 350

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  )
}

export function shouldPreventDoubleTapDefault(
  lastTouchStartAt: number,
  now: number,
  target: EventTarget | null
): boolean {
  if (isEditableTarget(target)) {
    return false
  }

  return now - lastTouchStartAt <= DOUBLE_TAP_THRESHOLD_MS
}
