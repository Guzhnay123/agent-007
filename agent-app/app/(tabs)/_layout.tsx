import { Link, Tabs, Stack } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Atom, AudioWaveform, Film } from '@tamagui/lucide-icons'

export default function TabLayout() {

  return (
    <Stack>
    <Stack.Screen name="Login" />
    <Stack.Screen name="Dashboard" options={{ title: 'FILMS - 007'} } />
    <Stack.Screen name="Scenes" />
    <Stack.Screen name="Characters" />
  </Stack>
  );
}

