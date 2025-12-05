import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { CategorySection } from '../components/CategorySection';
import { NavigationMenu } from '../components/NavigationMenu';
import { Application, User, UserProgress } from '../types';
import { fallbackApplications, categories } from '../data/applications';
import { storage } from '../utils/storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setApplications(fallbackApplications);
      const savedUser = await storage.getUser();
      const savedProgress = await storage.getProgress();
      
      if (savedUser) {
        setUser(savedUser);
      }
      if (savedProgress) {
        setUserProgress(savedProgress);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayApp = (app: Application) => {
    if (app.route === '/telugu-gunintaalu') {
      navigation.navigate('TeluguGunintaalu');
    } else {
      navigation.navigate('Game', {
        appId: app.id,
        appName: app.name,
        route: app.route,
      });
    }
  };

  const handleCategoryPress = (href: string) => {
    // Scroll to category section
    // In a real implementation, you might use refs to scroll
    console.log('Navigate to:', href);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading MyWayApps...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED', '#EC4899']}
      style={styles.container}
    >
      <NavigationMenu onCategoryPress={handleCategoryPress} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to MyWayApps! 🌈</Text>
          <Text style={styles.subtitle}>A Colorful World of Learning!</Text>
        </View>

        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            apps={applications}
            userProgress={userProgress}
            onPlayApp={handlePlayApp}
          />
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});

