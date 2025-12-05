import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

export default function GameScreen({ navigation, route }: Props) {
  const { appName, route: appRoute } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading {appName}...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{appName}</Text>
        <Text style={styles.description}>
          This game is coming soon! The full implementation will be available in the next update.
        </Text>
        <Text style={styles.routeText}>Route: {appRoute}</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert('Coming Soon', 'This game will be available soon!');
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  routeText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 32,
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
    color: '#4F46E5',
  },
});

