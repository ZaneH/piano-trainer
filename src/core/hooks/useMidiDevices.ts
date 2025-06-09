/**
 * Custom hook for handling MIDI devices and input
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { UnlistenFn } from '@tauri-apps/api/event'
import {
  listMidiConnections,
  openMidiConnection,
  subscribeMidiMessages,
  MidiNoteEvent,
} from '../services/midiService'
import { MidiDevice } from '../models/types'

interface UseMidiDevicesProps {
  onNoteOn?: (note: number) => void
  onNoteOff?: (note: number) => void
  initialDeviceId?: number
}

interface UseMidiDevicesResult {
  devices: MidiDevice[]
  currentDevice: MidiDevice | null
  connectToDevice: (deviceId: number) => Promise<void>
  refreshDevices: () => Promise<void>
  activeNotes: Record<number, boolean>
}

export function useMidiDevices({
  onNoteOn,
  onNoteOff,
  initialDeviceId,
}: UseMidiDevicesProps = {}): UseMidiDevicesResult {
  const [devices, setDevices] = useState<MidiDevice[]>([])
  const [currentDevice, setCurrentDevice] = useState<MidiDevice | null>(null)
  const [activeNotes, setActiveNotes] = useState<Record<number, boolean>>({})
  const unlistenRef = useRef<UnlistenFn | null>(null)

  // Handler for MIDI events
  const handleMidiEvent = useCallback(
    (event: MidiNoteEvent) => {
      const { note, isNoteOn } = event

      if (isNoteOn) {
        setActiveNotes((prev) => ({ ...prev, [note]: true }))
        onNoteOn?.(note)
      } else {
        setActiveNotes((prev) => ({ ...prev, [note]: false }))
        onNoteOff?.(note)
      }
    },
    [onNoteOn, onNoteOff]
  )

  // Load available MIDI devices
  const refreshDevices = useCallback(async () => {
    try {
      const availableDevices = await listMidiConnections()
      setDevices(availableDevices)
      return availableDevices
    } catch (error) {
      console.error('Error refreshing MIDI devices:', error)
      return []
    }
  }, [])

  // Connect to a specific MIDI device
  const connectToDevice = useCallback(
    async (deviceId: number) => {
      try {
        // Clean up previous connection if exists
        if (unlistenRef.current) {
          await unlistenRef.current()
          unlistenRef.current = null
        }

        await openMidiConnection(deviceId)

        // Set up listener for MIDI messages
        const unlisten = await subscribeMidiMessages(handleMidiEvent)
        unlistenRef.current = unlisten

        // Find and set the current device
        const deviceList = await refreshDevices()
        const selectedDevice = deviceList.find((d) => d.id === deviceId) || null
        setCurrentDevice(selectedDevice)

        console.log(
          `Connected to MIDI device: ${selectedDevice?.name || deviceId}`
        )
      } catch (error) {
        console.error('Error connecting to MIDI device:', error)
      }
    },
    [handleMidiEvent, refreshDevices]
  )

  // Initial setup
  useEffect(() => {
    const setup = async () => {
      const deviceList = await refreshDevices()

      // Connect to initial device if specified
      if (
        initialDeviceId !== undefined &&
        deviceList.some((d) => d.id === initialDeviceId)
      ) {
        connectToDevice(initialDeviceId)
      } else if (deviceList.length > 0) {
        // Otherwise connect to first available device
        connectToDevice(deviceList[0].id)
      }
    }

    setup()

    // Cleanup on unmount
    return () => {
      if (unlistenRef.current) {
        unlistenRef.current()
      }
    }
  }, [initialDeviceId, connectToDevice, refreshDevices])

  return {
    devices,
    currentDevice,
    connectToDevice,
    refreshDevices,
    activeNotes,
  }
}
