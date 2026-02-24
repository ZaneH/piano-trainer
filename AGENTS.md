# AGENTS.md

This file gives future Codex runs project-specific context for `piano-trainer`.

## Core Intent

- Prioritize behavior correctness over UI polish when touching MIDI paths.
- Keep fixes scoped. Do not make speculative refactors in unrelated files.
- If user reports a regression, first revert unstable logic, then add tests, then reapply minimal fix.

## Closing The Loop (Required Workflow)

For any MIDI/input/progression fix:

1. Reproduce from current code and identify exact code path.
2. Add or update a focused test that fails before the fix.
3. Implement the smallest fix that makes the test pass.
4. Run targeted tests and a build before handoff.
5. Report exactly what changed and what was validated.

Minimum validation commands:

- `CI=true npm test -- --runTestsByPath <path-to-test>`
- `npm run build`

## MIDI Behavior Contracts

### iOS Web MIDI input enumeration

- On iOS Web MIDI Browser, `inputs` can be Map-like but not fully iterable with typical helpers.
- Use key iteration (`map.keys().next()` loop) for stable device enumeration and lookup.
- Keep this behavior in `src/core/services/midiService.ts`.

### Scale progression note matching

- In **scales** mode, progression is octave-agnostic by design.
- Matching should accept the target pitch class across octaves.
- Prefer exact MIDI match first if present, then fallback to same note name.
- Current helper: `findExactScaleMatch` in `src/core/hooks/usePianoKeyboard.ts`.
- Tests for this behavior live in `src/core/hooks/usePianoKeyboard.test.ts`.

### Visual keyboard feedback

- Avoid remapping active MIDI notes in ways that alter perceived octave correctness.
- If a display mapping is needed, it must be deterministic and covered by tests.
- Prefer showing raw MIDI notes by expanding visible range over implicit octave folding.

## Known Pitfalls

- Converting MIDI numbers to note names (`midiNumberToNote`) removes octave.
- That is useful for pitch-class matching but dangerous where exact octave matters.
- Be explicit about when octave should and should not be preserved.

## Existing Repo Realities

- Working tree may be dirty. Never revert unrelated user changes.
- There are existing non-blocking build warnings from `midimessage` sourcemap resolution.
- The project currently runs with `npm` in this environment (not `yarn`).

## File Pointers

- Web MIDI service: `src/core/services/midiService.ts`
- MIDI-driven progression logic: `src/core/hooks/usePianoKeyboard.ts`
- Bottom keyboard UI/input rendering: `src/components/Keyboard/Keyboard.tsx`
- Scale generation and MIDI roots: `src/core/services/scaleService.ts`
