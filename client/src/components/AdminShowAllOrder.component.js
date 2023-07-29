import react, { useEffect,useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { cssTransition, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {FaChevronUp,FaChevronDown} from "react-icons/fa";


const orders=[
        {
            orderId:"12345",
            date:'23-10-2004',
            name:'prathyuhsa',
            phoneNumber:'8374330346',    
            address:'narsipatnam',
            noOfItems:'4',
            amount:'50',
            status:'delivered',
            items:[
                {
                    image:'image',
                    name:'cocnut1',
                    description:'coconut water',
                    price:'40',
                    quantity:'500ml',
                    orderQuantity:'4',
                    totalPrice:'55'
                },
                {
                    image:'image',
                    name:'cocnut2',
                    description:'coconut water',
                    price:'40',
                    quantity:'500ml',
                    orderQuantity:'4',
                    totalPrice:'55'
                }
            ]
        },
        {
            orderId:"54321",
            date:'23-10-2014',
            name:'sindhusha',
            phoneNumber:'9247168292',    
            address:'vizag',
            noOfItems:'5',
            amount:'500',
            status:'recieved',
            items:[
                {
                    image:'image1',
                    name:'mango',
                    description:'mango',
                    price:'50',
                    quantity:'1/2kg',
                    orderQuantity:'4',
                    totalPrice:'55'
                },
                {
                    image:'image2',
                    name:'mango',
                    description:'mango',
                    price:'60',
                    quantity:'2kg',
                    orderQuantity:'5',
                    totalPrice:'555'
                }
            ]
        },
        {
            orderId:"12345",
            date:'23-10-2004',
            name:'prathyuhsa',
            phoneNumber:'8374330346',    
            address:'narsipatnam',
            noOfItems:'4',
            amount:'50',
            status:'delivered',
            items:[
                {
                    image:'image',
                    name:'cocnut1',
                    description:'coconut water',
                    price:'40',
                    quantity:'500ml',
                    orderQuantity:'4',
                    totalPrice:'55'
                },
                {
                    image:'image',
                    name:'cocnut2',
                    description:'coconut water',
                    price:'40',
                    quantity:'500ml',
                    orderQuantity:'4',
                    totalPrice:'55'
                }
            ]
        },
]


function AdminShowAllOrders(props)
{

    var [offers,setOffers] = useState(null);
    var [filteredOffers,setFilteredOffers] = useState(null);
    var [phoneNumberFilter,setPhoneNumberFilter] = useState();
    var [winnerGenerated,setWinnerGenerated] = useState(false);
    var [toggle,setToggle]=useState(-1);
    // var [productDeleted,setProductDeleted] = useState(false);

    console.log('toggle',toggle);

    var today = new Date()
    var presentDate = new Date(today.getTime() - (today.getTime()%(1000 * 60 * 60 *24)))
    console.log({presentDate});
    useEffect(() => {

        axios.get("/offers/")
            .then((res) => {
                console.log(res.data);
                setOffers(res.data.reverse())
                setFilteredOffers(res.data.reverse())
            })
            .catch((err) => console.log("Error Occured while fetching products"))    

        return () => {}
    },[winnerGenerated]);

    function handleGenerateWinner(){
        console.log("generating winner...");
        axios.get("/offers/generateTodaysWinner")
        .then((res) =>{
            console.log(res.data);
            console.log("winner generated..");
            toast.success("winner generated successfully",{position:toast.POSITION.BOTTOM_CENTER});
            setWinnerGenerated(true);
        })
        .catch((err) =>{
            console.log("Error occured While generating winnner",err);
            toast.error("winner generation failed",{position:toast.POSITION.BOTTOM_CENTER});
        })
    }

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

    return  (<div className="adminShowAllOffers">
                <div className="productList-titles row">
                    <div className="col-1" style={{fontWeight:"600"}}>OrderId</div>
                    <div className="col-2" style={{fontWeight:"600"}}>Date</div>
                    <div className="col-1" style={{fontWeight:"600"}}>Name</div>
                    <div className="col-2" style={{fontWeight:"600"}}>Phone Number</div>
                    <div className="col-2" style={{fontWeight:"600"}}>Address</div>
                    <div className="col-1" style={{fontWeight:"600"}}>Number of items</div>
                    <div className="col-1" style={{fontWeight:"600"}}>Amount</div>
                    <div className="col-1" style={{fontWeight:"600"}}>Status</div>
                    <div className="col-1" style={{fontWeight:"600"}}></div>
                </div>
                <div className="subCategory-container">
                    {  
                        orders.map((order,index)=>{
                        console.log('order',order);

                            return (
                            <>
                                <div className="row" id={'id'} style={{ padding:"5px",width:"100%","background-color": "white","height":" 100px","border-radius": "5px",margin:'0px','borderBottom': '1px solid black'}}>
                                    <div className="offerList-item-date col-1">
                                        <p style={{margin:"25px 0px"}}>{order?.orderId}</p>
                                    </div>
                                    <div className="offerList-item-img col-2">
                                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{order?.date}</p>
                                    </div>
                                    <div className="offerList-item-brand col-1" style={{textAlign:"left"}}>
                                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{order?.name}</p>
                                    </div>
                                    <div className="offerList-item-description col-2" style={{textAlign:"left"}}>
                                        <p style={{margin:"25px 0px",fontWeight:"500",textTransform:"capitalize"}}>{order?.phoneNumber}</p>
                                    </div>
                                    <div className="offerList-item-date col-2">
                                        <p style={{margin:"25px 0px"}}>{order?.address}</p>
                                    </div>
                                    <div className="offerList-item-winnerName col-1">
                                        <p style={{margin:"25px 0px"}}>{order?.noOfItems}</p>
                                    </div>
                                    <div className="offerList-item-winnerPhoneNumber col-1">
                                        <p style={{margin:"25px 0px"}}>{order?.amount}</p>
                                    </div>
                                    <div className="offerList-item-winnerPhoneNumber col-1">
                                        <p style={{margin:"25px 0px"}}>{order?.status}</p>
                                    </div>
                                    <div className="offerList-item-winnerPhoneNumber col-1" style={{margin:"25px 0px"}} onClick={
                                        ()=>{
                                            if(toggle===-1){
                                                setToggle(index)
                                            }
                                            else{
                                                setToggle(-1)
                                            }
                                            }}
                                        >  
                                        <i class="cil-chevron-top" >{toggle===index?<FaChevronUp/>:<FaChevronDown/>}</i>
                                    </div>
                                </div>
                                <div>
                                {toggle===index ? 
                                    <div style={{}}>
                                        <div style={{width:'100%',display:'flex','justify-content': 'space-between','flex-direction': 'row','background-color': 'lightblue','align-items':'center','padding-left':'25px','height':'30px',padding:'25px'}}>  
                                            <div style={{flex:1}}>image</div>
                                            <div style={{flex:1}}>name</div>
                                            <div style={{flex:1}}>description</div>
                                            <div style={{flex:1}}>price</div>
                                            <div style={{flex:1}}>quantity</div>
                                            <div style={{flex:1}}>orderQuantity</div>
                                            <div style={{flex:1}}>totalPrice</div>
                                        </div>
                                        {
                                            order?.items?.map((item,itemIndex)=>{
                                                return ( 
                                                <div style={{width:'100%',display:'flex','justify-content': 'space-between','flex-direction': 'row','background-color': 'aliceblue','align-items':'center','padding':'25px','height':'30px','borderBottom': '1px solid black'}}>
                                                    <div style={{flex:1}}>{item?.image}</div>
                                                    <div style={{flex:1}}>{item?.name}</div>
                                                    <div style={{flex:1}}>{item?.description}</div>
                                                    <div style={{flex:1}}>{item?.price}</div>
                                                    <div style={{flex:1}}>{item?.quantity}</div>
                                                    <div style={{flex:1}}>{item?.orderQuantity}</div>
                                                    <div style={{flex:1}}>{item?.totalPrice}</div>
                                                </div>);
                                            })
                                        }
                                    </div> 
                                    :
                                    <div></div>
                                }
                                </div>
                            </>
                            );
                        })
                    }
                </div>
            </div>);
}

export default AdminShowAllOrders;