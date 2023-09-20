import { Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Octicons } from '@expo/vector-icons';
import { UserType } from '../UserContext';


const User = ({ item }) => {
    const { userid, setUserid } = useContext(UserType);
    const [requstsend, setRequstsend] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch(
                    `http://192.168.1.6:8000/friend-request/sent/${userid}`
                );

                const data = await response.json();
                if (response.ok) {
                    setFriendRequests(data);
                } else {
                    console.log("error", response.status);
                }
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchFriendRequests();
    }, []);

    useEffect(() => {
        const fetchUserFriends = async () => {
            try {
                const response = await fetch(`http://192.168.1.6:8000/friends/${userid}`);

                const data = await response.json();

                if (response.ok) {
                    setUserFriends(data);
                } else {
                    console.log("error retrieving user friends", response.status);
                }
            } catch (error) {
                console.log("Error message", error);
            }
        };

        fetchUserFriends();
    }, []);
    // console.warn('req',friendRequests);
    // console.warn("urer friend",userFriends);
    const sendfrendrequst = async (currentUserid, selectedUserid) => {
        try {
            const response = await fetch('http://192.168.1.6:8000/friend-request',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ currentUserid, selectedUserid }),
                })
            if (response.ok) {
                setRequstsend(true)
            }
        } catch (err) {
            console.log('error sending', err);
        }

    }
    return (
        <Pressable
            style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
        >
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        resizeMode: "cover",
                    }}
                    source={{ uri: item.image }}
                />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
                <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
            </View>
            {userFriends.includes(item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: "#82CD47",
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
                </Pressable>
            ) : requstsend || friendRequests.some((friend) => friend._id === item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: "gray",
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                        Request Sent
                    </Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => sendfrendrequst(userid, item._id)}
                    style={{
                        backgroundColor: "#567189",
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                        Add Friend
                    </Text>
                </Pressable>
            )}
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})