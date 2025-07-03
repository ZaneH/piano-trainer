import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiNumbers, Piano } from 'react-piano'
import styled from 'styled-components'
import { useSettings } from '../../core/contexts/SettingsContext'
import { useTrainer } from '../../core/contexts/TrainerContext'
import { useMidiDevices } from '../../core/hooks/useMidiDevices'
import { CIRCLE_OF_FIFTHS } from '../../core/models/constants'
import {
  getRandomFifth,
  getRandomKey,
  midiNumberToNote,
  normalizeNoteName,
} from '../../core/services/noteService'
import {
  AVAILABLE_SCALES,
  convertKeyToScalesKey,
  getBothFifthsFromMidiNumber,
} from '../../core/services/scaleService'
import { isAdjacentFifth } from '../../utils/scales/fifths'
import { shuffle } from '../../utils/shuffle'
import {
  formatQuestion,
  getRandomQuizQuestion,
  QuestionTypeType,
} from './Questions'
import QuizHeader from './QuizHeader'
import { QuizOption } from './QuizOption'

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
  const { showKeyboard, midiDevice } = useSettings()

  const { activeNotes } = useMidiDevices({
    onNoteOn: addToChordStack,
    onNoteOff: removeFromChordStack,
    initialDeviceId: midiDevice?.id,
  })

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

  const gotoNextQuestion = useCallback(() => {
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
    // Handle MIDI - check if correct notes are being played
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
    chordStack,
    clearChordStack,
    currentQuestion.type,
    currentQuestion.majMin,
    currentQuestionKey,
    gotoNextQuestion,
    currentValidMidi,
  ])

  useEffect(() => {
    // Populate the choices to the question
    if (currentQuestion.type === 'fifth') {
      setAnswerChoices(() => {
        // Add random answer choices
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

        // Add correct answer & shuffle
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
  }, [gotoNextQuestion, answerChoices, currentQuestionKey, t])

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
              addToChordStack(midiNumber)
            }}
            stopNote={(midiNumber: number) => {
              removeFromChordStack(midiNumber)
            }}
            activeNotes={Object.keys(activeNotes)
              .filter((note: string) => activeNotes[Number(note)])
              .map((note: string) => Number(note))}
          />
        </KeyboardContainer>
      )}
    </QuizPage>
  )
}

export default Quiz
