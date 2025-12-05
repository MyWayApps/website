import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import TeluguGunintaaluScreen from './src/screens/TeluguGunintaaluScreen';
import TeluguLearnScreen from './src/screens/TeluguLearnScreen';
import TeluguGameScreen from './src/screens/TeluguGameScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: { appId: string; appName: string; route: string };
  TeluguGunintaalu: undefined;
  TeluguLearn: { consonant: string };
  TeluguGame: { gameType: 'sequence' | 'missing' | 'match'; consonant: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4F46E5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'MyWayApps' }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={({ route }) => ({ title: route.params.appName })}
          />
          <Stack.Screen 
            name="TeluguGunintaalu" 
            component={TeluguGunintaaluScreen}
            options={{ title: 'Telugu Gunintaalu' }}
          />
          <Stack.Screen 
            name="TeluguLearn" 
            component={TeluguLearnScreen}
            options={({ route }) => ({ title: `${route.params.consonant} Gunintaalu` })}
          />
          <Stack.Screen 
            name="TeluguGame" 
            component={TeluguGameScreen}
            options={({ route }) => ({ 
              title: `${route.params.consonant} - ${route.params.gameType}` 
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

