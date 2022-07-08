import { useCallback, useContext } from 'react'
import { Keyboard, MidiNumbers } from 'react-piano'
import styled from 'styled-components'
import {
  AvailableAllScalesType,
  AVAILABLE_MAJOR_SCALES,
  getFifthFromMidiNote,
  getTriadChordFromMidiNote,
  ignoreOctave,
  OCTAVE_LENGTH,
} from '../../utils'
import { TrainerContext } from '../TrainerProvider'

const PianoContainer = styled.div`
  height: 35vh;
`

const InKeyMarker = styled.div`
  border-radius: 50%;
  width: 2em;
  height: 2em;
  background-color: #acddec;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 5px;
  margin: 2vh auto;
`

const TrainerPiano = () => {
  const {
    scale = AVAILABLE_MAJOR_SCALES['c-major'],
    isHardModeEnabled,
    noteTracker,
    practiceMode,
  } = useContext(TrainerContext)

  const getActiveNotes = useCallback(
    (nextNote?: number) => {
      if (!nextNote) {
        return []
      }

      if (practiceMode === 'scales') {
        if (isHardModeEnabled) {
          return [noteTracker?.prevNote]
        } else {
          return [nextNote]
        }
      } else if (practiceMode === 'chords') {
        return getTriadChordFromMidiNote(nextNote, scale)
      } else if (practiceMode === 'fifths') {
        return [
          nextNote,
          getFifthFromMidiNote(nextNote, scale.value as AvailableAllScalesType),
        ]
      }
    },
    [isHardModeEnabled, noteTracker?.prevNote, practiceMode, scale]
  )

  return (
    <PianoContainer>
      <Keyboard
        noteRange={{
          first: MidiNumbers.fromNote('c3'),
          last: MidiNumbers.fromNote('c5'),
        }}
        activeNotes={getActiveNotes(noteTracker?.nextTargetMidiNumber)}
        onPlayNoteInput={() => {}}
        onStopNoteInput={() => {}}
        keyWidthToHeight={0.33}
        renderNoteLabel={({ midiNumber }: { midiNumber: number }) => {
          const isMidiNumbers = false
          const modScale = ignoreOctave(scale || { keys: {} })
          if (isMidiNumbers) {
            return <InKeyMarker>{midiNumber}</InKeyMarker>
          } else {
            if (isHardModeEnabled) {
              // only add the first marker in hard mode
              if (midiNumber % OCTAVE_LENGTH === 0) {
                return (
                  <InKeyMarker>
                    {modScale.keys[midiNumber % OCTAVE_LENGTH]}
                  </InKeyMarker>
                )
              }
            } else {
              return (
                modScale.keys?.[midiNumber % OCTAVE_LENGTH] && (
                  <InKeyMarker>
                    {modScale.keys[midiNumber % OCTAVE_LENGTH]}
                  </InKeyMarker>
                )
              )
            }
          }
        }}
      />
    </PianoContainer>
  )
}

export default TrainerPiano
