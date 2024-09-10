import React, { useEffect, useState } from "react";
import axios  from "axios";
import { cssTransition, toast } from "react-toastify";



const UserRequestForm = ({phoneNumber = ""}) => {
    var initialUserRequestForm = {
        name:'',
        phoneNumber:phoneNumber,
        noOfDays:'50',
        nameErr:'init',
        phoneNumberErr:phoneNumber?'':'init',
        noOfDaysErr:''
    }

    var [form,setForm] = useState(initialUserRequestForm);
    var [checkForm,setCheckForm] = useState(false);
    var [canBeSubmitted,setCanBeSubmitted] = useState(false);


    function validate()
    {
      if (form.nameErr=="" && form.phoneNumberErr=="" && form.noOfDaysErr=="")
      {
          console.log("can be submitted");
          setCanBeSubmitted(true);
      }
      else
      {
          setCanBeSubmitted(false);
      }
    }


    if(checkForm)
    {
        validate()
        setCheckForm(false)
    }

    function handleChangeForm(event)
    {
        console.log(form);
        if(event.target.id=="phoneNumber" || event.target.id=="noOfDays")
        {
            var l = event.target.value.length
            var lc = event.target.value.charAt(l-1)
            if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
            {
                if(l<=10)
                {
                    setForm({...form,[event.target.id]:event.target.value});
                    validateForm(event.target.id,event.target.value)
                }
            }
            else
            {
                setForm({...form,[event.target.id]:event.target.value.slice(0,l-1)})
                validateForm(event.target.id,event.target.value.slice(0,l-1))
            }
        }
        else
        {
            setForm({...form,[event.target.id]:event.target.value});
            validateForm(event.target.id,event.target.value)
            console.log(form);
        }
        setCheckForm(true)
    }

    function validateForm(field,value)
    {
        switch(field)
        {
        case 'name':
            if(value.length<3)
            setForm({...form,nameErr:"Name should contain atleast 3 characters",name:value})
            else if (!value.match(/^[a-zA-Z. ]{3,}$/gm))
            {
            setForm({...form,nameErr:"Name should only contain characters",name:value})
            //console.log("Iam here",form)
            }
            else
            setForm({...form,nameErr:"",name:value})
            break
        case 'phoneNumber':
            if (value.length == 0)
                setForm({...form,phoneNumberErr:"Enter Phone Number",phoneNumber:value})
            else if(value.length != 10)
                setForm({...form,phoneNumberErr:"Phone Number should contain exactly 10 digits",phoneNumber:value})
            else
                setForm({...form,phoneNumber:value,phoneNumberErr:""})
            break
        case "noOfDays":
            if(value.length==0)
            setForm({...form,noOfDaysErr:"Enter Number Of Days",noOfDays:value})
            else if(value<30)
            setForm({...form,noOfDaysErr:"Minimum Number of Days is 30",noOfDays:value})
            else
            setForm({...form,noOfDaysErr:"",noOfDays:value})
            break
        default:
        }
    }

    function sendRequest(){
        console.log("sending request..");
        axios.post("/userRequests/add",form)
        .then((res) =>{
            if(res.data.status)
            {
                toast.success("Request sent successfully",{position:toast.POSITION.BOTTOM_CENTER});
                setForm({...initialUserRequestForm, phoneNumber: ""})
                console.log("added successfully");
            }
            else
            {
                toast.warning("Phone Number Already Exists",{position:toast.POSITION.BOTTOM_CENTER});
                console.log("phone Number already exists");
            }
        })
        .catch((err) =>{
            toast.error("Something went wrong, Please try again",{position:toast.POSITION.BOTTOM_CENTER});
            console.log("Error occured while adding user Request..",err);
        })
    }



    return <div className="offer-user-request-form">
    <form className="admin-form offer-user-request-form" onSubmit={(e) =>{e.preventDefault();}}>
        <p className="offerUserRequestForm-title">Send Request</p>
        <p className="offerUserRequest-description">Send us a request to be a part of this offer</p>
        <div className="form-group">
            <label for="name">Name</label>
            <input type="text" className="form-control name" id="name" onChange={handleChangeForm} value={form.name} placeholder=""/>
            { form.nameErr.length>0 && form.nameErr!=="init" && <p className="adminErr err">{form.nameErr}</p>}
        </div>
        <div className="form-group" >
            <label for="phoneNumber">Phone Number</label>
            <input type="text" className="form-control phoneNumber"  onChange={handleChangeForm} id="phoneNumber" value={form.phoneNumber}/>
            { form.phoneNumberErr.length>0 && form.phoneNumberErr!="init" && <p className="adminErr err">{form.phoneNumberErr}</p>}
        </div>
        <div className="form-group" >
            <label for="productDiscount">Number of Days</label>
            <input type="text" className="form-control productDiscount"  onChange={handleChangeForm} id="noOfDays" value={form.noOfDays}/>
            { form.noOfDaysErr.length>0 && form.noOfDaysErr!="init" &&  <p className="adminErr err">{form.noOfDaysErr}</p>}
        </div>
        { canBeSubmitted?<button type="button" className="btn btn-primary"  onClick={sendRequest}>Send Request</button>:<button type="button" className="btn btn-primary" disabled>Send Request</button>}
    </form>
</div>
}

export default UserRequestForm