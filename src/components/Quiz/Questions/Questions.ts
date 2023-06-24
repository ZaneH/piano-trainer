export type MajorMinorType = 'Major' | 'Minor'

export type QuestionTypeType = 'fifth' | 'key'
type QuizQuestionType = {
  type: QuestionTypeType
  majMin?: MajorMinorType
}

export const QUIZ_QUESTIONS: QuizQuestionType[] = [
  {
    type: 'fifth',
    majMin: 'Major',
  },
  {
    type: 'fifth',
    majMin: 'Minor',
  },
  {
    type: 'key',
  },
  {
    type: 'key',
  },
]

/**
 * Get a random quiz question type from QUIZ_QUESTIONS.
 * @returns {QuizQuestionType} Returns a random type of question
 */
export const getRandomQuizQuestion = () => {
  return QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]
}

/**
 * Format a question and replace the placeholders with the provided values.
 * @param questionFormat The wording of the question, replace {{key}} with string from keys
 * @param keys Dictionary of keys to replace {{key}} with
 * @returns Returns a string formatted with the keys
 */
export const formatQuestion = (
  questionFormat: string,
  keys: {
    [key in Partial<keyof QuizQuestionType> | string]: string | undefined
  }
) => {
  let formattedQuestion = questionFormat
  for (const k in keys) {
    formattedQuestion = formattedQuestion.replace(`{{${k}}}`, keys[k]!)
  }

  return formattedQuestion
}
