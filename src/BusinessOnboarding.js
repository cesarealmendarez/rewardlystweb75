import React, { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";


import { Loading, NextUIProvider, Button, Card, Text, Grid, Popover, Input, Textarea, Avatar, Progress, Modal, Dropdown, Table, } from "@nextui-org/react";

import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LogoutIcon from '@mui/icons-material/Logout';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// FIREBASE PACKAGES
import * as auth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import * as storage from 'firebase/storage';

export default function BusinessOnboarding(){
    let navigate = useNavigate();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDVDSmo7kVj4ENEtBemDPt8o2FwHHInmxg",
        libraries: ["places"]
    });

    const [currentUserID, setCurrentUserID] = useState("");
    const [currentBusinessID, setCurrentBusinessID] = useState("");
    const [currentBusinessSetupName, setCurrentBusinessSetupName] = useState("");
    const [currentBusinessSetupDescription, setCurrentBusinessSetupDescription] = useState("");
    const [currentBusinessSetupAddressString, setCurrentBusinessSetupAddressString] = useState("");
    const [currentBusinessSetupAddressLatitude, setCurrentBusinessSetupAddressLatitude] = useState("");
    const [currentBusinessSetupAddressLongitude, setCurrentBusinessSetupAddressLongitude] = useState("");
    const [currentBusinessSetupOwnerName, setCurrentBusinessSetupOwnerName] = useState("");
    const [view, setView] = useState("loading");

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
                setCurrentBusinessSetupAddressString(description, false);
                setCurrentBusinessSetupAddressLatitude(lat);
                setCurrentBusinessSetupAddressLongitude(lng);

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
            <div className="mt-8 md:flex items-center">
                <div className="flex flex-col">
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
            </div>                
        );
    } 

    const memoGoogleAutocompleteInput = useMemo(() => <GoogleAutocompleteInput/>, []);

    useEffect(() => {
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                setCurrentUserID(currentUser["email"]);
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + currentUser["email"])).then((currentUserDoc) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {
                        setCurrentBusinessID(currentBusinessDoc.id);

                        // CHECK IF BUSINESS HAS; NAME, DESCRIPTION, ADDRESS, LATER ALSO CONFIRM THAT EMAIL IS VERIFIED 
                        let businessSetupCompleted = currentBusinessDoc.data()["businessAddress"] != "" && currentBusinessDoc.data()["businessName"] != "" && currentBusinessDoc.data()["businessOwnerName"] != "" && currentBusinessDoc.data()["businessDescription"] != "";

                        setCurrentBusinessSetupName(currentUserDoc.data()["businessName"]);
                        setCurrentBusinessSetupDescription(currentUserDoc.data()["businessDescription"]);
                        setCurrentBusinessSetupAddressString(currentUserDoc.data()["businessAddress"]);
                        setCurrentBusinessSetupOwnerName(currentUserDoc.data()["businessOwnerName"]);

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

    const completeBusinessOnboarding = (businessName, businessOwnerName, businessDescription, businessAddressString, businessAddressLatitude, businessAddressLongtitude) => {
        console.log(businessName, businessOwnerName, businessDescription, businessAddressString, businessAddressLatitude, businessAddressLongtitude)
        setView("loading");

        firestore.updateDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentBusinessID), {
            businessName: businessName, 
            businessAddress: businessAddressString,
            businessAddressLatitude: businessAddressLatitude,
            businessAddressLongtitude: businessAddressLongtitude,
            businessDescription: businessDescription,
            businessOwnerName: businessOwnerName
        }).then(() => {
            navigate("/dashboard");
        }).catch((error) => {
            console.log(error);
        });
    }
    
    if(view == "loading"){
        return(
            <div style={{display: "flex", width: "100%", height: "100vh", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", backgroundColor: "#FFF"}}>
                <Loading size="lg" color={"error"} />
            </div>            
        );
    }else if(view == "onboarding"){
        return( 
            <NextUIProvider>
                {/* LIGHT BACKDROP */}
                <div style={{display: "flex", backgroundColor: "#F5F6F8", height: "100vh"}}>
                    {/* NAV BAR */}
                    <div style={{display: "flex", position: "absolute", top: 0, left: 0, height: "100%", width: 100, backgroundColor: "#FFF", flexDirection: "column"}}>
                        <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                            <RocketLaunchIcon style={{color: "red", fontSize: 30}}/>
                        </Button>                    
    
                        <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {
                            auth.getAuth().signOut().catch((error) => {console.log(error)});
                        }}>
                            <LogoutIcon style={{color: "red", fontSize: 30}}/>
                        </Button>                        
                    </div> 
    
                    <div style={{display: "flex", height: "100%", width: "100%", paddingLeft: 100}}>
                        <div style={{display: "flex", width: "100%", height: "100%", padding: 15}}>
                            <Card style={{display: "flex", height: "90%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}} variant="flat">
                                <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll", overflowX: "hidden"}}>
                                    {/* REWARDS HEADER */}
                                    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "auto", backgroundColor: "#FFF", paddingRight: 15, paddingLeft: 15}}>
                                        {/* FORM CONTAINER */}
                                        <div>
                                            <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
                                                Business Info
                                            </h2>
                                            <p className="text-sm font-light leading-none text-gray-600 mt-0.5">These are public details that will be used to showcase your business to RewardLyst customers</p>                                                     
                                            <div className="mt-8 md:flex items-center">
                                                <div className="flex flex-col">
                                                    <label className="mb-3 text-sm leading-none text-gray-800">Business Name</label>
                                                    <input value={currentBusinessSetupName} onChange={(value) => {setCurrentBusinessSetupName(value.target.value)}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                                                </div>
                                                <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                                                    <label className="mb-3 text-sm leading-none text-gray-800">Business Description</label>
                                                    <input value={currentBusinessSetupDescription} onChange={(value) => {setCurrentBusinessSetupDescription(value.target.value)}} type="name" tabIndex={0} aria-label="Enter last name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                                                </div>
                                            </div>
                                            <div className="mt-8 md:flex items-center">
                                                <div className="flex flex-col">
                                                    <label className="mb-3 text-sm leading-none text-gray-800">Business Address</label>
                                                    {/* <input value={currentBusinessSetupAddressString} onChange={(value) => {setCurrentBusinessSetupAddressString(value.target.value)}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"  /> */}
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
                                                <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
                                                    <label className="mb-3 text-sm leading-none text-gray-800">Business Owner Name</label>
                                                    <input value={currentBusinessSetupOwnerName} onChange={(value) => {setCurrentBusinessSetupOwnerName(value.target.value)}} type="name" tabIndex={0} aria-label="Enter last name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" />
                                                </div>                                                
                                            </div>  
                                            <button onClick={() => {completeBusinessOnboarding(currentBusinessSetupName, currentBusinessSetupOwnerName, currentBusinessSetupDescription, currentBusinessSetupAddressString, currentBusinessSetupAddressLatitude, currentBusinessSetupAddressLongitude);}} role="button" aria-label="Next step" className="flex items-center justify-center py-4 px-7 focus:outline-none bg-white border rounded border-gray-400 mt-7 md:mt-14 hover:bg-gray-100  focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">
                                                <span className="text-sm font-medium text-center text-gray-800 capitalize">Get Started</span>
                                                <svg className="mt-1 ml-3" width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.01 3H0V5H8.01V8L12 4L8.01 0V3Z" fill="#242731" />
                                                </svg>
                                            </button>                                               

                                        </div>                                        
                                    </div>

                                </div>
                            </Card>                        
                        </div>                    
                    </div>
                </div>            
            </NextUIProvider>
        );
    }
}

