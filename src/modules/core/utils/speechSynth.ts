import keyBy from 'lodash/keyBy';

const SpeechSynth: SpeechSynthesis | null = globalThis?.speechSynthesis ?? null;
const SpeechUtterance: typeof SpeechSynthesisUtterance | null =
  globalThis?.SpeechSynthesisUtterance ?? null;

const createUtterance = (): SpeechSynthesisUtterance => {
  if (!SpeechUtterance) {
    return {} as SpeechSynthesisUtterance;
  }
  return new SpeechUtterance();
};

const getSpeechVoices = (): Promise<SpeechSynthesisVoice[]> =>
  // Voice loading is async.
  // See https://stackoverflow.com/a/52005323/9788634
  new Promise((res, rej) => {
    let id;

    id = setInterval(() => {
      const voices = SpeechSynth?.getVoices() ?? [];

      if (!voices.length) {
        return;
      }

      res(SpeechSynth?.getVoices());
      clearInterval(id);
    }, 10);
  });

export const createSpeechSynth = (
  // Selected voices are good-sounding voices where localService === true & voice.lang.toLowerCase().startsWith('en')
  preferredVoiceURIs: string[] = ['tessa', 'moira', 'samantha'],
) => {
  const utterance = createUtterance();

  const loadVoice = async (): Promise<void> => {
    const availableVoices = keyBy(await getSpeechVoices(), (voice) =>
      voice.voiceURI.toLowerCase(),
    );

    // Find first matching voice, in order of preference
    const preferredVoice = preferredVoiceURIs.find(
      (voiceURI) => availableVoices[voiceURI],
    );

    utterance.voice = preferredVoice ? availableVoices[preferredVoice] : null;
  };

  const speak = (text: string) => {
    if (SpeechSynth?.speaking) return;
    utterance.text = text;
    SpeechSynth.speak(utterance);
  };

  return {
    utterance,
    speak,
    loadVoice,
  };
};
