import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext,useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext';

const UserChat = ({ item }) => {
    const navigation = useNavigation();
    const[messages,setMessages]=useState([]);
    const { userid } = useContext(UserType);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://192.168.1.6:8000/messages/${userid}/${item._id}`);

            const data = await response.json();

            if (response.ok) {
                setMessages(data);
            } else {
                console.log("error Showing message", response.status.message);
            }

        } catch (err) {
            console.log("error fetching messages", err);
        }
    }
    useEffect(() => {
        fetchMessages()
    }, [])
    // console.log(messages);
    const getlastMessages = ()=>{
        const userMessages =messages.filter((message) =>message.messageType ==="text");
        const n = userMessages.length;
        return userMessages[n-1];
    }
    const lastMessages = getlastMessages();
    // console.log(lastMessages);
    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' }
        return new Date(time).toLocaleString('en-US', options);
    }
    return (
        <Pressable onPress={() => navigation.navigate('Messages', {
            recepientId: item._id
        })} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.7, borderColor: "D0D0D0", borderTopWidth: 0, borderWidth: 0, borderLeftWidth: 0, padding: 10 }}>
            <Image
                style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
                source={{ uri: item?.image }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500' }}>{item.name}</Text>
                {
                    lastMessages && (

                <Text style={{ marginTop: 3, color: 'gray', fontWeight: '500' }}>{
                    lastMessages?.message
                }</Text>
                    )
                }
            </View>
            <View>
                <Text style={{ fontWeight: '400', fontSize: 11, color: '#585858' }}>{lastMessages&&formatTime(lastMessages?.timeStamp)}</Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})