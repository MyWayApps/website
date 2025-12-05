import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type TeluguGameNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeluguGame'>;
type TeluguGameRouteProp = RouteProp<RootStackParamList, 'TeluguGame'>;

interface Props {
  navigation: TeluguGameNavigationProp;
  route: TeluguGameRouteProp;
}

export default function TeluguGameScreen({ navigation, route }: Props) {
  const { gameType, consonant } = route.params;

  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {gameType === 'sequence' && '🔢 Sequence Game'}
          {gameType === 'missing' && '❓ Missing Letters'}
          {gameType === 'match' && '🎯 Match the Pair'}
        </Text>
        <Text style={styles.consonant}>{consonant}</Text>
        <Text style={styles.description}>
          This game mode is coming soon! The full implementation will include interactive gameplay
          for learning Telugu Gunintaalu.
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert('Coming Soon', 'This game mode will be available in the next update!');
          }}
        >
          <Text style={styles.buttonText}>Play Game</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  consonant: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
});

