import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

// UI COMPONENT PACKAGES
import { Loading, NextUIProvider, Button, Card, Text, Grid, Popover, Input, Textarea, Avatar, Progress, Modal, Dropdown, Table } from "@nextui-org/react";
import { Snackbar, Box, Tabs, Tab, TextField } from "@mui/material";
import { FaApplePay } from "react-icons/fa";

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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

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

export default function MigrateBusinessOnboarding(){
    let navigate = useNavigate();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDVDSmo7kVj4ENEtBemDPt8o2FwHHInmxg",
        libraries: ["places"]
    });

    const [view, setView] = useState("loading");
    const [currentUserID, setCurrentUserID] = useState("");
    const [currentBusinessID, setCurrentBusinessID] = useState("");
    const [currentBusinessName, setCurrentBusinessName] = useState("");
    const [currentBusinessAddress, setCurrentBusinessAddress] = useState("");
    const [currentBusinessAddressLatitude, setCurrentBusinessAddressLatitude] = useState("");
    const [currentBusinessAddressLongitude, setCurrentBusinessAddressLongitude] = useState("");
    const [currentBusinessOwnerName, setCurrentBusinessOwnerName] = useState("");
    const [currentBusinessDescription, setCurrentBusinessDescription] = useState("");

    useEffect(() => {
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                setCurrentUserID(currentUser["email"]);
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + currentUser["email"])).then((currentUserDoc) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {
                        setCurrentBusinessID(currentBusinessDoc.id);

                        // CHECK IF BUSINESS HAS NAME, DESCRIPTION, ADDRESS, OWNER NAME, LATER ALSO CONFIRM THAT EMAIL IS VERIFIED 
                        let businessSetupCompleted = currentBusinessDoc.data()["businessAddress"] != "" && currentBusinessDoc.data()["businessName"] != "" && currentBusinessDoc.data()["businessOwnerName"] != "" && currentBusinessDoc.data()["businessDescription"] != "";

                        setCurrentBusinessName(currentBusinessDoc.data()["businessName"]);
                        setCurrentBusinessDescription(currentBusinessDoc.data()["businessDescription"]);
                        setCurrentBusinessAddress(currentBusinessDoc.data()["businessAddress"]);
                        setCurrentBusinessOwnerName(currentBusinessDoc.data()["businessOwnerName"]);

                        if(businessSetupCompleted){
                            navigate("/dashboard");
                        }else{
                            setView("onboarding");
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }else{
                navigate("/login");
            }
        })        
    }, []);

    const completeBusinessOnboarding = (businessName, businessAddress, businessAddressLatitude, businessAddressLongitude, businessOwnerName, businessDescription) => {
        setView("loading");

        firestore.updateDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentBusinessID), {
            businessName: businessName, 
            businessAddress: businessAddress,
            businessAddressLatitude: businessAddressLatitude,
            businessAddressLongitude: businessAddressLongitude,
            businessDescription: businessDescription,
            businessOwnerName: businessOwnerName
        }).then(() => {
            navigate("/dashboard");
        }).catch((error) => {
            console.log(error);
        });
    }

    function GoogleAutocompleteInput(){
        const {
            ready,
            value,
            suggestions: { status, data },
            setValue,
            clearSuggestions,
        } = usePlacesAutocomplete({
            requestOptions: {},
            debounce: 300,
        });
    
        const handleInput = (e) => {
            setValue(e.target.value);
        };  
        
        const handleSelect = ({ description }) => () => {
            getGeocode({ address: description }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                setValue(description, false);
                setCurrentBusinessAddress(description, false);
                setCurrentBusinessAddressLatitude(lat);
                setCurrentBusinessAddressLongitude(lng);

                clearSuggestions();        
            });
        };    
              
        const renderSuggestions = () => data.map((suggestion) => {
            const { place_id, structured_formatting: { main_text, secondary_text },} = suggestion;

            return (
                <Table.Row key={place_id}>
                    <Table.Cell>
                        <div onClick={handleSelect(suggestion)}>
                            <strong>{main_text}</strong> <small>{secondary_text}</small>
                        </div>
                    </Table.Cell>
                </Table.Row>        
            );
        });  
          
        return(
            <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                <label className="mb-3 text-sm leading-none text-gray-800">Business Address</label>
                <input autoComplete="off" value={value} onChange={handleInput} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                <Table aria-label="Example table with static content">
                    <Table.Header>
                        <Table.Column>Address Suggestions</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {renderSuggestions()}                        
                    </Table.Body>
                </Table>   
            </div>                           
        );
    } 

    const memoGoogleAutocompleteInput = useMemo(() => <GoogleAutocompleteInput/>, []);

    if(view == "loading"){
        return(
            <div style={{display: "flex", width: "100%", height: "100vh", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", backgroundColor: "#FFF"}}>
                <Loading size="lg" color={"error"} />
            </div>            
        );
    }else if(view == "onboarding"){
        return(
            <div style={{display: "flex", flexDirection: "column", backgroundColor: "red", height: "100vh", width: "100%"}}>
                {/* Nav Bar and Content View as a Row */}
                <div style={{display: "flex", position: "relative", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "yellow", overflowY: "hidden"}}>             
                    <div style={{display: "flex", position: "absolute", top: 0, left: 0, height: "100%", width: 100, backgroundColor: "#FFF", flexDirection: "column", borderRightWidth: 1, borderRightColor: "#f1f5f9"}}>
                        {/* LOGO HERE */}
                        <Button disabled auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error">
                            <FaApplePay color="red" size={45}/>
                        </Button>
                        <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                            <RocketLaunchIcon style={{color: "red", fontSize: 30}}/>
                        </Button>                         
                    </div>
                    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", paddingLeft: 100, backgroundColor: "#AAA"}}>
                        <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", paddingLeft: 50}}>
                            {/* CONTENT RENDERING */}
                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll"}}>
                                <h1 class="text-4xl font-black mb-10 pt-10">Just a few more steps to get <span class="text-4xl font-black mb-10 pt-10 text-red-600">{currentBusinessName}</span> online!</h1>

                                <div className="w-full bg-white ">
                                    <div className="md:flex items-center border-b pb-6 border-gray-200">
                                        <div className="flex items-center md:mt-0 mt-4">
                                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-white">01</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Business Info</p>
                                        </div>
                                        <div className="flex items-center md:mt-0 mt-4 md:ml-12">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-gray-800">02</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Next Step</p>
                                        </div>
                                        <div className="flex items-center md:mt-0 mt-4 md:ml-12">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                <p className="text-base font-medium leading-none text-gray-800">03</p>
                                            </div>
                                            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Confirmation Overview</p>
                                        </div>              
                                    </div>
                                    <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
                                        Business Details
                                    </h2>
                                    <p className="text-sm font-light leading-none text-gray-600 mt-0.5">These are private details that will be used to manage your RewardLyst account</p>
                                    <div className="mt-8 md:flex items-center">
                                        <div className="flex flex-col">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Business name</label>
                                            <input value={currentBusinessName} onChange={(value) => {setCurrentBusinessName(value.target.value);}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                                        </div>
                                        <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Business Description</label>
                                            <input value={currentBusinessDescription} onChange={(value) => {setCurrentBusinessDescription(value.target.value);}} type="name" tabIndex={0} aria-label="Enter last name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"/>
                                        </div>
                                    </div>

                                    <div className="mt-8 md:flex items-center">
                                        <div className="flex flex-col">
                                            <label className="mb-3 text-sm leading-none text-gray-800">Business Owner Name</label>
                                            <input value={currentBusinessOwnerName} onChange={(value) => {setCurrentBusinessOwnerName(value.target.value);}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                                        </div>
                                        {(() => {
                                            if(isLoaded){
                                                return(
                                                    memoGoogleAutocompleteInput
                                                );
                                            }else{
                                                return(
                                                    <p>...Loading autocomplete...</p>
                                                );
                                            }
                                        })()} 
                                    </div>                                                                          
                                    <Button style={{marginTop: 15}} flat color={"error"} onPress={() => {
                                        completeBusinessOnboarding(currentBusinessName, currentBusinessAddress, currentBusinessAddressLatitude, currentBusinessAddressLongitude, currentBusinessOwnerName, currentBusinessDescription);
                                    }}>
                                        Complete
                                    </Button>                                    
                                </div> 

                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}