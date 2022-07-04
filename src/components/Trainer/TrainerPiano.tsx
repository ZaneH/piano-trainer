import { useContext } from 'react'
import { Keyboard, MidiNumbers } from 'react-piano'
import styled from 'styled-components'
import { ignoreOctave } from '../../utils'
import { TrainerContext } from '../TrainerProvider'

const PianoContainer = styled.div`
  height: 50vh;
  width: 60%;
`

const InKeyMarker = styled.div`
  border-radius: 50%;
  width: 2em;
  height: 2em;
  background-color: #acddec;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-weight: 600;
  padding: 4px;
  margin: 2vh auto;
`

const TrainerPiano = () => {
  const { nextTargetNote, scale } = useContext(TrainerContext)

  return (
    <PianoContainer>
      <Keyboard
        noteRange={{
          first: MidiNumbers.fromNote('c3'),
          last: MidiNumbers.fromNote('g4'),
        }}
        activeNotes={[nextTargetNote]}
        onPlayNoteInput={() => {}}
        onStopNoteInput={() => {}}
        keyWidthToHeight={0.33}
        renderNoteLabel={({ midiNumber }: { midiNumber: number }) => {
          const modScale = ignoreOctave(scale || [])
          return (
            modScale[midiNumber % 12] && (
              <InKeyMarker>{modScale[midiNumber % 12]}</InKeyMarker>
            )
          )
        }}
      />
    </PianoContainer>
  )
}

export default TrainerPiano
