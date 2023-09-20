import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LockScreen from '../screens/LockScreen';
const Start = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate("LockScreen");
        }, 3000);

        return () => clearTimeout(timer); // Clear the timer if the component unmounts.
    }, [])
    const [loaded] = useFonts({
        Pattaya: require('../assets/fonts/Pattaya/Pattaya-Regular.ttf'),
        Kalam:require('../assets/fonts/Kalam/Kalam/Kalam-Bold.ttf')
    })
    if (!loaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/start1.png')}
                style={{ height: 350, width: 350, resizeMode: 'contain', marginBottom: 50, marginTop: 70 }}
            />
            <Text style={styles.heading}>It's easy talking to your friends with{'\n'}<Text style={styles.title}>ChatMate</Text> </Text>
            <TouchableOpacity style={styles.Button} onPress={()=>navigation.navigate("LockScreen")}>
                <Text style={{color:'#000',fontFamily:'Pattaya',fontSize:15}}>Start</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Start;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0703',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    heading: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'Kalam'
    },
    title:{
        color: 'orange',
        fontSize: 28,
        fontFamily: 'Kalam'
    },
    Button:{
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        width:300,
        padding:15,
        borderRadius:25
    }
});