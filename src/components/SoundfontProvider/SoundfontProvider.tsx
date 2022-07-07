// Based on SoundfontProvider
// https://github.com/kevinsqi/react-piano/blob/master/demo/src/SoundfontProvider.js
import { useCallback, useEffect, useMemo, useState } from 'react'
import Soundfont, { InstrumentName, Player } from 'soundfont-player'

interface SoundfontProviderProps {
  instrumentName: InstrumentName
  hostname: string
  format: 'mp3' | 'ogg'
  soundfont: 'MusyngKite' | 'FluidR3_GM'
  onLoad: Function
  render: ({
    playNote,
    stopNote,
  }: {
    playNote: Function
    stopNote: Function
  }) => JSX.Element
}

const SoundfontProvider = ({
  instrumentName = 'acoustic_grand_piano',
  hostname,
  format = 'mp3',
  soundfont = 'MusyngKite',
  render,
}: SoundfontProviderProps) => {
  const [instrument, setInstrument] = useState<Player>()
  const [activeAudioNodes, setActiveAudioNodes] = useState<{
    [note: string]: any
  }>({})

  const audioContext = useMemo(
    () => new (window.AudioContext || window.webkitAudioContext)(),
    []
  )

  const playNote = (midiNumber: string) => {
    resumeAudio().then(() => {
      const audioNode = instrument?.play(midiNumber)
      setActiveAudioNodes((aan) => ({
        ...aan,
        [midiNumber]: audioNode,
      }))
    })
  }

  const stopNote = (midiNumber: string) => {
    resumeAudio().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return
      }

      const audioNode = activeAudioNodes[midiNumber]
      audioNode.stop()
      setActiveAudioNodes((aan) => ({
        ...aan,
        [midiNumber]: null,
      }))
    })
  }

  const resumeAudio = () => {
    if (audioContext?.state === 'suspended') {
      return audioContext.resume()
    } else {
      return Promise.resolve()
    }
  }

  const loadInstrument = useCallback(
    (name: InstrumentName) => {
      if (!audioContext) {
        console.error("Couldn't create an audio context")
        return
      }

      return Soundfont.instrument(audioContext, name, {
        format,
        soundfont,
        nameToUrl: (name: string, soundfont: any, format: string) => {
          return `${hostname}/${soundfont}/${name}-${format}.js`
        },
      })
    },
    [audioContext, format, hostname, soundfont]
  )

  useEffect(() => {
    loadInstrument(instrumentName)?.then((i) => setInstrument(i))
  }, [instrumentName, loadInstrument])

  return render({ playNote, stopNote })
}

export default SoundfontProvider
