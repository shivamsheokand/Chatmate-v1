import { StyleSheet, Text, View,ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../componets/UserChat';

const ChatScreen = () => {
    const [acceptedFriends,setAcceptedFriends]=useState([]);
    const { userid } = useContext(UserType);
    const navigation=useNavigation();
    useEffect(()=>{
        const acceptedFriendsList = async()=>{
            try{
                const response=await fetch(`http://192.168.1.6:8000/accepted-friends/${userid}`)
                const data=await response.json();
                if(response.ok){
                    setAcceptedFriends(data);
                }
            }catch(err){
                console.log("Error Showing The accpted Friends List",err);
            }
        }
        acceptedFriendsList();
    },[]);
    // console.log("Friends",acceptedFriends);
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item,index)=>(
                    <UserChat key={index} item={item}/>
                ))}
            </Pressable>
        </ScrollView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})