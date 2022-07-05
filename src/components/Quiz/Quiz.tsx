import { invoke } from '@tauri-apps/api'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  CIRCLE_OF_FIFTHS,
  getRandomFifth,
  getRandomKey,
  isAdjacentFifth,
} from '../../utils'
import {
  formatQuestion,
  getRandomQuizQuestion,
  MajorMinorType,
  QuestionTypeType,
  QuizOption,
} from './Questions'

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

const Quiz = () => {
  const unlistenRef = useRef<UnlistenFn>()
  const [activeNotes, setActiveNotes] = useState<{ [note: string]: boolean }>(
    {}
  )
  const [isListening, setIsListening] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(
    getRandomQuizQuestion()
  )
  const getRandomNote = useCallback(
    (questionType: QuestionTypeType, majMin: MajorMinorType) => {
      return questionType === 'fifth' ? getRandomFifth(majMin) : getRandomKey()
    },
    []
  )
  const [currentQuestionKey, setCurrentQuestionKey] = useState<string>(
    getRandomNote(currentQuestion.type, currentQuestion.majMin)
  )

  const [currentOptions, setCurrentOptions] = useState<string[]>([])

  const onLoadCallback = useCallback(() => {
    if (isListening) return
    invoke('open_midi_connection', { inputIdx: 0 })

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
    setIsListening(true)
  }, [isListening, setIsListening])

  useEffect(() => {
    onLoadCallback()
  }, [onLoadCallback, isListening])

  useEffect(() => {
    const unlisten = async () => {
      unlistenRef.current?.()
    }
    return () => {
      unlisten()
    }
  }, [])

  useEffect(() => {
    setCurrentOptions(() => {
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
            CIRCLE_OF_FIFTHS[currentQuestion.majMin],
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
          CIRCLE_OF_FIFTHS[currentQuestion.majMin],
          currentQuestionKey,
          randomNote
        )
        if (isFifth) {
          correctAnswer = randomNote
          break
        }
      }

      newOptions[Math.floor(Math.random() * newOptions.length)] = correctAnswer

      return newOptions
    })
  }, [
    currentQuestion.majMin,
    currentQuestionKey,
    getRandomNote,
    currentQuestion.type,
  ])

  return (
    <QuizPage>
      <QuizQuestion>
        {formatQuestion(currentQuestion.questionFormat, {
          key: currentQuestionKey,
          majMin: currentQuestion.majMin,
        })}
      </QuizQuestion>
      <QuizOptionsContainer>
        {currentOptions.map((co, i) => {
          const isCorrect = isAdjacentFifth(
            CIRCLE_OF_FIFTHS[currentQuestion.majMin],
            currentQuestionKey,
            co
          )

          return (
            <QuizOption
              key={i}
              isAnswer={isCorrect}
              onClick={(value, isAnswer) => {
                if (isAnswer) {
                  setCurrentQuestion(() => {
                    const newQ = getRandomQuizQuestion()
                    setCurrentQuestionKey(getRandomNote(newQ.type, newQ.majMin))
                    return newQ
                  })
                }
              }}
              value={co}
            >
              {co}
            </QuizOption>
          )
        })}
      </QuizOptionsContainer>
    </QuizPage>
  )
}

export default Quiz
