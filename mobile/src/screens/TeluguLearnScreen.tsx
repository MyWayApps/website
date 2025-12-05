import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { playTeluguTTS } from '../utils/telugu-tts';

type TeluguLearnNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeluguLearn'>;
type TeluguLearnRouteProp = RouteProp<RootStackParamList, 'TeluguLearn'>;

interface Props {
  navigation: TeluguLearnNavigationProp;
  route: TeluguLearnRouteProp;
}

const matraData = [
  { matra: '', name: 'అ కారము' },
  { matra: 'ా', name: 'ఆ కారము' },
  { matra: 'ి', name: 'ఇ కారము' },
  { matra: 'ీ', name: 'ఈ కారము' },
  { matra: 'ు', name: 'ఉ కారము' },
  { matra: 'ూ', name: 'ఊ కారము' },
  { matra: 'ృ', name: 'ఋ కారము' },
  { matra: 'ౄ', name: 'ౠ కారము' },
  { matra: 'ె', name: 'ఎ కారము' },
  { matra: 'ే', name: 'ఏ కారము' },
  { matra: 'ై', name: 'ఐ కారము' },
  { matra: 'ొ', name: 'ఒ కారము' },
  { matra: 'ో', name: 'ఓ కారము' },
  { matra: 'ౌ', name: 'ఔ కారము' },
  { matra: 'ం', name: 'పూర్ణాను స్వారము' },
  { matra: 'ః', name: 'విసర్గం' },
];

export default function TeluguLearnScreen({ navigation, route }: Props) {
  const { consonant } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentMatra = matraData[currentIndex];
  const result = consonant + currentMatra.matra;

  useEffect(() => {
    // Auto-play when index changes
    const timer = setTimeout(() => {
      playAudio();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const playAudio = async () => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      await playTeluguTTS(result);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < matraData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {matraData.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / matraData.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.consonant}>{consonant}</Text>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.matra}>{currentMatra.matra || '(none)'}</Text>
          <Text style={styles.equals}>=</Text>
          <Text style={styles.result}>{result}</Text>
          <Text style={styles.name}>{currentMatra.name}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, currentIndex === 0 && styles.buttonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.buttonText}>← Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={playAudio}
            disabled={isPlaying}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? '🔊 Playing...' : '🔊 Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>↻ Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              currentIndex === matraData.length - 1 && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === matraData.length - 1}
          >
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  consonant: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  plus: {
    fontSize: 32,
    color: '#4B5563',
    marginBottom: 8,
  },
  matra: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 8,
  },
  equals: {
    fontSize: 32,
    color: '#4B5563',
    marginBottom: 8,
  },
  result: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    margin: 4,
    minWidth: 100,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
});

