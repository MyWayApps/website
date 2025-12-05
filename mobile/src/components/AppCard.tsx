import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Application } from '../types';
import { getColorFromScheme } from '../utils/colors';

interface AppCardProps {
  app: Application;
  userProgress?: {
    best_score: number;
    total_attempts: number;
    last_played_at: string;
  };
  onPlay: (app: Application) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, userProgress, onPlay }) => {
  const colors = getColorFromScheme(app.color_scheme);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPlay(app)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>{app.icon_emoji}</Text>
          <Text style={styles.name}>{app.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {app.description}
          </Text>
          
          {userProgress && (
            <View style={styles.progress}>
              <Text style={styles.progressText}>
                ⭐ {userProgress.best_score} | 🎮 {userProgress.total_attempts}
              </Text>
            </View>
          )}
          
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{app.category}</Text>
            </View>
            {app.subcategory && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{app.subcategory}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  progress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: '600',
  },
});

