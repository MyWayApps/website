import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { label: 'Math', icon: '🔢', href: '#math', color: '#3B82F6' },
  { label: 'Telugu', icon: 'అ', href: '#telugu', color: '#10B981' },
  { label: 'English', icon: '🔤', href: '#english', color: '#8B5CF6' },
  { label: 'Life Skills', icon: '🌟', href: '#life-skills', color: '#F59E0B' },
  { label: 'Games', icon: '🎮', href: '#games', color: '#EC4899' },
  { label: 'Puzzles', icon: '🧩', href: '#puzzles', color: '#14B8A6' },
];

interface NavigationMenuProps {
  onCategoryPress: (href: string) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ onCategoryPress }) => {
  return (
    <LinearGradient
      colors={['#BFDBFE', '#93C5FD', '#BFDBFE']}
      style={styles.container}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.href}
            onPress={() => onCategoryPress(item.href)}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#60A5FA',
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  menuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

