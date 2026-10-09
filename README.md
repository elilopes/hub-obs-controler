# Central Hub OBS - Controle de Transmissão

Painel de controle web profissional para OBS Studio (protocolo WebSocket v5), transmissões Multi-RTMP simultâneas, salas de convidados remotos via VDO.Ninja, automação de enquadramento vertical com Aitum Vertical, disparadores e automações inteligentes com Advanced Scene Switcher, mixer de áudio com redução de ruído e letreiro dinâmico de avisos.

## Principais Funcionalidades

- **Controle Mestre & Cenas**: Troca de cenas em tempo real (`Cena_Principal`, `Apresentacao`, `Gameplay`, `Webcam_FullScreen`, `BRB_Intervalo`, etc.), gerador de coleções com filtros Move Transition, injeção de fontes de webcam e mídias, controle PTZ Virtual (Pan, Tilt, Zoom suave) e gravação de buffer de replay.
- **Mixer de Áudio & Reprodutor Multimídia**: Fader master com VU-meter estéreo (-60dB a 0dB), filtros RNNoise/Compressor, Smart Ducking inteligente para diminuir música de fundo durante a fala, player de vídeo remoto e passador de slides.
- **Letreiro Dinâmico & Alertas**: Atualização de lower-third / ticker no OBS sem reiniciar cenas, controle de efeito piscar, paleta de cores e pré-visualização em tempo real.
- **VDO.Ninja Control Room**: Geração de salas WebRTC instantâneas, links limpos para Browser Source no OBS, links de convite para convidados, controle de áudio remoto (mute), kick e chat técnico interno.
- **Multi-RTMP & Aitum Vertical**: Transmissão simultânea para múltiplos alvos (Twitch, Kick, Facebook, YouTube Secundário) e sincronização do canvas 9:16 para TikTok e Reels.
- **Chaveador Automático**: Criação de regras de automação baseadas em status de transmissão, fim de mídias e silêncio no microfone com exportação para o plugin Advanced Scene Switcher do OBS.
- **Logins & Chaves**: Integração OAuth2 com YouTube Live API e suporte ao plugin WordPress WPStream para recuperação de endpoints RTMP dinâmicos.
- **Guia de Referência**: Documentação técnica bilíngue (Português/Inglês) de todos os métodos desenvolvida por Elias Lopes.

## Execução

```bash
npm install
npm run dev
```
