import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserProgress } from '../types';

const STORAGE_KEYS = {
  USER: 'mywayapps_current_user',
  PROGRESS: 'mywayapps_user_progress',
};

export const storage = {
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async saveProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  async getProgress(): Promise<UserProgress> {
    try {
      const progressJson = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      return progressJson ? JSON.parse(progressJson) : {};
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.PROGRESS]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

