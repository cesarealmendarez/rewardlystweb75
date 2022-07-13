import React, {} from "react";
import { useNavigate } from "react-router-dom";

// UI COMPONENT PACKAGES
import { Loading, NextUIProvider, Button, Card, Text, Grid, Popover, Input, Textarea, Avatar, Progress, Modal, Dropdown } from "@nextui-org/react";
import { Snackbar, Box, Tabs, Tab, TextField } from "@mui/material";

// UI ICON PACKAGES
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import Logout from '@mui/icons-material';
import StartIcon from "@mui/icons-material/Start"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';

// DEFAULT REWARD ICONS
// ICON1
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
// ICON2
import FastfoodIcon from '@mui/icons-material/Fastfood';
// ICON3
import MenuBookIcon from '@mui/icons-material/MenuBook';
// ICON4
import RestaurantIcon from '@mui/icons-material/Restaurant';

// FIREBASE PACKAGES
import * as auth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import * as storage from 'firebase/storage';
import { FaApplePay } from "react-icons/fa";

class UIPG extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            announcementBannerVisible: true,

            focusedTab: "rewards",

        }
    }

    render(){
        return(
            <div style={{display: "flex", flexDirection: "column", backgroundColor: "red", height: "100vh", width: "100%"}}>
                {/* Banner */}
                {this.state.announcementBannerVisible ? 
                    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "auto", backgroundColor: "green"}}>
                        {/* ANNOUNCEMENT BANNER COMPONENT */}
                        <div className="bg-rose-600">
                            <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between flex-wrap">
                                    <div className="w-0 flex-1 flex items-center">
                                        <span className="flex p-2 rounded-lg bg-red-800">
                                            <CampaignIcon style={{color: "#FFF"}}/>
                                        </span>
                                        <p className="ml-3 font-medium text-white truncate">
                                        <span className="md:hidden">We announced a new product!</span>
                                        <span className="hidden md:inline">Select your subscription plan to go live!</span>
                                        </p>
                                    </div>
                                    <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                        <a
                                        href="#"
                                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                                        >
                                        Learn more
                                        </a>
                                    </div>
                                    <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                        <button
                                        onClick={() => {this.setState({announcementBannerVisible: false})}}
                                        type="button"
                                        className="-mr-1 flex p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                                        >
                                        <span className="sr-only">Dismiss</span>
                                            <CloseIcon style={{color: "#FFF"}}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>     
                    :
                    null           
                }
                {/* Nav Bar and Content View as a Row */}
                <div style={{display: "flex", position: "relative", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "yellow", overflowY: "hidden"}}>             
                    <div style={{display: "flex", position: "absolute", top: 0, left: 0, height: "100%", width: 100, backgroundColor: "#FFF", flexDirection: "column", borderRightWidth: 1, borderRightColor: "#f1f5f9"}}>
                        {/* LOGO HERE */}
                        <Button disabled auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error">
                            <FaApplePay color="red" size={45}/>
                        </Button>
                        {this.state.focusedTab == "rewards" ?
                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                <LocalActivityIcon style={{color: "red", fontSize: 30}}/>
                            </Button>                        
                            :
                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {}}>
                                <LocalActivityIcon style={{color: "red", fontSize: 30}}/>
                            </Button>
                        }

                        {this.state.focusedTab == "storeMode" ?
                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                <StorefrontIcon style={{color: "red", fontSize: 30}}/>
                            </Button>
                            :
                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {}}>
                                <StorefrontIcon style={{color: "red", fontSize: 30}}/>
                            </Button>                        
                        }

                        {this.state.focusedTab == "discover" ?
                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                <MapIcon style={{color: "red", fontSize: 30}}/>
                            </Button>
                            :
                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {}}>
                                <MapIcon style={{color: "red", fontSize: 30}}/>
                            </Button>
                        }
                        
                        {this.state.focusedTab == "settings" ?
                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                <SettingsIcon style={{color: "red", fontSize: 30}}/>
                            </Button>
                            :
                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {}}>
                                <SettingsIcon style={{color: "red", fontSize: 30}}/>
                            </Button>                            
                        }
                        <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {
                            auth.getAuth().signOut().catch((error) => {console.log(error)});
                        }}>
                            <LogoutIcon style={{color: "red", fontSize: 30}}/>
                        </Button>                             
                    </div>
                    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", paddingLeft: 100, backgroundColor: "#AAA"}}>
                        <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", paddingLeft: 50}}>
                            {/* CONTENT RENDERING */}
                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll"}}>
                                <h1 class="text-4xl font-black mb-10 pt-10">Dashboard</h1>
                            </div>                            
                            {/* <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll"}}>
                                <h1 class="text-4xl font-black mb-10 pt-10">Just a few more steps to get Target online!</h1>

                                <div className="w-full bg-white ">
                                    <div className="md:flex items-center border-b pb-6 border-gray-200">
                                        <div className="flex items-center md:mt-0 mt-4">
                                            <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-white">01</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Business Account Creation</p>
                                        </div>
                                        <div className="flex items-center md:mt-0 mt-4 md:ml-12">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-gray-800">02</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Business Info</p>
                                        </div>
                                        <div className="flex items-center md:mt-0 mt-4 md:ml-12">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-gray-800">03</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Confirmation Overview</p>
                                        </div>              
                                    </div>
                                    <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
                                        Business Owner Details
                                    </h2>
                                    <p className="text-sm font-light leading-none text-gray-600 mt-0.5">These are private details that will be used to manage your RewardLyst account</p>
                                    <div className="mt-8 md:flex items-center">
                                        <div className="flex flex-col">
                                            <label className="mb-3 text-sm leading-none text-gray-800">First name</label>
                                            <input value={""} onChange={(value) => {}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="William" />
                                        </div>
                                        <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Last name</label>
                                            <input value={""} onChange={(value) => {}} type="name" tabIndex={0} aria-label="Enter last name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="Smith" />
                                        </div>
                                    </div>
                                    <div className="mt-12 md:flex items-center">
                                        <div className="flex flex-col">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Accessible Email Address</label>
                                            <input value={""} onChange={(value) => {}} type="email" tabIndex={0} aria-label="Enter email Address" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="smith.william@gmail.com" />
                                        </div>
                                        <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Account Password</label>
                                            <input value={""} onChange={(value) => {}}  tabIndex={0} aria-label="Enter phone number" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="+81 839274" />
                                        </div>
                                    </div>
                                </div> 

                            </div> */}
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default UIPG;