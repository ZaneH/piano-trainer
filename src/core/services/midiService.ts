/**
 * MIDI service for handling MIDI connections and events
 */
import { invoke, isTauri } from '@tauri-apps/api/core'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { MidiDevice } from '../models/types'

export interface MidiMessage {
  message: number[]
}

export interface MidiNoteEvent {
  note: number
  velocity: number
  isNoteOn: boolean
}

export async function listMidiConnections(): Promise<MidiDevice[]> {
  if (isTauri()) {
    return listMidiConnectionsTauri()
  } else {
    return listMidiConnectionsWeb()
  }
}

export async function openMidiConnection(deviceId: number): Promise<void> {
  if (isTauri()) {
    return openMidiConnectionTauri(deviceId)
  } else {
    return openMidiConnectionWeb(deviceId)
  }
}

export async function subscribeMidiMessages(
  callback: (event: MidiNoteEvent) => void
): Promise<UnlistenFn> {
  if (isTauri()) {
    return subscribeMidiMessagesTauri(callback)
  } else {
    return subscribeMidiMessagesWeb(callback)
  }
}

async function listMidiConnectionsTauri(): Promise<MidiDevice[]> {
  try {
    const devicesObject = (await invoke('list_midi_connections')) as Record<
      number,
      string
    >
    return Object.entries(devicesObject).map(([id, name]) => ({
      id: Number(id),
      name,
    }))
  } catch (error) {
    console.error('Error listing MIDI connections:', error)
    return []
  }
}

async function openMidiConnectionTauri(deviceId: number): Promise<void> {
  try {
    await invoke('open_midi_connection', { inputIdx: deviceId })
    console.log(`Connected to MIDI device with ID: ${deviceId}`)
  } catch (error) {
    console.error('Error opening MIDI connection:', error)
    throw error
  }
}

async function subscribeMidiMessagesTauri(
  callback: (event: MidiNoteEvent) => void
): Promise<UnlistenFn> {
  try {
    return await listen('midi_message', (event) => {
      const payload = event.payload as { message: number[] }
      const [status, note, velocity] = payload.message

      const command = status & 0xf0
      const isNoteOn = command === 0x90 && velocity > 0

      callback({
        note,
        velocity,
        isNoteOn,
      })
    })
  } catch (error) {
    console.error('Error subscribing to MIDI messages:', error)
    throw error
  }
}

let webMidiAccess: any | null = null
let currentConnection: any | null = null

async function listMidiConnectionsWeb(): Promise<MidiDevice[]> {
  const nav = navigator as any
  try {
    if (!nav.requestMIDIAccess) {
      throw new Error('Web MIDI API not supported in this browser')
    }

    webMidiAccess = await nav?.requestMIDIAccess()
    const devices: MidiDevice[] = []

    let id = 0
    webMidiAccess?.inputs.forEach((input: any) => {
      devices.push({
        id: id++,
        name: input?.name || 'Unknown Device',
      })
    })

    return devices
  } catch (error) {
    console.error('Error listing Web MIDI connections:', error)
    return []
  }
}

async function openMidiConnectionWeb(deviceId: number): Promise<void> {
  try {
    if (!webMidiAccess) {
      throw new Error('MIDI access not initialized')
    }

    const inputs = Array.from(webMidiAccess.inputs.values())
    const selectedInput = inputs[deviceId]
    console.log({ selectedInput })

    if (!selectedInput) {
      throw new Error(`No MIDI input found at index ${deviceId}`)
    }

    currentConnection = selectedInput
    console.log(`Connected to Web MIDI device: ${(selectedInput as any)?.name}`)
  } catch (error) {
    console.error('Error opening Web MIDI connection:', error)
    throw error
  }
}

async function subscribeMidiMessagesWeb(
  callback: (event: MidiNoteEvent) => void
): Promise<UnlistenFn> {
  try {
    if (!currentConnection) {
      throw new Error('No MIDI connection established')
    }

    const handleMidiMessage = (event: any) => {
      const [status, note, velocity] = event.data
      const command = status & 0xf0
      const isNoteOn = command === 0x90 && velocity > 0

      callback({
        note,
        velocity,
        isNoteOn,
      })
    }

    currentConnection.addEventListener('midimessage', handleMidiMessage)

    // Return unsubscribe function
    return () => {
      if (currentConnection) {
        currentConnection.removeEventListener('midimessage', handleMidiMessage)
      }
    }
  } catch (error) {
    console.error('Error subscribing to Web MIDI messages:', error)
    throw error
  }
}
