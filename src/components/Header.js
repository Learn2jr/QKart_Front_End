import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
    const history = useHistory(); 
    const [log, setLog] = useState(children); 
    console.log(log);
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {hasHiddenAuthButtons ? (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={(e) => {
              history.push("/");
            }}
          >
            Back to explore
          </Button>
        ) : (
      <Box>
      {log ? ( 
        <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt={localStorage.getItem("username")} src="avatar.png" /> 
        <p className="title">{localStorage.getItem("username")}</p>
        <Button 
        className="explore-button" 
        variant="text" 
        onClick={(e) => {
          localStorage.removeItem("username"); 
          localStorage.removeItem("token"); 
          localStorage.removeItem("balance"); 
          setLog(false); 
          history.push("/");
        }}
        >
          LOGOUT
        </Button>
        </Stack>
      ):(
        <Stack direction="row" spacing={2} alignItems="center">
        <Button 
        className="explore-button" 
        variant="text" 
        onClick={(e) => {
           history.push("/login"); 
           }} 
        >
          LOGIN
          </Button>
          <Button
            className="button" 
            variant="contained"
            onClick={(e) => {
              history.push("/register");
            }}
            >
              REGISTER
            </Button>
          </Stack>
      )}
    </Box>
        )}
    </Box>
    );
};

export default Header;
