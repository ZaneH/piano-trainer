import styled, { css } from 'styled-components'

const QuizOptionButton = styled.div<{ isAnswer: boolean }>`
  width: 20vw;
  height: 20vw;
  max-width: 200px;
  max-height: 200px;
  background-color: #797979;
  color: white;
  font-size: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.125s ease;

  &:hover {
    background-color: #626263;
  }

  ${({ isAnswer }) =>
    isAnswer
      ? css`
          &:active {
            background-color: green;
          }
        `
      : css`
          &:active {
            background-color: red;
          }
        `}
`

interface QuizOptionsProps {
  children?: React.ReactNode
  value: string
  isAnswer: boolean

  onClick?: (value: string, isAnswer: boolean) => void
}

const QuizOption = ({
  children,
  onClick,
  value,
  isAnswer,
}: QuizOptionsProps) => {
  return (
    <QuizOptionButton
      isAnswer={isAnswer}
      onClick={() => onClick?.(value, isAnswer)}
    >
      {children}
    </QuizOptionButton>
  )
}

export { QuizOption }
