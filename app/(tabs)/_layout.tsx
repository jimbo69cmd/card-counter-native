// app/(tabs)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import React from 'react';

/**
 * Drawer layout
 *
 * • We explicitly declare the “index” route so we can set its title to “Home”.
 * • All other screens in this folder (faq.tsx, about.tsx, tos.tsx, …)
 *   are still auto‑added by Expo Router—no need to list them here.
 */
export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
      }}
    >
      {/* Home (was “index”) */}
      <Drawer.Screen
        name="index"          // ➜ app/(tabs)/index.tsx
        options={{ title: 'Home' }}
      />
      {/* Leave the rest to auto‑registration */}
    </Drawer>
  );
}