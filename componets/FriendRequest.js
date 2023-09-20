import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { UserType } from "../UserContext";
import { useNavigation } from '@react-navigation/native';
const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userid } = useContext(UserType);
    const navigation = useNavigation();
    const accptRequest = async (friendRequestid) => {
        try {
            const response = await fetch('http://192.168.1.6:8000/friend-request/accept',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: friendRequestid,
                        recepientId: userid,
                    }),
                }
            )
            if (response.ok) {
                setFriendRequests(
                    friendRequests.filter((request) => request._id !== friendRequestid)
                );
                navigation.navigate("Chats");
            }
        } catch (err) {
            console.log("error acceptin the friend request", err);
        }
    }

    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
            <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={{ uri: item.image }}
            />
            <Text style={{ flex: 1, fontSize: 18, fontWeight: "bold" }}>{item?.name} : <Text style={{ fontSize: 17, fontWeight: '800' }}>Send you a friend request.. </Text></Text>
            <TouchableOpacity onPress={() => accptRequest(item._id)}>
                <MaterialIcons name="add-task" size={30} color="purple" />
            </TouchableOpacity>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({})