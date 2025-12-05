import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { Application, UserProgress } from '../types';

interface CategorySectionProps {
  category: string;
  apps: Application[];
  userProgress: UserProgress;
  onPlayApp: (app: Application) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  apps,
  userProgress,
  onPlayApp,
}) => {
  const categoryApps = apps.filter((app) => app.category === category);

  if (categoryApps.length === 0) return null;

  const subcategories = categoryApps.reduce(
    (acc, app) => {
      const sub = app.subcategory || 'General';
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(app);
      return acc;
    },
    {} as Record<string, Application[]>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category}</Text>
      {Object.entries(subcategories).map(([subcategory, subApps]) => (
        <View key={subcategory} style={styles.subcategory}>
          {Object.keys(subcategories).length > 1 && (
            <Text style={styles.subcategoryTitle}>{subcategory}</Text>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {subApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                userProgress={userProgress[app.id]}
                onPlay={onPlayApp}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subcategory: {
    marginBottom: 16,
  },
  subcategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
});

