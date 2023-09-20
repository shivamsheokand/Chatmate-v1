import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../componets/FriendRequest";

const FriendsScreen = () => {
    const { userid } = useContext(UserType);
    const [friendRequest, setFriendRequest] = useState([]);
    useEffect(() => {
        fetchFriendRequest();
    }, []);

    const fetchFriendRequest = async () => {
        try {
            const response = await axios.get(
                `http://192.168.1.6:8000/friend-request/${userid}`
            );
            if (response.status === 200) {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                }));

                setFriendRequest(friendRequestsData);
            }
        } catch (err) {
            console.log("error message", err);
        }
    };

    // console.log(friendRequest);
    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequest.length > 0 && <Text style={{ fontSize: 20, color: '#070a14', padding: 3, fontWeight: "700" }}>Your Friend Requests!</Text>}
            {
                friendRequest.map((item, index) => (
                    <FriendRequest
                        key={index}
                        item={item}
                        friendRequests={friendRequest}
                        setFriendRequests={setFriendRequest}
                    />
                ))
            }
        </View>
    );
};

export default FriendsScreen;

const styles = StyleSheet.create({});