import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LockScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    navigation.replace("Home");
                } else {
                    // Token not found; show the login screen itself
                }
            } catch (err) {
                console.log("Error", err);
            }
        };
        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        };
        axios.post('http://192.168.1.6:8000/login', user)
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem("authToken", token);
                navigation.replace("Home");
            })
            .catch((error) => {
                Alert.alert("Login Error", "Invalid Email or Password");
                console.log("Login Error", error);
            });
    };

    return (
        <View style={styles.maincontainer}>
            <View style={styles.image}>
                <Image
                    source={require('../assets/images/login1.png')}
                    style={{ height: 250, width: 250, resizeMode: 'contain', marginBottom: 20, marginTop: 30 }}
                />
            </View>
            <View style={styles.loginBox}>
                <View style={styles.loginView}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Email</Text>
                    <TextInput
                        placeholder='Enter Your Email'
                        style={styles.textinput}
                        value={email}
                        onChangeText={txt => setEmail(txt)}
                    />
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Password</Text>
                    <TextInput
                        placeholder='Enter Your Password'
                        style={styles.textinput}
                        value={password}
                        onChangeText={txt => setPassword(txt)}
                        secureTextEntry={true} // This will hide the password
                    />
                    <TouchableOpacity onPress={handleLogin}>
                        <View style={styles.submitButton}>
                            <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Singup")}>
                        <Text style={{ marginTop: 20, textAlign: 'center' }}>Don't have an account? Sign Up</Text>
                    </TouchableOpacity>
                    <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 17 }}>Designed By : <Text style={{ color: 'orange', textDecorationLine: 'underline', fontWeight: 'bold' }}>Sam</Text></Text>
                </View>
            </View>
        </View>
    );
};

export default LockScreen;

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: "#181818",
    },
    image: {
        backgroundColor: "#181818",
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginView: {
        padding: 40,
        minHeight: 700,
        minWidth: 400,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 95,
    },
    textinput: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        minWidth: 200,
        marginVertical: 8,
    },
    submitButton: {
        backgroundColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
});
