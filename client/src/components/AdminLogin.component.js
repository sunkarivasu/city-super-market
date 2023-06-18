import axios from "axios";
import React,{useEffect, useState} from "react";
import "../css/AdminLoginStylesheet.css";
import {useNavigate} from "react-router-dom";
import {isEmpty} from '../utils/validation';

var Buffer = require('buffer/').Buffer


function AdminLogin()
{
    var navigate = useNavigate();
    var [adminId,setAdminId] = useState();
    var [adminIdErr,setAdminIdErr] = useState("init");
    var [adminPassword,setAdminPassword] = useState();
    var [adminPasswordErr,setAdminPasswordErr] = useState("init")
    var [checkForm,setCheckForm] = useState(true);
    var [disableLoginButton,setDisableLoginButton] = useState(true);

    const toc=localStorage.getItem("token");
     useEffect(()=>{
      var base64Payload = toc.split('.')[1];
      var payload = Buffer.from(base64Payload, 'base64');
      if( payload.exp>Math.floor(Date.now()/1000))
      {
        navigate("../adminHome");
      }
     },[navigate, toc])

    function handleAdminIdChange(event)
    {
      setAdminId(event.target.value);

      if(event.target.value.length==0)
        setAdminIdErr("Enter EmailId")
      else if(!event.target.value.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/))
        setAdminIdErr("Invalid EmailId")
      else
        setAdminIdErr("")
      setCheckForm(true)

      if(adminIdErr=="" && adminPasswordErr=="")
        setDisableLoginButton(false)
      else
        setDisableLoginButton(true)

    }

    function handleChangePassword(event)
    {
      setAdminPassword(event.target.value);
      if(event.target.value.length==0)
        setAdminPasswordErr("Enter Password")
      else
        setAdminPasswordErr("");
      setCheckForm(true);

      if(adminIdErr=="" && adminPasswordErr=="")
        setDisableLoginButton(false)
      else
        setDisableLoginButton(true)
    }

    
    function handleOnSubmit(event)
    {
      event.preventDefault();
      var admin = 
      {
        email:adminId,
        password:adminPassword
      }
      axios.post("/api/admin/login",admin)
      .then((res)=>
      {
        if(!isEmpty(res.data.data.token))
        {
          console.log("login success");
          localStorage.setItem("token",res.data.data.token);
          axios.defaults.headers.common["Authorization"] =res.data.data.token;
          navigate("../adminHome");
        }
        else
        {
          console.log("invalid credentials");
          setAdminPasswordErr(res.data.msg);
        }
          
      })
      .catch((err)=>
      {
        console.log("Error occured while logging in the admin:"+err);
      })
    }

    return (
      <div className="admin-panel">
        {/* <Header/> */}
        <div className="admin">
          <form className="admin-form admin-login-form" onSubmit={handleOnSubmit}>
            <div class="form-group">
              {/* <label for="username">Admin Id</label> */}
              <input type="text" className="form-control" id="adminId" aria-describedby="emailHelp" placeholder="Email Id" onChange={handleAdminIdChange} value={adminId}/>
              {adminIdErr.length>0 && adminIdErr!="init" && <p className="err">{adminIdErr}</p>}
            </div>
            <div class="form-group">
              {/* <label for="exampleInputPassword1">Password</label> */}
            <input type="password" className="form-control" id="adminPassword" placeholder="Password" onChange={handleChangePassword} value={adminPassword}/>
            {adminPasswordErr.length>0 && adminPasswordErr!="init" && <p className="err">{adminPasswordErr}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={disableLoginButton}>Login</button>
          </form>
    
        </div>
        {/* <Footer/> */}
        
    
      </div>
      )
}

export default AdminLogin;
