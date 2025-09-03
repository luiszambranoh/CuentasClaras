import { Link, Tabs } from 'expo-router';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index'
        }}
      />
      <Tabs.Screen
        name="one"
        options={{
          title: 'one'
        }}
      />
    </Tabs>
  );
}
