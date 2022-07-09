import { invoke } from '@tauri-apps/api'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MidiNumbers, Piano } from 'react-piano'
import styled from 'styled-components'
import {
  CIRCLE_OF_FIFTHS,
  convertKeyToScalesKey,
  getBothFifthsFromMidiNote,
  getRandomFifth,
  getRandomKey,
  isAdjacentFifth,
  MidiDevice,
  OCTAVE_LENGTH,
  shuffle,
  swapNoteWithSynonym,
} from '../../utils'
import { KVContext } from '../KVProvider'
import SoundfontProvider from '../SoundfontProvider'
import {
  formatQuestion,
  getRandomQuizQuestion,
  MajorMinorType,
  QuestionTypeType,
  QuizOption,
} from './Questions'
import QuizHeader from './QuizHeader'

const QuizPage = styled.div`
  height: 100%;
  width: 100%;
`

const QuizQuestion = styled.h1`
  font-size: 2.3rem;
  padding: 32px 48px;
  color: white;
`

const QuizOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const KeyboardContainer = styled.div`
  height: 25vh;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
`

const Quiz = () => {
  const { showKeyboard, muteSound, midiDevice, setMidiDevice } =
    useContext(KVContext)
  const unlistenRef = useRef<UnlistenFn>()
  const [activeNotes, setActiveNotes] = useState<{ [note: string]: boolean }>(
    {}
  )
  const [currentQuestion, setCurrentQuestion] = useState(
    getRandomQuizQuestion()
  )
  const firstNote = MidiNumbers.fromNote('c3')
  const lastNote = MidiNumbers.fromNote('c5')

  // Get a random note that's appropriate for the question type
  const getRandomNote = useCallback(
    (questionType: QuestionTypeType, majMin?: MajorMinorType) => {
      if (questionType === 'fifth') {
        return getRandomFifth(majMin!)
      } else if (questionType === 'key') {
        return getRandomKey()
      } else {
        return getRandomKey()
      }
    },
    []
  )

  const [currentQuestionKey, setCurrentQuestionKey] = useState<string>(
    getRandomNote(currentQuestion.type, currentQuestion.majMin)
  )

  const [answerChoices, setAnswerChoices] = useState<string[]>([])

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
      const [command, note] = payload.message

      if (command === 144) {
        setActiveNotes((an) => ({
          ...an,
          [note]: true,
        }))
      }

      if (command === 128) {
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

  const gotoNextQuestion = useCallback(() => {
    setActiveNotes({})
    setCurrentQuestion(() => {
      const newQ = getRandomQuizQuestion()
      let newKey = getRandomNote(newQ.type, newQ.majMin)
      while (newKey === currentQuestionKey) {
        newKey = getRandomNote(newQ.type, newQ.majMin)
      }
      setCurrentQuestionKey(newKey)
      return newQ
    })
  }, [getRandomNote, currentQuestionKey])

  const answerOnManyOctaves = useCallback(
    (notes: string[]) => {
      // fill in 8 octaves as valid MIDI answers
      const allOctavesOfNote: string[] = []
      notes.forEach((n) => {
        const firstOctave = MidiNumbers.fromNote(
          `${swapNoteWithSynonym(
            n,
            currentQuestion.majMin || 'Major'
          ).toLowerCase()}0`
        )
        for (let i = 0; i < 8; i++) {
          allOctavesOfNote.push(firstOctave + OCTAVE_LENGTH * i)
        }
      })

      return allOctavesOfNote
    },
    [currentQuestion.majMin]
  )

  const currentValidMidi = useMemo<number[]>(() => {
    if (currentQuestion.type === 'fifth') {
      return getBothFifthsFromMidiNote(
        MidiNumbers.fromNote(
          `${swapNoteWithSynonym(currentQuestionKey, currentQuestion.majMin!)}3`
        ),
        convertKeyToScalesKey(currentQuestionKey, currentQuestion.majMin)
      )
    } else if (currentQuestion.type === 'key') {
      return [MidiNumbers.fromNote(`${currentQuestionKey}3`)]
    } else {
      return []
    }
  }, [currentQuestionKey, currentQuestion.majMin, currentQuestion.type])

  useEffect(() => {
    // Handle MIDI
    if (currentQuestion.type === 'fifth') {
      const validFifths = currentValidMidi.map((f) => {
        // convert the midi fifths into notes (ex. c, b#)
        // to be read by MidiNumbers.fromNote
        return MidiNumbers.getAttributes(f)
          .note.toLowerCase()
          .replace(/[0-9]/, '')
      })
      const match = answerOnManyOctaves(validFifths).some((e) => activeNotes[e])
      if (match) {
        gotoNextQuestion()
      }
    } else if (currentQuestion.type === 'key') {
      const match = answerOnManyOctaves([currentQuestionKey]).some(
        (e) => activeNotes[e]
      )
      if (match) {
        gotoNextQuestion()
      }
    }
  }, [
    activeNotes,
    currentQuestion.type,
    currentQuestion.majMin,
    currentQuestionKey,
    gotoNextQuestion,
    answerOnManyOctaves,
    currentValidMidi,
  ])

  useEffect(() => {
    onLoadCallback()
  }, [onLoadCallback])

  useEffect(() => {
    const unlisten = async () => {
      unlistenRef.current?.()
    }
    return () => {
      unlisten()
    }
  }, [])

  useEffect(() => {
    // Populate the choices to the question
    if (currentQuestion.type === 'fifth') {
      setAnswerChoices(() => {
        // add random answer choices
        const newOptions = []
        while (newOptions.length < 4) {
          const potentialOption = getRandomNote(
            currentQuestion.type,
            currentQuestion.majMin
          )
          if (
            newOptions.indexOf(potentialOption) === -1 &&
            !isAdjacentFifth(
              CIRCLE_OF_FIFTHS[currentQuestion.majMin!],
              currentQuestionKey,
              potentialOption
            )
          ) {
            newOptions.push(potentialOption)
          }
        }

        // add correct answer & shuffle
        let correctAnswer = ''
        while (correctAnswer === '') {
          const randomNote = getRandomNote(
            currentQuestion.type,
            currentQuestion.majMin
          )
          const isFifth = isAdjacentFifth(
            CIRCLE_OF_FIFTHS[currentQuestion.majMin!],
            currentQuestionKey,
            randomNote
          )
          if (isFifth) {
            correctAnswer = randomNote
            break
          }
        }

        newOptions[Math.floor(Math.random() * newOptions.length)] =
          correctAnswer

        return shuffle(newOptions)
      })
    }
  }, [
    currentQuestion.type,
    currentQuestion.majMin,
    currentQuestionKey,
    getRandomNote,
  ])

  const fifthAnswers = useMemo(() => {
    return answerChoices.map((co, i) => {
      const isCorrect = isAdjacentFifth(
        CIRCLE_OF_FIFTHS[currentQuestion.majMin!],
        currentQuestionKey,
        co
      )

      return (
        <QuizOption
          key={i}
          isAnswer={isCorrect}
          value={co}
          onClick={(value, isAnswer) => {
            if (isAnswer) {
              gotoNextQuestion()
            }
          }}
        >
          {co}
        </QuizOption>
      )
    })
  }, [
    gotoNextQuestion,
    answerChoices,
    currentQuestion.majMin,
    currentQuestionKey,
  ])

  return (
    <QuizPage>
      <QuizHeader />
      <QuizQuestion>
        {formatQuestion(currentQuestion.questionFormat, {
          key: currentQuestionKey,
          majMin: currentQuestion.majMin,
        })}
      </QuizQuestion>
      <QuizOptionsContainer>
        {currentQuestion.type === 'key' && null}
        {currentQuestion.type === 'fifth' && fifthAnswers}
      </QuizOptionsContainer>
      {showKeyboard && currentQuestion.type === 'key' && (
        <SoundfontProvider
          instrumentName={'acoustic_grand_piano'}
          hostname={'https://d1pzp51pvbm36p.cloudfront.net'}
          format={'mp3'}
          soundfont={'MusyngKite'}
          onLoad={() => {}}
          render={({ playNote, stopNote }) => (
            <KeyboardContainer>
              <Piano
                noteRange={{ first: firstNote, last: lastNote }}
                playNote={(midiNumber: number) => {
                  setActiveNotes((an) => ({
                    ...an,
                    [midiNumber]: true,
                  }))
                  !muteSound && playNote(midiNumber)
                }}
                stopNote={(midiNumber: number) => {
                  setActiveNotes((an) => ({
                    ...an,
                    [midiNumber]: false,
                  }))
                  stopNote(midiNumber)
                }}
                activeNotes={Object.keys(activeNotes)
                  .filter((v: string) => activeNotes[v])
                  .map((s: string) => Number(s))}
              />
            </KeyboardContainer>
          )}
        />
      )}
    </QuizPage>
  )
}

export default Quiz
