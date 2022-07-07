import { MajorMinorType } from '../../components/Quiz/Questions'

const CIRCLE_OF_FIFTHS: { [key in MajorMinorType]: string[] } = {
  Major: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'],
  Minor: ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Bb', 'F', 'C', 'G', 'D'],
}

const isAdjacentFifth = (fifths: string[], base: string, test: string) => {
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

export { CIRCLE_OF_FIFTHS, isAdjacentFifth }
