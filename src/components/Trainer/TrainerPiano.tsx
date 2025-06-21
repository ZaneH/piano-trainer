import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, MidiNumbers } from 'react-piano'
import styled from 'styled-components'
import { useTrainer } from '../../core/contexts/TrainerContext'
import { ignoreOctave } from '../../core/services/noteService'
import { OCTAVE_LENGTH } from '../../core/models/constants'

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
  const { scale, isHardModeEnabled, getActiveNotes } = useTrainer()
  const { t } = useTranslation()

  // Render the note label with Roman numerals
  const renderNoteLabel = useCallback(
    ({ midiNumber }: { midiNumber: number }) => {
      // Get all scale notes ignoring octave
      const modScale = ignoreOctave(scale.keys)

      if (isHardModeEnabled) {
        // Only add the roman numeral if it's the first note in the scale
        const noOctaveFirstNoteInScale = Number(Object.keys(modScale[0])[0])
        if (midiNumber % OCTAVE_LENGTH === noOctaveFirstNoteInScale) {
          return <InKeyMarker>{Object.values(modScale[0])[0]}</InKeyMarker>
        }
      } else {
        // Find if this note is in our scale
        const modKeyIdx = modScale.findIndex(
          (m) => Object.keys(m)[0] === String(midiNumber % OCTAVE_LENGTH)
        )

        // If it is, display the roman numeral
        if (modKeyIdx > -1) {
          return (
            <InKeyMarker>
              {t(
                `piano.numeral.${Object.values(modScale[modKeyIdx] || {})[0]}`
              )}
            </InKeyMarker>
          )
        }
      }

      return null
    },
    [isHardModeEnabled, scale.keys, t]
  )

  return (
    <PianoContainer>
      <Keyboard
        noteRange={{
          first: MidiNumbers.fromNote('c3'),
          last: MidiNumbers.fromNote('c5'),
        }}
        activeNotes={getActiveNotes()}
        keyWidthToHeight={0.33}
        renderNoteLabel={renderNoteLabel}
      />
    </PianoContainer>
  )
}

export default TrainerPiano
