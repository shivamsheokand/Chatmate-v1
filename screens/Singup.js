import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import axios from "axios";
import { useNavigation } from "@react-navigation/native";


const Signup = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [image, setImage] = useState("");
    const hendleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            confirmpassword: confirmpassword,
            image: image,
        }

        // send  a Post Request to the Backend API to register the user

        axios.post('http://192.168.1.6:8000/register', user).then((response) => {
            console.log(response);
            Alert.alert(
                "registered successfully",
                "Your account has been registered"
            );
            setName("");
            setEmail("");
            setPassword("");
            setConfirmpassword("");
            setImage("");
        }).catch((err) => {
            Alert.alert(
                "Registration Error",
                "An Error Ouccerred while Registring"
            )
            console.log("registrartion error", err);
        })
    }
    return (
        <View style={styles.maincontainer}>
            <View style={styles.image}>
                <Image
                    source={require('../assets/images/singup.png')}
                    style={{ height: 200, width: 200, resizeMode: 'contain', marginBottom: 20, marginTop: 40 }}
                />
            </View>
            <View style={styles.loginBox} >
                <View style={styles.loginView}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: 'orange', marginTop: 20 }}>Name</Text>
                    <TextInput placeholder='Enter Your Name' style={styles.inputtext} value={name} onChangeText={txt => setName(txt)} />
                    <Text style={{ fontSize: 12, fontWeight: '500', color: 'orange' }}>Email</Text>
                    <TextInput placeholder='Enter Your Email' style={styles.inputtext}
                        value={email} onChangeText={txt => setEmail(txt)} />
                    <Text style={{ fontSize: 12, fontWeight: '500', color: 'orange' }}>Password</Text>
                    <TextInput placeholder='Enter Your password' style={styles.inputtext} value={password} onChangeText={txt => setPassword(txt)} />
                    <Text style={{ fontSize: 12, fontWeight: '500', color: 'orange' }}>Confirm Password</Text>
                    <TextInput placeholder='Confirm Your password' style={styles.inputtext} value={confirmpassword} onChangeText={txt => setConfirmpassword(txt)} />
                    <Text style={{ fontSize: 12, fontWeight: '500', color: 'orange' }}>IMAGE</Text>
                    <TextInput placeholder='Enter Your Image Url' style={styles.inputtext} value={image} onChangeText={(text) => setImage(text)} />
                    <TouchableOpacity onPress={hendleRegister} >
                        <View style={styles.submitButton}>
                            <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Sing Up</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("LockScreen")}>
                        <Text style={{ marginTop: 25, textAlign: 'center' }}>Already have any account? Sing In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 17 }}>Designed By : <Text style={{ marginTop: 70, textAlign: 'center', color: 'orange', textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 17 }}>Sam</Text> </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Signup;

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: "#181818",
    },
    image: {
        // flex:1,
        backgroundColor: "#181818",
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBox: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginView: {
        // flex: 1,
        padding: 30,
        minHeight: 600,
        minWidth: 400,
        backgroundColor: '#FFFFFF',
        // borderRadius: 45,
        borderTopLeftRadius: 85
    },
    inputtext: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        minWidth: 200,
        margin: 2
    },
    submitButton: {
        backgroundColor: '#000',
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 18
    }
})


