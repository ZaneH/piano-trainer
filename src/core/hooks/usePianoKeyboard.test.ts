import { findExactScaleMatch } from './usePianoKeyboard'

describe('usePianoKeyboard scale matching', () => {
  test('matches exact target midi number', () => {
    expect(findExactScaleMatch([48, 52, 55, 60], 60)).toBe(60)
  })

  test('matches lower octave for target tonic', () => {
    expect(findExactScaleMatch([48], 60)).toBe(48)
  })

  test('matches upper octave for lower target tonic', () => {
    expect(findExactScaleMatch([60], 48)).toBe(60)
  })

  test('does not match different pitch class', () => {
    expect(findExactScaleMatch([61], 60)).toBeUndefined()
  })
})
