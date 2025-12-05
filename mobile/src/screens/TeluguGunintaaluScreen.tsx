import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type TeluguGunintaaluNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeluguGunintaalu'>;

interface Props {
  navigation: TeluguGunintaaluNavigationProp;
}

const teluguConsonants = [
  'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ',
  'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద',
  'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య',
  'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', 'ళ', 'క్ష'
];

const gameTypes = [
  { id: 'learn', name: 'Learn', icon: '📚', route: 'learn' },
  { id: 'sequence', name: 'Sequence', icon: '🔢', route: 'sequence' },
  { id: 'missing', name: 'Missing Letters', icon: '❓', route: 'missing' },
  { id: 'match', name: 'Match the Pair', icon: '🎯', route: 'match' },
];

export default function TeluguGunintaaluScreen({ navigation }: Props) {
  const handleConsonantPress = (consonant: string, gameType: string) => {
    if (gameType === 'learn') {
      navigation.navigate('TeluguLearn', { consonant });
    } else {
      navigation.navigate('TeluguGame', {
        gameType: gameType as 'sequence' | 'missing' | 'match',
        consonant,
      });
    }
  };

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>గుణింతాలు</Text>
        <Text style={styles.subtitle}>Telugu Gunintaalu</Text>

        <View style={styles.gameTypesContainer}>
          {gameTypes.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameTypeCard}
              onPress={() => {
                // Show consonant selection
                Alert.alert('Select Consonant', 'Choose a consonant to play', [
                  ...teluguConsonants.slice(0, 5).map((c) => ({
                    text: c,
                    onPress: () => handleConsonantPress(c, game.route),
                  })),
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <Text style={styles.gameName}>{game.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Consonant</Text>
        <View style={styles.consonantGrid}>
          {teluguConsonants.map((consonant, index) => (
            <TouchableOpacity
              key={index}
              style={styles.consonantCard}
              onPress={() => {
                // Default to learn mode
                navigation.navigate('TeluguLearn', { consonant });
              }}
            >
              <Text style={styles.consonantText}>{consonant}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  gameTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  gameTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    width: '45%',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gameIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  consonantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  consonantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  consonantText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});

