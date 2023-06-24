import React from "react"
import { useState } from "react"
import { UserContext } from "../contexts/UserContext"

export const UserProvider = ({children}: any) => {

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
    return (
        <UserContext.Provider value={{userLoggedIn, setUserLoggedIn}}>
            {children}
        </UserContext.Provider>
    )
}