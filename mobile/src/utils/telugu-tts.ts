import * as Speech from 'expo-speech';

export const playTeluguTTS = async (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      Speech.speak(text, {
        language: 'te-IN', // Telugu (India)
        pitch: 1.0,
        rate: 0.8,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: (error) => reject(error),
      });
    } catch (error) {
      console.error('TTS Error:', error);
      reject(error);
    }
  });
};

export const stopTTS = (): void => {
  Speech.stop();
};

