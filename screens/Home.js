import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import User from '../componets/User';

const Home = () => {
    const navigation = useNavigation();
    const { setUserid } = useContext(UserType);
    const [users, setUsers] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <Text style={{ fontSize: 20, color: 'orange', fontFamily: 'Kalam' }}>ChatMate</Text>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons onPress={()=>navigation.navigate("Chats")} name="ios-chatbubbles-outline" size={24} color="black" />
                    <Octicons onPress={()=> navigation.navigate("Friends")} name="people" size={24} color="black" />
                </View>
            )
        });
    }, [navigation]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const decodedToken = jwt_decode(token);
                const userid = decodedToken.userid;
                setUserid(userid);

                const response = await axios.get(`http://192.168.1.6:8000/users/${userid}`);
                setUsers(response.data);
            } catch (error) {
                console.log('Error retrieving users', error);
            }
        };

        fetchUsers();
    }, []);

    console.log('Users', users);

    // Font Family
    const [loaded] = useFonts({
        Pattaya: require('../assets/fonts/Pattaya/Pattaya-Regular.ttf'),
        Kalam: require('../assets/fonts/Kalam/Kalam/Kalam-Bold.ttf'),
    })
    if (!loaded) {
        return null;
    }

    return (
        <View>
            <View style={{padding:10}}>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </View>
        </View>
    );
};

export default Home;
