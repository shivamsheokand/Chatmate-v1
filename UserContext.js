import { createContext,useState } from "react";

const UserType = createContext();

const UserContext = ({children})=>{
    const[userid,setUserid]=useState('');
    return(
        <UserType.Provider value={{userid,setUserid}}>
            {children}
        </UserType.Provider>
    )
}

export {UserType,UserContext}