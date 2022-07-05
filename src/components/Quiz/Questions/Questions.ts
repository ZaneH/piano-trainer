export type MajorMinorType = 'Major' | 'Minor'

export type QuestionTypeType = 'fifth'
type QuizQuestionType = {
  type: QuestionTypeType
  majMin: MajorMinorType
  questionFormat: string
}

export const QUIZ_QUESTIONS: QuizQuestionType[] = [
  {
    type: 'fifth',
    majMin: 'Major',
    questionFormat: 'Which is perfect fifth of {{key}} ({{majMin}})?',
  },
  {
    type: 'fifth',
    majMin: 'Minor',
    questionFormat: 'Which is perfect fifth of {{key}} ({{majMin}})?',
  },
]

export const getRandomQuizQuestion = () => {
  return QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]
}

export const formatQuestion = (
  questionFormat: string,
  keys: { [key in Partial<keyof QuizQuestionType> | string]: string }
) => {
  let formattedQuestion = questionFormat
  for (const k in keys) {
    formattedQuestion = formattedQuestion.replace(`{{${k}}}`, keys[k])
  }

  return formattedQuestion
}
