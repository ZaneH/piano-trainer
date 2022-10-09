import { invoke } from '@tauri-apps/api'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardShortcuts, MidiNumbers, Piano } from 'react-piano'
import 'react-piano/dist/styles.css'
import styled, { css } from 'styled-components'
import {
  getFifthFromMidiNumber,
  getSeventhChordFromMidiNumber,
  getTriadChordFromMidiNumber,
  MidiDevice,
  midiNumberToNote,
  swapNoteWithSynonym,
} from '../../utils'
import { KVContext } from '../KVProvider'
import SoundfontProvider from '../SoundfontProvider'
import { TrainerContext } from '../TrainerProvider'

const KeyboardContainer = styled.div<{ hide: boolean }>`
  height: 25vh;
  ${(p) =>
    p.hide &&
    css`
      transform: translateY(25vh);
    `}
`

const Keyboard = () => {
  const {
    noteTracker,
    setNoteTracker,
    practiceMode,
    chordStack,
    setChordStack,
    scale,
  } = useContext(TrainerContext)

  const { muteSound, showKeyboard, midiDevice, setMidiDevice, pianoSound } =
    useContext(KVContext)
  const unlistenRef = useRef<UnlistenFn>()
  const [activeNotes, setActiveNotes] = useState<{ [note: string]: boolean }>(
    {}
  )
  const firstNote = MidiNumbers.fromNote('c3')
  const lastNote = MidiNumbers.fromNote('c5')
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  })
  const { t } = useTranslation()

  const [listeningIdx, setListeningIdx] = useState(-1)

  const onLoadCallback = useCallback(async () => {
    if (midiDevice?.id !== listeningIdx) {
      setListeningIdx(-1)
    }

    if (listeningIdx > -1) return

    // TODO: Move this into a MIDIProvider / hook
    const devicesObject = await invoke('list_midi_connections')
    const deviceIds = Object.keys(devicesObject as {})
    let midiInputIdx = 0
    const foundMidiId = deviceIds.find((d) => Number(d) === midiDevice?.id)
    let foundMidi: MidiDevice | undefined
    if (foundMidiId) {
      foundMidi = {
        id: Number(foundMidiId),
        name: Object.values(devicesObject as {})[Number(foundMidiId)],
      } as MidiDevice | undefined
      midiInputIdx = Number(foundMidiId)
    }

    invoke('open_midi_connection', { inputIdx: midiInputIdx })

    listen('midi_message', (event) => {
      const payload = event.payload as { message: number[] }
      const [command, note, velocity] = payload.message

      if (command === 144) {
        setActiveNotes((an) => ({
          ...an,
          [note]: true,
        }))
      }

      // some midi keyboards don't send the off signal,
      // they just set the velocity to 0
      if (command === 128 || velocity === 0) {
        setActiveNotes((an) => ({
          ...an,
          [note]: false,
        }))
      }
    })
      .then((ul) => (unlistenRef.current = ul))
      .catch(console.error)

    console.log('Connected & listening to MIDI device...')
    setListeningIdx(midiInputIdx)
    setMidiDevice?.(foundMidi || { id: 0 })
  }, [setListeningIdx, midiDevice, setMidiDevice, listeningIdx])

  useEffect(() => {
    onLoadCallback()
  }, [onLoadCallback])

  useEffect(() => {
    const targetScaleNote = midiNumberToNote(noteTracker!.nextTargetMidiNumber)

    if (
      practiceMode === 'scales' &&
      chordStack!.length > 0 &&
      chordStack?.map((cs) => midiNumberToNote(cs)).includes(targetScaleNote)
    ) {
      setNoteTracker?.((nt) => ({
        ...nt,
        noteCounter: nt.noteCounter + 1,
        currentMidiNumber: noteTracker!.nextTargetMidiNumber,
      }))
      setChordStack?.([])
    } else if (practiceMode === 'chords') {
      const targetChord = getTriadChordFromMidiNumber(
        noteTracker?.nextTargetMidiNumber!,
        scale!
      )

      // turn the target numbers into target letters to ignore octave for matching
      const targetChordNotes = targetChord.map((n) => midiNumberToNote(n))

      const matches = targetChordNotes.every((e) =>
        chordStack?.map((cs) => midiNumberToNote(cs)).includes(e)
      )
      if (matches) {
        setNoteTracker?.((nt) => ({
          ...nt,
          noteCounter: nt.noteCounter + 1,
          currentMidiNumber: targetChord[0],
        }))
        setChordStack?.([])
      }
    } else if (practiceMode === 'seventhChords') {
      const targetChord = getSeventhChordFromMidiNumber(
        noteTracker?.nextTargetMidiNumber!,
        scale!
      )

      // turn the target numbers into target letters to ignore octave for matching
      const targetChordNotes = targetChord.map((n) => midiNumberToNote(n))

      const matches = targetChordNotes.every((e) =>
        chordStack?.map((cs) => midiNumberToNote(cs)).includes(e)
      )
      if (matches) {
        setNoteTracker?.((nt) => ({
          ...nt,
          noteCounter: nt.noteCounter + 1,
          currentMidiNumber: targetChord[0],
        }))
        setChordStack?.([])
      }
    } else if (practiceMode === 'fifths') {
      // turn the target numbers into target letters to ignore octave for matching
      const targetFifths = [
        noteTracker?.nextTargetMidiNumber!,
        getFifthFromMidiNumber(
          noteTracker?.nextTargetMidiNumber!,
          scale?.value!
        ),
      ]

      const targetFifthNotes = targetFifths.map((f) => midiNumberToNote(f))

      const matches = targetFifthNotes.every((e) =>
        chordStack?.map((cs) => midiNumberToNote(cs)).includes(e)
      )
      if (matches) {
        setNoteTracker?.((nt) => ({
          ...nt,
          noteCounter: nt.noteCounter + 1,
          currentMidiNumber: targetFifths[0],
        }))
        setChordStack?.([])
      }
    }
  }, [
    setNoteTracker,
    chordStack,
    noteTracker?.nextTargetMidiNumber,
    scale,
    practiceMode,
    setChordStack,
    noteTracker,
  ])

  useEffect(() => {
    const unlisten = async () => {
      unlistenRef.current?.()
    }
    return () => {
      unlisten()
    }
  }, [])

  return (
    <SoundfontProvider
      instrumentName={pianoSound || 'acoustic_grand_piano'}
      hostname={'https://d1pzp51pvbm36p.cloudfront.net'}
      format={'mp3'}
      soundfont={'MusyngKite'}
      onLoad={() => {}}
      render={({ playNote, stopNote }) => {
        return (
          <KeyboardContainer hide={!showKeyboard}>
            <Piano
              noteRange={{ first: firstNote, last: lastNote }}
              playNote={(midiNumber: number) => {
                setChordStack?.((cs) => [...cs, midiNumber])

                !muteSound && playNote(midiNumber)
              }}
              stopNote={(midiNumber: number) => {
                stopNote(midiNumber)

                // remove midiNumber from chordStack
                setChordStack?.((cs) => {
                  const removalIdx = cs.indexOf(midiNumber)
                  if (removalIdx > -1) {
                    cs.splice(removalIdx, 1)
                  }

                  return cs
                })
              }}
              keyboardShortcuts={keyboardShortcuts}
              renderNoteLabel={({ midiNumber }: { midiNumber: number }) => (
                <p className='ReactPiano__NoteLabel'>
                  {t(
                    swapNoteWithSynonym(
                      MidiNumbers.getAttributes(midiNumber).note.replace(
                        /[0-9]/,
                        ''
                      )
                    )
                  )}
                </p>
              )}
              activeNotes={Object.keys(activeNotes)
                .filter((v: string) => activeNotes[v])
                .map((s: string) => Number(s))}
            />
          </KeyboardContainer>
        )
      }}
    />
  )
}

export default Keyboard
