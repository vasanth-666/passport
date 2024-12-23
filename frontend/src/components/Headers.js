import React, { useEffect, useState } from 'react'
import "./header.css"
import { NavLink } from "react-router-dom"
import axios from "axios"

const Headers = () => {
    const [userdata, setUserdata] = useState({});
    const [isImage, setIsImage] = useState(false);
    console.log("response", userdata)

    const getUser = async () => {
        try {
            const response = await axios.get(`${process.env.backendurl}/login/sucess`, { withCredentials: true });

            setUserdata(response.data.user)
            if(userdata?.image) setIsImage(true)
        } catch (error) {
            console.log("error", error)
        }
    }

    const logout = ()=>{
        window.open(`${process.env.backendurl}/logout`,"_self")
    }

    useEffect(() => {
        getUser()
    })


    return (
        <>
            <header>
                <nav>
                    <div className="left">
                        <h1>Vasanthakumar S</h1>
                    </div>
                    <div className="right">
                        <ul>
                            <li>
                                <NavLink to="/">
                                    Home
                                </NavLink>
                            </li>
                            {
                               userdata && Object?.keys(userdata)?.length > 0 ? (
                                    <>
                                    
                                        <li>
                                            <NavLink to="/dashboard">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li onClick={logout}>Logout</li>
                                        <li>
                                            {isImage ? (
                                            <img src={userdata?.image} style={{ width: "50px", borderRadius: "50%" }} alt="" />
                                            ): (
                                                <div style={{display:"flex", justifyContent: "center", alignItems:"center", width: "50px", height:"50px", borderRadius: "50%", backgroundColor:"#8A817C", border:"2px solid #ffffff"}}>
                                                    <h1>{userdata?.email.charAt(0)}</h1>
                                                </div>
                                            )}
                                        </li>
                                    </>
                                ) : <li>
                                    <NavLink to="/login">
                                        Login
                                    </NavLink>
                                </li>
                            }



                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Headers;
