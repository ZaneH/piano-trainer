import { CIRCLE_OF_FIFTHS } from '../../core/models/constants'

const isAdjacentFifth = (
  fifths: typeof CIRCLE_OF_FIFTHS,
  base: string,
  test: string
) => {
  if (!Array.isArray(fifths)) {
    return false
  }

  const testFifthIdx = fifths.indexOf(test)

  let behindIdx = testFifthIdx - 1
  let frontIdx = testFifthIdx + 1

  if (behindIdx < 0) {
    behindIdx = fifths.length - 1
  }

  if (frontIdx >= fifths.length - 1) {
    frontIdx = 0
  }

  return fifths[behindIdx] === base || fifths[frontIdx] === base
}

export { isAdjacentFifth }
