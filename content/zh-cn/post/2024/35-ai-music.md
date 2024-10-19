---
title: 大模型音乐创作和生成
date: 2024-10-11 19:23:11+0000
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

## 辅助作曲

第一，商业公司：

1. OpenAI (Jukebox)
2. Google (MusicLM)
3. Meta (AudioCraft)
4. Spotify (AI DJ)
5. AIVA Technologies
6. Amper Music (now part of Shutterstock)
7. Endel
8. Boomy
9. Soundraw
10. MuseNet (OpenAI)

第二，开源项目：

1. Magenta (Google)
2. AudioLDM
3. Riffusion
4. DiffSinger
5. RAVE (Realtime Audio Variational autoEncoder)
6. Mubert
7. Audiocraft (Meta's open-source audio generation tools)

第三，高校实验室研究所：

1. Center for Computer Research in Music and Acoustics (CCRMA) at Stanford University
2. Music and Audio Research Lab (MARL) at NYU
3. Music Technology Group at Universitat Pompeu Fabra
4. Institute for Music Informatics and Musicology at University of Music Karlsruhe
5. Center for Music Technology at Georgia Tech

第四，社区项目：

1. MuseTree
2. AI Music Generation Challenge on Kaggle
3. AI Song Contest
4. OpenAI Whisper (while primarily for speech recognition, it has potential music applications)

## 编曲

第一，商业公司：

1. Amper Music (现为Shutterstock的一部分) - 提供AI辅助作曲和编曲服务
2. AIVA Technologies - 专注于AI辅助作曲
3. Splice - 提供AI驱动的音乐创作工具
4. Landr - 提供AI辅助编曲和制作服务
5. Izotope (Neutron, Ozone) - 提供智能混音和母带制作工具
6. Native Instruments - 开发了一些AI辅助音乐创作工具
7. Accusonus - 提供AI驱动的音频修复和编辑工具
8. Melodrive - 专注于自适应和交互式音乐生成

第二，开源项目：

1. Magenta (Google) - 提供多种音乐生成和编辑工具
2. DDSP (Differentiable Digital Signal Processing) - 可用于音色合成和转换
3. MuseNet (OpenAI) - 可用于生成音乐创意
4. Audiocraft (Meta) - 包含音乐生成和编辑工具

第三，高校实验室研究所：

1. Center for Computer Research in Music and Acoustics (CCRMA) at Stanford University
2. Music and Audio Research Lab (MARL) at NYU
3. Music Technology Group at Universitat Pompeu Fabra
4. Institute for Computational Perception at Johannes Kepler University Linz
5. Music Informatics Research Group at City University of London

第四，社区项目：

1. MuseScore (虽然主要是乐谱软件，但正在集成AI功能)
2. LMMS (Linux MultiMedia Studio) - 开源DAW，有潜力集成AI功能
3. Ardour - 另一个开源DAW，可能会集成AI辅助功能
4. AI Music Composition Challenge on Kaggle - 可能产生相关工具和算法

需要注意的是：

1. 许多传统的DAW（数字音频工作站）软件公司，如Ableton、FL Studio、Logic Pro等，也在逐步整合AI功能来辅助创作和编曲过程。

2. 一些大型科技公司（如Google、Apple、Amazon）虽然目前可能没有直接的竞争产品，但他们在AI和音乐技术方面的研究可能随时转化为竞争产品。

3. 音乐创作辅助和AI编曲是一个快速发展的领域，新的项目和工具可能会不断出现。

如果您认为还有其他重要的竞争对手或项目被遗漏了，请告诉我，我会很乐意补充和更新这个列表。

<!-- <bilibili-player bvid="BV1sxtsegEf3"></bilibili-player>; -->

## Music theory

- melody
- harmony
- rhythm

## 

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