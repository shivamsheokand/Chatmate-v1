import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StactNavi from './Navigation/StackNavigation'
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
    <UserContext>
    <StactNavi />
    </UserContext>
    </>
  );
}

const styles = StyleSheet.create({});
