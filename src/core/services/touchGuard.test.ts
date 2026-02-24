import {
  DOUBLE_TAP_THRESHOLD_MS,
  isEditableTarget,
  shouldPreventDoubleTapDefault,
} from './touchGuard'

describe('touchGuard', () => {
  it('detects editable targets', () => {
    const input = document.createElement('input')
    const div = document.createElement('div')

    expect(isEditableTarget(input)).toBe(true)
    expect(isEditableTarget(div)).toBe(false)
  })

  it('prevents non-editable double taps within threshold', () => {
    const target = document.createElement('div')

    expect(
      shouldPreventDoubleTapDefault(
        1000,
        1000 + DOUBLE_TAP_THRESHOLD_MS - 1,
        target
      )
    ).toBe(true)
  })

  it('allows touches after threshold and on editable targets', () => {
    const editable = document.createElement('textarea')
    const nonEditable = document.createElement('div')

    expect(
      shouldPreventDoubleTapDefault(
        1000,
        1000 + DOUBLE_TAP_THRESHOLD_MS + 1,
        nonEditable
      )
    ).toBe(false)
    expect(shouldPreventDoubleTapDefault(1000, 1001, editable)).toBe(false)
  })
})
