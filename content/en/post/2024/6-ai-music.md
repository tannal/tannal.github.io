---
title: Training an AI for melody creating
date: 2024-09-14 19:23:11+0000
categories:
    - Music Creation
tags:
    - Open Source
    - Transformer
---

<script defer src="/youtube.js" type="module"></script>
<script defer typse="module" src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.4.0"></script>


<midi-visualizer type="piano-roll" id="myVisualizer"></midi-visualizer>

<midi-player
  src="https://tannal.github.io/test.mid"
  sound-font visualizer="#myVisualizer">
</midi-player>

<script defer src="/bilibili-player.js" type="module"></script>

<!-- <bilibili-player bvid="BV1sxtsegEf3"></bilibili-player>; -->

## Music theory

- melody
- harmony
- rhythm

## Dataset

- Lakh MIDI Dataset 包含 17 万多个 MIDI 文件。

https://colinraffel.com/projects/lmd/#get

- MAESTRO Dataset 古典钢琴音乐数据集。

https://magenta.tensorflow.org/datasets/maestro

- FMA (Free Music Archive) 包含各种流派的音频文件。

https://freemusicarchive.org/search/?quicksearch=&search-genre=Classical

- MusicNet 古典音乐数据集，带有乐器、音高等标注。
- Million Song Dataset 大规模音乐元数据集。
- RWC (Real World Computing) Music Database 包含流行音乐、古典音乐等多种类型。
- NSynth Dataset 由 Google 发布的单音音色数据集。
- MUSDB18 多轨音乐分离数据集。
- Nottingham Database 民谣曲调数据集。
- Bach Chorales Dataset 巴赫合唱曲数据集。

## Tranditional Music Generation

- Rule-based
- Markov Chain
- Hidden Markov Model

## Neural Network Music Generation

- LSTM
- GRU
- Transformer
- VAE
- GAN
- RL


## Music assistant tools


##  Related Work

- [Magenta](https://magenta.tensorflow.org/)

- [OpenAI Jukebox](https://openai.com/research/jukebox/)

- [Google Magenta](https://magenta.tensorflow.org/)

- [DeepJ](https://deepj.net/)

- [AIVA](https://www.aiva.ai/)

- [Amper Music](https://www.ampermusic.com/)

- [Jukedeck](https://www.jukedeck.com/)

- [Flow Machines](https://www.flow-machines.com/)

- [MuseNet](https://openai.com/research/jukebox/)

- [NSynth](https://magenta.tensorflow.org/nsynth)

- [MusicVAE](https://magenta.tensorflow.org/music-vae)

- [DDSP](https://magenta.tensorflow.org/ddsp)

- [Onsets and Frames](https://magenta.tensorflow.org/onsets-frames)

## Appendix


### Mixed precision training

- [Mixed precision training](https://pytorch.org/docs/stable/notes/amp_examples.html)

stochastic_rounding is a technique that can be used to improve the accuracy of the model when using mixed precision training. It is a rounding technique that rounds to the nearest even integer, which can help reduce the bias introduced by rounding errors.

It is used in Adamw optimizer and encoder in the transformer model.

Parameters update in the optimizer is done in FP32, while the model weights are stored in FP16. This can lead to a loss of precision in the model weights, which can affect the accuracy of the model. stochastic_rounding can help reduce this loss of precision by rounding the model weights to the nearest even integer.