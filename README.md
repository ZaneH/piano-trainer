<a href="https://www.producthunt.com/posts/piano-trainer?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-piano&#0045;trainer" target="_blank"><img align="right" src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=351951&theme=light&period=monthly&topic_id=204" alt="Piano&#0032;Trainer - Memorize&#0032;piano&#0032;scales&#0032;and&#0032;chords&#0032;with&#0032;ease | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Piano Trainer

Learn to play the piano at your own pace through various modes of practice. [Watch the video](https://vimeo.com/730642802)

<p align="center">
<img alt="Piano Trainer screenshot" src="https://i.imgur.com/Nxg1706.png" height="250px" />
<img alt="Piano Trainer screenshot #2" src="https://i.imgur.com/mBg1fjH.png" height="250px" />
</p>

## Features

- [x] MIDI compatible
  - [x] Home row keyboard input
- [x] Cross-platform support
- [x] Interactive scale practice
- [x] Interactive chord practice
- [x] Interactive fifths practice
- [x] Interactive quiz
- [x] Hard mode

## Coming Soon

- [ ] Interactive inversion practice
- [ ] Settings
  - [ ] Toggle questions in quiz mode
  - [x] Change keyboard sound

# Releases

Download for free on all platforms on [itch.io/piano-trainer](https://zaneh.itch.io/piano-trainer)

or download the [latest build here](https://github.com/ZaneH/piano-trainer/releases)

## Run Locally

You'll need to setup Rust and Tauri CLI by following the [Getting Started guide here](https://tauri.app/v1/guides/getting-started/prerequisites).

```bash
$ git clone https://github.com/ZaneH/piano-trainer.git
$ cd piano-trainer
$ yarn tauri dev
```

## Build Target Binary

Outputs to `./src-tauri/target/release/bundle`

```bash
$ yarn tauri build
```

# Contributions

Contributions are more than welcome. Read the [Technical Breakdown here](https://github.com/ZaneH/piano-trainer/wiki/Technical-Breakdown) to learn about the codebase.

Create a PR pointing to the `dev` branch. Stable builds will be merged into `master`.

Code formatting is automically handled with Git Hooks.

# Credit

Special thank you to [ruohki/tauri-midi-example](https://github.com/ruohki/tauri-midi-example), [kevinsqi/react-piano](https://github.com/kevinsqi/react-piano), and the [Tauri Discord community](https://tauri.app/).
