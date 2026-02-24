import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import KVProvider from './core/providers/KVProvider'
import SidebarProvider from './core/providers/SidebarProvider'
import TrainerProvider from './core/providers/TrainerProvider'
import {
  isEditableTarget,
  shouldPreventDoubleTapDefault,
} from './core/services/touchGuard'
import ScreenManager from './components/ScreenManager/ScreenManager'
import Keyboard from './components/Keyboard'
import { TrainerDisplay, TrainerPiano } from './components/Trainer'
import { Quiz } from './components/Quiz'

import './i18n/config'

const PracticeScreenLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const QuizScreenLayout = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

function App() {
  const lastTouchStartRef = useRef(0)

  // Handle keyboard events for the app
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key, metaKey } = e
    let preventDefault = true

    if (key === 'q' && metaKey) {
      preventDefault = false
    }

    if (preventDefault) {
      e.preventDefault()
    }
  }, [])

  const preventSelectionDefault = useCallback((e: Event) => {
    if (isEditableTarget(e.target)) {
      return
    }

    e.preventDefault()
  }, [])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const now = Date.now()
    if (
      shouldPreventDoubleTapDefault(lastTouchStartRef.current, now, e.target)
    ) {
      e.preventDefault()
    }
    lastTouchStartRef.current = now
  }, [])

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', preventSelectionDefault)
    document.addEventListener('contextmenu', preventSelectionDefault)
    document.addEventListener('gesturestart', preventSelectionDefault)
    document.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', preventSelectionDefault)
      document.removeEventListener('contextmenu', preventSelectionDefault)
      document.removeEventListener('gesturestart', preventSelectionDefault)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [handleKeyDown, handleTouchStart, preventSelectionDefault])

  return (
    <KVProvider>
      <SidebarProvider>
        <TrainerProvider>
          <ScreenManager
            practice={
              <PracticeScreenLayout>
                <TrainerPiano />
                <TrainerDisplay />
                <Keyboard />
              </PracticeScreenLayout>
            }
            quiz={
              <QuizScreenLayout>
                <Quiz />
              </QuizScreenLayout>
            }
          />
        </TrainerProvider>
      </SidebarProvider>
    </KVProvider>
  )
}

export default App
