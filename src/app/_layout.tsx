
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import './global.css'


export default function RootLayoutNav() {

  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
  );
}