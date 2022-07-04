import Keyboard from './components/Keyboard'
import { useCallback, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

function App() {
  const [isListening, setIsListening] = useState(false)

  const onLoadCallback = useCallback(() => {
    if (isListening) return
    invoke('open_midi_connection', { inputIdx: 0 })

    listen('midi_message', (event) => {
      console.log(event)
    }).catch(console.error)

    console.log('Ready...')
    setIsListening(true)
  }, [isListening, setIsListening])

  useEffect(() => {
    onLoadCallback()
  }, [onLoadCallback, isListening])

  return (
    <div className='App'>
      <Keyboard />
    </div>
  )
}

export default App
