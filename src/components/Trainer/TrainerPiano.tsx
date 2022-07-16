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
        if (isHardModeEnabled) {
          return getTriadChordFromMidiNote(noteTracker!.prevNote!, scale)
        } else {
          return getTriadChordFromMidiNote(nextNote, scale)
        }
      } else if (practiceMode === 'fifths') {
        if (isHardModeEnabled) {
          return [
            noteTracker!.prevNote!,
            getFifthFromMidiNote(
              noteTracker!.prevNote!,
              scale.value as AvailableAllScalesType
            ),
          ]
        } else {
          return [
            nextNote,
            getFifthFromMidiNote(
              nextNote,
              scale.value as AvailableAllScalesType
            ),
          ]
        }
      }
    },
    [isHardModeEnabled, practiceMode, scale, noteTracker]
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
          // modScale will be the midi numbers in-scale starting from c0
          const modScale = ignoreOctave(scale || { keys: {} })
          if (isMidiNumbers) {
            return <InKeyMarker>{midiNumber}</InKeyMarker>
          } else {
            if (isHardModeEnabled) {
              // only add the roman numeral if it's the first note in the scale
              const noOctaveFirstNoteInScale = Number(
                Object.keys(modScale[0])[0]
              )
              if (midiNumber % OCTAVE_LENGTH === noOctaveFirstNoteInScale) {
                return (
                  <InKeyMarker>{Object.values(modScale[0])[0]}</InKeyMarker>
                )
              }
            } else {
              // TODO: Refactor this to be more readable
              // Basically checking if the midiNumber is in the modScale array of Objects
              const modKeyIdx = modScale.findIndex(
                (m) => Object.keys(m)[0] === String(midiNumber % OCTAVE_LENGTH)
              )

              // if it is, display the roman numeral
              if (modKeyIdx > -1) {
                return (
                  <InKeyMarker>
                    {Object.values(modScale[modKeyIdx] || {})?.[0]}
                  </InKeyMarker>
                )
              }
            }
          }
        }}
      />
    </PianoContainer>
  )
}

export default TrainerPiano
