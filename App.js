import React from 'react';
import { View } from 'react-native';
import ChatScreen from './app/screens/ChatScreen/ChatScreen';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ChatScreen />
    </View>
  );
}
