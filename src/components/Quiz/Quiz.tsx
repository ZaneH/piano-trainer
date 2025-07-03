import { invoke } from '@tauri-apps/api/core'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiNumbers, Piano } from 'react-piano'
import styled from 'styled-components'
import { useSettings } from '../../core/contexts/SettingsContext'
import { useTrainer } from '../../core/contexts/TrainerContext'
import { CIRCLE_OF_FIFTHS } from '../../core/models/constants'
import {
  convertKeyToScalesKey,
  getBothFifthsFromMidiNumber,
  AVAILABLE_SCALES,
} from '../../core/services/scaleService'
import {
  getRandomFifth,
  getRandomKey,
  midiNumberToNote,
} from '../../core/services/noteService'
import { MidiDevice } from '../../utils'
import {
  formatQuestion,
  getRandomQuizQuestion,
  QuestionTypeType,
} from './Questions'
import QuizHeader from './QuizHeader'
import { QuizOption } from './QuizOption'
import { normalizeNoteName } from '../../core/services/noteService'
import { isAdjacentFifth } from '../../utils/scales/fifths'
import { shuffle } from '../../utils/shuffle'

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
  const { chordStack, addToChordStack, removeFromChordStack, clearChordStack } =
    useTrainer()
  const { showKeyboard, midiDevice, setMidiDevice } = useSettings()
  const unlistenRef = useRef<UnlistenFn>(null)
  const [activeNotes, setActiveNotes] = useState<{ [note: string]: boolean }>(
    {}
  )
  const [currentQuestion, setCurrentQuestion] = useState(
    getRandomQuizQuestion()
  )
  const firstNote = MidiNumbers.fromNote('c3')
  const lastNote = MidiNumbers.fromNote('c5')
  const { t } = useTranslation()

  // Get a random note that's appropriate for the question type
  const getRandomNote = useCallback((questionType: QuestionTypeType) => {
    if (questionType === 'fifth') {
      return getRandomFifth()
    } else if (questionType === 'key') {
      return getRandomKey()
    } else {
      return getRandomKey()
    }
  }, [])

  const [currentQuestionKey, setCurrentQuestionKey] = useState<string>(
    getRandomNote(currentQuestion.type)
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
      const [status, note, velocity] = payload.message

      const command = status & 0xf0

      if (command === 0x90) {
        // Note off
        addToChordStack(note)
        setActiveNotes((an) => ({ ...an, [note]: true }))
      }

      if (command === 0x80 || velocity === 0) {
        // Note on
        removeFromChordStack(note)
        setActiveNotes((an) => ({ ...an, [note]: false }))
      }
    })
      .then((ul) => (unlistenRef.current = ul))
      .catch(console.error)

    console.log('Connected & listening to MIDI device...')
    setListeningIdx(midiInputIdx)
    setMidiDevice?.(foundMidi || { id: 0 })
  }, [
    setListeningIdx,
    midiDevice,
    setMidiDevice,
    listeningIdx,
    addToChordStack,
    removeFromChordStack,
  ])

  const gotoNextQuestion = useCallback(() => {
    setActiveNotes({})
    setCurrentQuestion(() => {
      const newQ = getRandomQuizQuestion()
      let newKey = getRandomNote(newQ.type)
      while (newKey === currentQuestionKey) {
        newKey = getRandomNote(newQ.type)
      }
      setCurrentQuestionKey(newKey)
      return newQ
    })
  }, [getRandomNote, currentQuestionKey])

  const currentValidMidi = useMemo<number[]>(() => {
    if (currentQuestion.type === 'fifth') {
      return getBothFifthsFromMidiNumber(
        MidiNumbers.fromNote(`${normalizeNoteName(currentQuestionKey)}3`),
        convertKeyToScalesKey(currentQuestionKey, currentQuestion.majMin),
        AVAILABLE_SCALES
      )
    } else if (currentQuestion.type === 'key') {
      return [MidiNumbers.fromNote(`${normalizeNoteName(currentQuestionKey)}3`)]
    } else {
      return []
    }
  }, [currentQuestionKey, currentQuestion.majMin, currentQuestion.type])

  useEffect(() => {
    // Handle MIDI
    const chordStackNotes = chordStack?.map((cs) => midiNumberToNote(cs)) || []
    if (currentQuestion.type === 'fifth') {
      const validFifthsNotes = currentValidMidi.map((f) => midiNumberToNote(f))
      const match = validFifthsNotes.some((e) => chordStackNotes.includes(e))
      if (match) {
        gotoNextQuestion()
        clearChordStack()
      }
    } else if (currentQuestion.type === 'key') {
      const validMidiNotes = currentValidMidi.map((m) => midiNumberToNote(m))
      const match = chordStackNotes?.some((c) => validMidiNotes.includes(c))
      if (match) {
        gotoNextQuestion()
        clearChordStack()
      }
    }
  }, [
    activeNotes,
    chordStack,
    clearChordStack,
    currentQuestion.type,
    currentQuestion.majMin,
    currentQuestionKey,
    gotoNextQuestion,
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
          const potentialOption = getRandomNote(currentQuestion.type)
          if (
            newOptions.indexOf(potentialOption) === -1 &&
            !isAdjacentFifth(
              CIRCLE_OF_FIFTHS,
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
          const randomNote = getRandomNote(currentQuestion.type)
          const isFifth = isAdjacentFifth(
            CIRCLE_OF_FIFTHS,
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
        CIRCLE_OF_FIFTHS,
        currentQuestionKey,
        co
      )

      return (
        <QuizOption
          key={i}
          isAnswer={isCorrect}
          value={co}
          onClick={(_value, isAnswer) => {
            if (isAnswer) {
              gotoNextQuestion()
            }
          }}
        >
          {t(`piano.note.${co}`)}
        </QuizOption>
      )
    })
  }, [
    gotoNextQuestion,
    answerChoices,
    currentQuestion.majMin,
    currentQuestionKey,
    t,
  ])

  return (
    <QuizPage>
      <QuizHeader />
      <QuizQuestion>
        {formatQuestion(t(`pages.quiz.questions.${currentQuestion.type}`), {
          key: t(`piano.note.${currentQuestionKey}`),
          majMin: currentQuestion.majMin,
        })}
      </QuizQuestion>
      <QuizOptionsContainer>
        {currentQuestion.type === 'key' && null}
        {currentQuestion.type === 'fifth' && fifthAnswers}
      </QuizOptionsContainer>
      {showKeyboard && currentQuestion.type === 'key' && (
        <KeyboardContainer>
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={(midiNumber: number) => {
              setActiveNotes((an) => ({ ...an, [midiNumber]: true }))
              addToChordStack(midiNumber)
            }}
            stopNote={(midiNumber: number) => {
              setActiveNotes((an) => ({ ...an, [midiNumber]: false }))
              removeFromChordStack(midiNumber)
            }}
            activeNotes={Object.keys(activeNotes)
              .filter((v: string) => activeNotes[v])
              .map((s: string) => Number(s))}
          />
        </KeyboardContainer>
      )}
    </QuizPage>
  )
}

export default Quiz
