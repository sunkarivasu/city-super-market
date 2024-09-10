import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function AdminShowAllOffers(props)
{
    var [offers,setOffers] = useState(null);
    var [filteredOffers,setFilteredOffers] = useState(null);
    var [phoneNumberFilter,setPhoneNumberFilter] = useState();
    var [winnerGenerated,setWinnerGenerated] = useState(false);
    // var [productDeleted,setProductDeleted] = useState(false);

    var today = new Date()
    var presentDate = new Date(today.getTime() - (today.getTime()%(1000 * 60 * 60 *24)))
    console.log({presentDate});
    useEffect(() => {
        fetchOffers();
        return () => {}
    },[winnerGenerated]);

    const fetchOffers = () => {
        axios.get("/offers/")
        .then((res) => {
            console.log(res.data);
            setOffers(res.data.reverse())
            setFilteredOffers(res.data.reverse())
        })
        .catch((err) => console.log("Error Occured while fetching products"))
    }

    // function handleGenerateWinner(){
    //     console.log("generating winner...");
    //     axios.get("/offers/generateTodaysWinner")
    //     .then((res) =>{
    //         console.log(res.data);
    //         console.log("winner generated..");
    //         toast.success("winner generated successfully",{position:toast.POSITION.BOTTOM_CENTER});
    //         setWinnerGenerated(true);
    //     })
    //     .catch((err) =>{
    //         console.log("Error occured While generating winnner",err);
    //         toast.error("winner generation failed",{position:toast.POSITION.BOTTOM_CENTER});
    //     })
    // }

    function handleChangePhoneNumber(event)
    {
        var l = event.target.value.length
        var lc = event.target.value.charAt(l-1)
        if(l==0)
        {
            setFilteredOffers(offers)
        }
        if(lc=='0' || lc=='1' || lc=='2' || lc=='3' || lc=='4' || lc=='5' || lc=='6' || lc=='7' || lc=='8' ||lc=='9')
        {
            if(l<=10)
            {
                var newFilteredResults = offers.filter((offer) => offer.winnerPhoneNumber.toString().startsWith(event.target.value))
                setFilteredOffers(newFilteredResults)
                console.log({newFilteredResults});
                setPhoneNumberFilter(event.target.value);
            }
            else
                setPhoneNumberFilter(event.target.value.slice(0,l-1))
        }
        else
        {
            setPhoneNumberFilter(event.target.value.slice(0,l-1))
        }
    }

    function handleEditOffer(event)
    {
        console.log(event.target.id);
        props.handleEditOffer(event.target.id);
    }

    function handleActiveOffer(event){
        console.log("activating offer", event.target.id);
        console.log("token", localStorage.getItem('token'))
        const token = localStorage.getItem('token')
        axios.put("/offers/activate-offer",
            {
                offerId: event.target.id
            },
            {
                headers: {
                    'Authorization': token
                }
            }
        )
        .then((res) => {
            toast.success(res.data.message);
            fetchOffers();
        })
        .catch((err) => {
            console.error(err);
            toast.error(err.response.data.message);
        })
    }

    return <div className="adminShowAllOffers">
        <div className="adminShowAllProducts-navbar">
            <div className="navbar-category">
                <label style={{fontWeight:"500",fontSize:"1.1rem"}}>Phone Number</label>
                <input type="text" className="subCategory-select phoneNumber-filter-input" value={phoneNumberFilter} onChange={handleChangePhoneNumber}></input>
            </div>
            {/* <div className="navbar-category">
                <button className="btn btn-secondary productList-item-delete-btn" onClick={handleGenerateWinner}>Generate Winnner</button>
            </div> */}

        </div>
        <div style={{display:"block"}}>
                <button className="btn btn-secondary admin-add-product-home-btn" onClick={props.handleAddOffer}>Add Offer</button>
                <button className="btn btn-secondary admin-add-product-home-btn" onClick={props.handleAddOfferUser}>Add OfferUser</button>
            </div>
        <div className="productList-titles row">
            <div className="col-1" style={{fontWeight:"600"}}>Date</div>
            <div className="col-1" style={{fontWeight:"600"}}>Image</div>
            <div className="col-1" style={{fontWeight:"600"}}>Product Name</div>
            <div className="col-2" style={{fontWeight:"600"}}>Description</div>
            <div className="col-1" style={{fontWeight:"600"}}>Worth</div>
            <div className="col-2" style={{fontWeight:"600"}}>Winner Name</div>
            <div className="col-1" style={{fontWeight:"600"}}>Winner Phone Number</div>
            <div className="col-1" style={{fontWeight:"600"}}>Winner Image</div>
            <div className="col-2" style={{fontWeight:"600"}}></div>
        </div>
        <div className="subCategory-container">
            {filteredOffers?<div>
                {filteredOffers.length>0?filteredOffers.slice(0).reverse().map((offer) => {return <div className="productList-item row" id={offer._id}>
                <div className="offerList-item-date col-1">
                        <p style={{margin:"25px 0px"}}>{offer.date.slice(0,10)}</p>
                    </div>
                    <div className="offerList-item-img col-1">
                        <img src={offer.image} style={{width:"80px",height:"80px"}}/>
                    </div>
                    <div className="offerList-item-brand col-1" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{offer.productName}</p>
                    </div>
                    <div className="offerList-item-description col-2" style={{textAlign:"left"}}>
                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{offer.description}</p>
                    </div>
                    <div className="offerList-item-price col-1">
                        <p style={{margin:"25px 0px"}}>Rs {offer.worth}</p>
                    </div>
                    <div className="offerList-item-winnerName col-2">
                        <p style={{margin:"25px 0px"}}>{offer.winnerName?offer.winnerName:"Yet to be decided"}</p>
                    </div>
                    <div className="offerList-item-winnerPhoneNumber col-1">
                        <p style={{margin:"25px 0px"}}>{offer.winnerPhoneNumber?offer.winnerPhoneNumber:"Yet to be decided"}</p>
                    </div>
                    <div className="offerList-item-winnerPhoneNumber col-1">
                        {offer.winnerImage?<img src={offer.winnerImage} style={{width:"80px",height:"80px"}}/>:<p style={{margin:"25px 0px"}}>N.A.</p>}
                    </div>
                    <div className="offerList-item-edit col-1">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={offer._id} onClick={handleEditOffer}>Edit</button>
                    </div>
                    <div className="offerList-item-activate col-1">
                        <button className="btn btn-secondary productList-item-edit-btn" style={{margin:"25px 10px 25px 0px"}} id={offer._id} onClick={handleActiveOffer} disabled={offer.isActive === true}>Activate</button>
                    </div>
                </div>}):<div className="no-users-found-msg">No Offers found</div>}
            </div>:<div>Loading...</div>}
        </div>
    </div>
}

export default AdminShowAllOffers;