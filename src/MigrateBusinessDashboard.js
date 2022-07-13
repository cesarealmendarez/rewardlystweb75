import React, {} from "react";
import { useNavigate } from "react-router-dom";

// UI COMPONENT PACKAGES
import { Loading, NextUIProvider, Button, Card, Text, Grid, Popover, Input, Textarea, Avatar, Progress, Modal, Dropdown } from "@nextui-org/react";
import { Snackbar, Box, Tabs, Tab, TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

import { FaApplePay } from "react-icons/fa";

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

// IMAGE ASSETS
import CreateFirstReward from "./assets/CreateFirstReward.png";

class MigrateBusinessDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            announcementBannerVisible: false,
            announcementBannerTitle: "",

            loadingDashboard: true,
            focusedView: "loading",
            focusedTab: "rewards",

            currentUserID: "",
            currentBusinessID: "",
            currentBusinessCustomers: [],
            currentBusinessRewards: [],

            createRewardTitle: "",
            createRewardDescription: "",
            createRewardIcon: "icon1",
            createRewardImage: "",
            createRewardImageObject: "",
            createRewardPointsGoal: "",
            createRewardIconOptions: ["icon1", "icon2", "icon3", "icon4"],

            storeModeCustomers: [],
            storeModeSelectedCustomerRewardsLoading: false,
            storeModeSelectedCustomerID: "",
            storeModeSelectedCustomerName: "",
            storeModeSelectedCustomerRewards: [],
        }
    }
    navigation = this.props.navigation;

    componentDidMount(){
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                this.setState({currentUserID: currentUser["email"]}, () => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + currentUser["email"])).then((currentUserDoc) => {
                        firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {   
                            this.setState({currentBusinessID: currentBusinessDoc.id});
                            this.setState({currentBusinessCustomers: currentBusinessDoc.data()["businessCustomers"]});

                            // CHECK IF BUSINESS HAS; NAME, DESCRIPTION, ADDRESS, LATER ALSO CONFIRM THAT EMAIL IS VERIFIED 
                            let businessSetupCompleted = currentBusinessDoc.data()["businessAddress"] != "" && currentBusinessDoc.data()["businessName"] != "" && currentBusinessDoc.data()["businessOwnerName"] != "" && currentBusinessDoc.data()["businessDescription"] != "";
    
                            if(businessSetupCompleted){
                                this.navigate("settings");

                                if(currentBusinessDoc.data()["businessSubscriptionPaid"] == false){
                                    this.showAnnouncementBanner("Select your subscription plan to go live!");
                                }
                                // TRIGGER WELCOME MODAL

                            }else{
                                this.navigation("/onboarding");
                            }
                        }).catch((error) => {
                            console.log(error);
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                });
            }else{
                this.navigation("/login");
            }
        });
    }

    showAnnouncementBanner = (bannerTitle) => {
        this.setState({announcementBannerTitle: bannerTitle}, () => {
            this.setState({announcementBannerVisible: true});
        });
    }

    hideAnnouncementBanner = () => {
        this.setState({announcementBannerVisible: false});
        this.setState({announcementBannerTitle: ""});
    }

    makeStringTimestamp = (timestamp) => {
        let timestampFinalString = "";
        let timestampArray = timestamp.toDate().toString().split(" ");

        timestampFinalString = timestampArray[1] + " " + timestampArray[2] + " " + timestampArray[3];

        return timestampFinalString;
    }

    uploadReward = (rewardTitle, rewardDescription, rewardPointsGoal, rewardIcon, rewardImage) => {
        this.setState({focusedView: "loading"});

        if(rewardImage != ""){
            let imageFile = rewardImage;
            let imageFileName = rewardImage.name;
            let imageFileLastModified = rewardImage.lastModified;

            storage.uploadBytes(storage.ref(storage.getStorage(), "RewardImages/" + imageFileLastModified + "-" + imageFileName), imageFile).then(() => {
                firestore.addDoc(firestore.collection(firestore.getFirestore(), "Rewards"), {
                    rewardBusinessID: this.state.currentBusinessID,
                    rewardTitle: rewardTitle,
                    rewardDescription: rewardDescription,
                    rewardImage: imageFileLastModified + "-" + imageFileName,
                    rewardIcon: rewardIcon,
                    rewardPointsGoal: rewardPointsGoal,
                    rewardCustomersStarted: [],
                    rewardCustomersCompleted: [],
                    rewardCreationTimestamp: new Date()
                }).then((docRef) => {
                    firestore.updateDoc(firestore.doc(firestore.getFirestore(), 'Businesses/' +  this.state.currentBusinessID), {
                        businessRewards: firestore.arrayUnion(docRef.id)
                    }).then(() => {
                        this.state.currentBusinessCustomers.forEach((customer) => {
                            firestore.setDoc(firestore.doc(firestore.getFirestore(), 'Customers/' + customer + "/CustomerRewards/", docRef.id), {
                                rewardBusinessID: this.state.currentBusinessID,
                                rewardPointsEarned: 0,
                                rewardPointsEarnedPrevious: 0,
                                rewardSaved: false,
                            }).catch((error) => {
                                console.log(error);
                            });                               
                        });
                        this.navigate("settings");
                        
                        toast.success("Successfully uploaded your new reward!", {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }else{
            firestore.addDoc(firestore.collection(firestore.getFirestore(), "Rewards"), {
                rewardBusinessID: this.state.currentBusinessID,
                rewardTitle: rewardTitle,
                rewardDescription: rewardDescription,
                rewardImage: "",
                rewardIcon: rewardIcon,
                rewardPointsGoal: rewardPointsGoal,
                rewardCustomersStarted: [],
                rewardCustomersCompleted: [],
                rewardCreationTimestamp: new Date()
            }).then((docRef) => {
                firestore.updateDoc(firestore.doc(firestore.getFirestore(), 'Businesses/' +  this.state.currentBusinessID), {
                    businessRewards: firestore.arrayUnion(docRef.id)
                }).then(() => {
                    this.state.currentBusinessCustomers.forEach((customer) => {
                        firestore.setDoc(firestore.doc(firestore.getFirestore(), 'Customers/' + customer + "/CustomerRewards/", docRef.id), {
                            rewardBusinessID: this.state.currentBusinessID,
                            rewardPointsEarned: 0,
                            rewardPointsEarnedPrevious: 0,
                            rewardSaved: false,
                        }).catch((error) => {
                            console.log(error);
                        });                               
                    });
                    this.navigate("rewards");
                    
                    toast.success("Successfully uploaded your new reward!", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    navigate = (target) => {
        this.setState({loadingDashboard: false});
        if(target == "rewards"){
            this.setState({focusedTab: target});
            this.setState({focusedView: "loading"});
            this.setState({currentUserID: auth.getAuth().currentUser["email"]}, () => {
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + this.state.currentUserID)).then((currentUserDoc) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {
                        let currentBusinessRewardsPushList = [];
                        currentBusinessDoc.data()["businessRewards"].forEach((rewardID) => {
                            firestore.getDoc(firestore.doc(firestore.getFirestore(), "Rewards/" + rewardID)).then((rewardDoc) => {
                                let rewardImage = "";

                                if(rewardDoc.data()["rewardImage"] != ""){
                                    storage.getDownloadURL(storage.ref(storage.getStorage(), "RewardImages/" + rewardDoc.data()["rewardImage"])).then((rewardImageURL) => {
                                        rewardImage = rewardImageURL;
                                    }).catch((error) => {
                                        console.log(error)
                                    });                                        
                                }

                                let rewardCreationTimestampString = this.makeStringTimestamp(rewardDoc.data()["rewardCreationTimestamp"]);

                                setTimeout(() => {
                                    currentBusinessRewardsPushList.push({
                                        rewardID: rewardDoc.id,
                                        rewardTitle: rewardDoc.data()["rewardTitle"],
                                        rewardDescription: rewardDoc.data()["rewardDescription"],
                                        rewardIcon: rewardDoc.data()["rewardIcon"],
                                        rewardImage: rewardImage,
                                        rewardPointsGoal: rewardDoc.data()["rewardPointsGoal"],
                                        rewardCustomersStarted: rewardDoc.data()["rewardCustomersStarted"],
                                        rewardCustomersCompleted: rewardDoc.data()["rewardCustomersCompleted"],
                                        rewardCreationTimestamp: rewardDoc.data()["rewardCreationTimestamp"],
                                        rewardCreationTimestampString: rewardCreationTimestampString
                                    });
                                    this.setState({currentBusinessRewards: currentBusinessRewardsPushList}, () => {
                                        console.log("Current Business Rewards: ")
                                        console.log(this.state.currentBusinessRewards)
                                    });                                        
                                }, 1000);
                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                        this.setState({focusedView: "rewards"})
                    }).catch((error) => {
                        console.log(error);
                    });    
                }).catch((error) => {
                    console.log(error);
                }); 
            });        
        }else if(target == "createReward"){
            this.setState({createRewardTitle: ""});
            this.setState({createRewardDescription: ""});
            this.setState({createRewardIcon: "icon1"});
            this.setState({createRewardImage: ""});
            this.setState({createRewardPointsGoal: ""});
            this.setState({focusedView: "createReward"});
        }else if(target == "storeMode"){
            this.setState({focusedView: "loading"});
            this.setState({focusedTab: "storeMode"});

            let storeModeCustomersPushList = [];
            this.setState({currentUserID: auth.getAuth().currentUser["email"]}, () => {
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + this.state.currentUserID)).then((currentUserDoc) => {
                    this.setState({currentBusinessID: currentUserDoc.data()["businessID"]}, () => {
                        firestore.getDocs(firestore.collection(firestore.getFirestore(), "Businesses/" + this.state.currentBusinessID + "/CustomerData")).then((customerData) => {
                            customerData.docs.forEach((customerDataDoc) => {
                                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Customers/" + customerDataDoc.id)).then((customerDoc) => {
                                    let customerLastBusinessSyncTimestampString = this.makeStringTimestamp(customerDataDoc.data()["lastBusinessSync"]);
            
                                    let customerProfilePicture = ""
                                    
                                    if(customerDoc.data()["customerProfilePicture"] != ""){
                                        storage.getDownloadURL(storage.ref(storage.getStorage(), "CustomerProfilePictures/" + customerDoc.data()["customerProfilePicture"])).then((customerProfilePictureURL) => {
                                            customerProfilePicture = customerProfilePictureURL;
                                        }).catch((error) => {
                                            console.log(error)
                                        }); 
                                    }
            
                                    setTimeout(() => {
                                        storeModeCustomersPushList.push({
                                            customerID: customerDoc.id,
                                            customerProfilePicture: customerProfilePicture,
                                            customerName: customerDoc.data()["customerName"],
                                            customerLastBusinessSyncTimestamp: customerDataDoc.data()["lastBusinessSync"],
                                            customerLastBusinessSyncTimestampString: customerLastBusinessSyncTimestampString,
                                            customerName: customerDoc.data()["customerName"],
                                        });
                                        this.setState({storeModeCustomers: storeModeCustomersPushList}, () => {
                                            console.log(this.state.storeModeCustomers);
                                        });                                            
                                    }, 1000);
                                }).catch((error) => {
                                    console.log(error);
                                });
                            });
                            this.setState({focusedView: "storeMode"});
                        }).catch((error) => {
                            console.log(error);
                        });
                    });
                }).catch((error) => {
                    console.log(error);
                });
            })
        }else if(target == "settings"){
            this.setState({focusedTab: "settings"});
            this.setState({focusedView: "loading"});
            
            setTimeout(() => {
                this.setState({focusedView: "settings"});
            }, 1000);

        }
    }

    storeModeSelectCustomer = (customerID) => {
        this.setState({storeModeSelectedCustomerRewardsLoading: true});
        this.setState({storeModeSelectedCustomerID: customerID});
        this.setState({storeModeSelectedCustomerRewards: []});

        let storeModeSelectedCustomerRewardsPushList = [];

        firestore.getDoc(firestore.doc(firestore.getFirestore(), "Customers/" + customerID)).then((customerDoc) => {
            this.setState({storeModeSelectedCustomerName: customerDoc.data()["customerName"]});

            firestore.getDocs(firestore.query(firestore.collection(firestore.getFirestore(), "Customers/" + customerID + "/CustomerRewards/"), firestore.where('rewardBusinessID', '==', this.state.currentBusinessID))).then((customerRewards) => {
                customerRewards.docs.forEach((customerReward) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Rewards/" + customerReward.id)).then((rewardDoc) => {
                        let rewardImage = "";

                        if(rewardDoc.data()["rewardImage"] != ""){
                            storage.getDownloadURL(storage.ref(storage.getStorage(), "RewardImages/" + rewardDoc.data()["rewardImage"])).then((rewardImageURL) => {
                                rewardImage = rewardImageURL;
                            }).catch((error) => {
                                console.log(error)
                            });                                        
                        }

                        let rewardCreationTimestampString = this.makeStringTimestamp(rewardDoc.data()["rewardCreationTimestamp"]);

                        setTimeout(() => {
                            storeModeSelectedCustomerRewardsPushList.push({
                                rewardID: rewardDoc.id,
                                rewardTitle: rewardDoc.data()['rewardTitle'],
                                rewardDescription: rewardDoc.data()['rewardDescription'],
                                rewardPointsGoal: rewardDoc.data()['rewardPointsGoal'],
                                rewardPointsEarned: customerReward.data()['rewardPointsEarned'],                    
                                rewardIcon: rewardDoc.data()["rewardIcon"],
                                rewardImage: rewardImage,
                                rewardCreationTimestamp: rewardDoc.data()["rewardCreationTimestamp"],
                                rewardCreationTimestampString: rewardCreationTimestampString
                            });
                            this.setState({storeModeSelectedCustomerRewards: storeModeSelectedCustomerRewardsPushList}, () => {
                                console.log(this.state.storeModeSelectedCustomerRewards);
                            });
                        }, 1000);
                    }).catch((error) => {alert(error)});
                }); 
                this.setState({storeModeSelectedCustomerRewardsLoading: false});
            }).then(() => {
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => {
            console.log(error)
        });
    }

    pointSystemIncrease = (customerID, rewardID, rewardPointsGoal, previousPoints, newPoints) => {

        if(newPoints <= rewardPointsGoal){
            let earnedPoints = newPoints - previousPoints;
    
            firestore.updateDoc(firestore.doc(firestore.getFirestore(), "Customers/" + customerID + "/CustomerRewards/" + rewardID), {
                rewardPointsEarned: newPoints,
                rewardPointsEarnedPrevious: previousPoints
            }).then(() => {
                firestore.updateDoc(firestore.doc(firestore.getFirestore(), "/Businesses/" + this.state.currentBusinessID + "/CustomerData/" + customerID), {
                    lastBusinessSync: new Date(),
                    lastRewardTransaction: new Date()
                }).then(() => {
                    toast.success(this.state.storeModeSelectedCustomerName + " earned " + earnedPoints + " points!", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                    let updatedStoreModeFocusedCustomerRewardsPushList = this.state.storeModeSelectedCustomerRewards;
    
                    for(let i = 0; i < updatedStoreModeFocusedCustomerRewardsPushList.length; i++){
                        if(updatedStoreModeFocusedCustomerRewardsPushList[i].rewardID == rewardID){
                            updatedStoreModeFocusedCustomerRewardsPushList[i].rewardPointsEarned =  newPoints;
                            this.setState({storeModeSelectedCustomerRewards: updatedStoreModeFocusedCustomerRewardsPushList});
                        }
                    } 
                    
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Rewards/" + rewardID)).then((rewardDoc) => {
                        if(rewardDoc.data()["rewardCustomersStarted"].includes(customerID) == false){
                            firestore.updateDoc(firestore.doc(firestore.getFirestore(), "/Rewards/" + rewardID), {
                                rewardCustomersStarted: firestore.arrayUnion(customerID)
                            }).then(() => {
                                console.log(customerID + " added to rewardCustomersStarted array");
                            }).catch((error) => {
                                console.log(error);
                            });
                        }

                        if(newPoints == rewardPointsGoal){
                            // REWARD COMPLETED
                            if(rewardDoc.data()["rewardCustomersCompleted"].includes(customerID) == false){
                                firestore.updateDoc(firestore.doc(firestore.getFirestore(), "/Rewards/" + rewardID), {
                                    rewardCustomersCompleted: firestore.arrayUnion(customerID)
                                }).then(() => {
                                    console.log(customerID + " added to rewardCustomersCompleted array");
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }
                    }).catch((error) => {
                        console.log(error)
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }else{
            alert("Reward Completed")
        }
    }

    pointSystemDecrease = (customerID, rewardID, previousPoints, newPoints) => {
        let pointsRemoved = previousPoints - newPoints;
    
        firestore.updateDoc(firestore.doc(firestore.getFirestore(), "Customers/" + customerID + "/CustomerRewards/" + rewardID), {
            rewardPointsEarned: newPoints,
            rewardPointsEarnedPrevious: previousPoints
        }).then(() => {
            firestore.updateDoc(firestore.doc(firestore.getFirestore(), "/Businesses/" + this.state.currentBusinessID + "/CustomerData/" + customerID), {
                lastBusinessSync: new Date(),
                lastRewardTransaction: new Date()
            }).then(() => {
                let updatedStoreModeFocusedCustomerRewardsPushList = this.state.storeModeSelectedCustomerRewards;

                for(let i = 0; i < updatedStoreModeFocusedCustomerRewardsPushList.length; i++){
                    if(updatedStoreModeFocusedCustomerRewardsPushList[i].rewardID == rewardID){
                        updatedStoreModeFocusedCustomerRewardsPushList[i].rewardPointsEarned = newPoints;
                        this.setState({storeModeSelectedCustomerRewards: updatedStoreModeFocusedCustomerRewardsPushList});
                    }
                }        
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }  

    render(){
        if(this.state.loadingDashboard == true){
            return(
                <div style={{display: "flex", flexDirection: "column", height: "100vh", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}}>
                    <Loading color={"error"}/>
                </div>
            );
        }else{
            return(
                <div style={{display: "flex", flexDirection: "column", backgroundColor: "red", height: "100vh", width: "100%"}}>
                    <ToastContainer />

                    {/* Banner */}
                    {this.state.announcementBannerVisible == true ? 
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
                                            {/* <span className="md:hidden">We announced a new product!</span> */}
                                                <span className="hidden md:inline">{this.state.announcementBannerTitle}</span>
                                            </p>
                                        </div>
                                        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                            <a
                                            href="#"
                                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                                            >
                                            Select Plan
                                            </a>
                                        </div>
                                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                            <button
                                            onClick={() => {this.hideAnnouncementBanner();}}
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
                                <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {this.navigate("rewards");}}>
                                    <LocalActivityIcon style={{color: "red", fontSize: 30}}/>
                                </Button>
                            }
    
                            {this.state.focusedTab == "storeMode" ?
                                <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                    <StorefrontIcon style={{color: "red", fontSize: 30}}/>
                                </Button>
                                :
                                <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {this.navigate("storeMode");}}>
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
                                <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {this.navigate("settings");}}>
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
                                {(() => {
                                    if(this.state.focusedView == "loading"){
                                        return(
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}}>
                                                <Loading color={"error"}/>
                                            </div>
                                        );
                                    }else if(this.state.focusedView == "rewards"){
                                        return(   
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll"}}>
                                                <div style={{display: "flex", flexDirection: "row", width: '100%'}}>
                                                    <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
                                                        <h1 class="text-4xl font-black mb-5 pt-10">Your Active Rewards({this.state.currentBusinessRewards.length})</h1>
                                                    </div>
                                                    
                                                    <div style={{display: "flex", flexDirection: "column", width: "50%", alignItems: "flex-end", paddingRight: 15, paddingTop: 35}}>
                                                        <Button style={{backgroundColor: "red"}} onPress={() => {
                                                            this.navigate("createReward");
                                                        }}>
                                                            + Create Reward
                                                        </Button>                                                        
                                                    </div>
                                                </div>
                                                

                                                <div style={{display: "flex", backgroundColor: "#FFF"}}>
                                                    <Grid.Container gap={0}  justify="flex-start">
                                                        {this.state.currentBusinessRewards.sort((a, b) => b.rewardCreationTimestamp - a.rewardCreationTimestamp).map((reward) => (
                                                            <Grid xs={4} style={{paddingRight: 15, paddingBottom: 30}}>
                                                                <Card style={{backgroundColor: "#FFF"}} variant="bordered">
                                                                    <Card.Body>
                                                                        {reward.rewardImage != "" ? 
                                                                            <div style={{height: 125, width: "100%", borderRadius: 10, position: "relative"}}>
                                                                                <img style={{height: "100%", width: "100%", borderRadius: 10, objectFit: "cover"}} src={reward.rewardImage}/> 
                                                                                <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.25, borderRadius: 10, position: "absolute", top: 0, left: 0}}/>
                                                                                <div style={{display: "flex", position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: "transparent", zIndex: 15, justifyContent: "flex-end", padding: 10}}>
                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0, marginRight: 15}} onClick={() => {

                                                                                    }}>
                                                                                        <SearchIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                    </button>
                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0,}} onClick={() => {
                                                                                        
                                                                                    }}>
                                                                                        <EditIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                    </button>
                                                                                </div>
                                                                            </div>  
                                                                            :
                                                                            <div style={{display: "flex", flexDirection: "row", height: 125, width: "100%", borderRadius: 10, backgroundColor: "red"}}>
                                                                                <div style={{display: "flex", flexDirection: "column", width: "50%", justifyContent: "center", paddingLeft: 10, borderRadius: 10}}>
                                                                                    {(() => {
                                                                                        if(reward.rewardIcon == "icon1"){
                                                                                            return(
                                                                                                <EmojiFoodBeverageIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                            );
                                                                                        }else if(reward.rewardIcon == "icon2"){
                                                                                            return(
                                                                                                <FastfoodIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                            );
                                                                                        }else if(reward.rewardIcon == "icon3"){
                                                                                            return(
                                                                                                <MenuBookIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                            );
                                                                                        }else if(reward.rewardIcon == "icon4"){
                                                                                            return(
                                                                                                <RestaurantIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                            );
                                                                                        }                                                                                        
                                                                                    })()}
                                                                                </div>
                                                                                <div style={{display: "flex", flexDirection: "row", width: "50%", backgroundColor: "red", justifyContent: "flex-end", paddingTop: 10, paddingRight: 10, borderRadius: 10}}>
                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0, marginRight: 15}} onClick={() => {

                                                                                    }}>
                                                                                        <SearchIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                    </button>
                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0,}} onClick={() => {
                                                                                    
                                                                                    }}>
                                                                                        <EditIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                    </button>
                                                                                </div>
                                                                            </div>                                                                                                                                                    
                                                                        }
                                                                        
                                                                        <h1 class="mt-3 text-xl font-bold">{reward.rewardTitle}</h1>
                                                                        {/* <div style={{display: "flex", flexDirection: "column", backgroundColor: "#FFF"}}>
                                                                            <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                <CheckIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                <Text p weight={"medium"} style={{color: "#AAA"}}>{reward.rewardCustomersCompleted.length} customers completed this reward</Text>
                                                                            </div>
                                                                            <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                <StartIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                <Text p weight={"medium"} style={{color: "#AAA"}}>{reward.rewardCustomersStarted.length} customers started this reward</Text>
                                                                            </div>                                                                            
                                                                            <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                <CalendarMonthIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                <Text p weight={"medium"} style={{color: "#AAA"}}>Start Date {reward.rewardCreationTimestampString}</Text>
                                                                            </div>                                                                                                                                                        
                                                                        </div> */}
                                                                    </Card.Body>
                                                                </Card>                                
                                                            </Grid>
                                                        ))}
                                                    </Grid.Container>
                                                </div>                                            
                                            </div> 
                                        );
                                    }else if(this.state.focusedView == "createReward"){
                                        return(
                                            <div class="w-full max-w-lg pt-10">
                                                <input
                                                    id="createRewardImageUpload"
                                                    style={{display: 'none'}}
                                                    type="file"
                                                    accept="image/*"
                                                    name="myImage"
                                                    onChange={(event) => {
                                                        this.setState({createRewardImageObject: URL.createObjectURL(event.target.files[0])});
                                                        this.setState({createRewardImage: event.target.files[0]});
                                                    }}
                                                />                                                    
                                                <h1 class="text-4xl font-black mb-2">Create Reward</h1>
                                                <p class="font-normal mb-10 text-slate-500">Select a type of reward and fill out it's required fields. After uploading, your customers will be notified!</p>

                                                {(() => {
                                                    if(this.state.createRewardImage != ""){
                                                        return(
                                                            <div style={{height: 125, width: "100%", borderRadius: 10, marginBottom: 15}}>
                                                                <img style={{height: "100%", width: "100%", borderRadius: 10, objectFit: "cover"}} src={this.state.createRewardImageObject}/> 
                                                            </div>                                        
                                                        );
                                                    }else{
                                                        if(this.state.createRewardIcon == "icon1"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <EmojiFoodBeverageIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            );
                                                        }else if(this.state.createRewardIcon == "icon2"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <FastfoodIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }else if(this.state.createRewardIcon == "icon3"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <MenuBookIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }else if(this.state.createRewardIcon == "icon4"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <RestaurantIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                })()} 

                                                {this.state.createRewardImage != "" ?
                                                    <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom: 15}}>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingRight: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                this.setState({createRewardImage: ""});
                                                                this.setState({createRewardImageObject: ""});
                                                            }}>
                                                                Remove Image
                                                            </Button>
                                                        </div>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingLeft: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                document.getElementById("createRewardImageUpload").click();
                                                            }}>
                                                                Upload Custom Image
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    :                                                
                                                    <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom: 15}}>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingRight: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                let randomIconIndex = Math.floor(Math.random() * 3); 
                                                                let randomIcon = this.state.createRewardIconOptions[randomIconIndex];
                                                                this.setState({createRewardIcon: randomIcon}); 
                                                            }}>
                                                                Random Icon
                                                            </Button>
                                                        </div>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingLeft: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                document.getElementById("createRewardImageUpload").click();
                                                            }}>
                                                                Upload Custom Image
                                                            </Button>
                                                        </div>
                                                    </div>  
                                                }         
                                                <div class="flex flex-wrap -mx-3 mb-6">
                                                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                                        Title
                                                    </label>
                                                    <input value={this.state.createRewardTitle} onChange={(value) => {this.setState({createRewardTitle: value.target.value})}} class="appearance-none block w-full text-gray-800 border rounded border-gray-300 py-3 px-4 mb-3 leading-tight focus:outline-none" id="grid-first-name" type="text" placeholder="Title"/>
                                                    {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
                                                    </div>
                                                    <div class="w-full md:w-1/2 px-3">
                                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                                                        Points Goal
                                                    </label>
                                                    <input value={this.state.createRewardPointsGoal} onChange={(value) => {this.setState({createRewardPointsGoal: value.target.value})}} class="appearance-none block w-full text-gray-800 border rounded border-gray-300 py-3 px-4 mb-3 leading-tight focus:outline-none" id="grid-first-name" type="number" placeholder="Points Goal"/>
                                                    </div>
                                                </div>
                                                <div class="flex flex-wrap -mx-3 mb-6">
                                                    <div class="w-full px-3">
                                                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                                            Description
                                                        </label>
                                                        <input value={this.state.createRewardDescription} onChange={(value) => {this.setState({createRewardDescription: value.target.value})}} class="appearance-none block w-full text-gray-800 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" id="grid-password" type="text" placeholder="Description"/>
                                                    </div>
                                                </div>
                                                <div class="flex flex-wrap -mx-3 mb-6">
                                                    <div class="w-full px-3">
                                                        <Button style={{width: "100%"}} flat color="error" auto onClick={() => {this.uploadReward(this.state.createRewardTitle, this.state.createRewardDescription, this.state.createRewardPointsGoal, this.state.createRewardIcon, this.state.createRewardImage);}}>
                                                            Upload Reward
                                                        </Button>                                                        
                                                    </div>                                                
                                                </div>
                                                {/* <div class="flex flex-wrap -mx-3 mb-2">
                                                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                                                        City
                                                    </label>
                                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque"/>
                                                    </div>
                                                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                                        State
                                                    </label>
                                                    <div class="relative">
                                                        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                                        <option>New Mexico</option>
                                                        <option>Missouri</option>
                                                        <option>Texas</option>
                                                        </select>
                                                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                                                        Zip
                                                    </label>
                                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210"/>
                                                    </div>
                                                </div>                                            */}
                                            </div>
                                        );
                                    }else if(this.state.focusedView == "storeMode"){
                                        return(
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", paddingRight: 50, paddingTop: 25}}>
                                                <div style={{display: "flex", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "hidden"}}>
                                                    {/* CUSTOMER LIST */}
                                                    <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll", paddingRight: 15}}>
                                                        {this.state.storeModeSelectedCustomerID != "" ?
                                                            <h1 class="text-4xl font-black mb-5">{this.state.storeModeSelectedCustomerName.split(" ")[0]}'s Rewards</h1>
                                                            :
                                                            <h1 class="text-4xl font-black mb-5">Your Customers({this.state.storeModeCustomers.length})</h1>                                                        
                                                        }
                                                        
                                                        {/* CUSTOMER MAP */}
                                                        {this.state.storeModeCustomers.map((customer) => (
                                                            <Card key={0} variant="flat" style={{marginBottom: 15, backgroundColor: "#FFF"}} isPressable onPress={() => {this.storeModeSelectCustomer(customer.customerID);}}>
                                                                <Card.Body>
                                                                    <div style={{display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
                                                                        {/* SYNC STATUS */}
                                                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                                            <div style={{height: 15, width: 15, backgroundColor: "orange", borderRadius: 15/2, marginRight: 5}}/>
                                                                            <Text p style={{color: "#000"}}>Last Business Sync: {customer.customerLastBusinessSyncTimestampString}</Text>
                                                                        </div>

                                                                        {/* AVATAR, NAME, PHONE NUMBER */}
                                                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10}}>  
                                                                            <Avatar
                                                                                size="xl"
                                                                                bordered
                                                                                squared
                                                                                style={{marginRight: 10}}
                                                                                text={customer.customerName.split(" ")[0][0] + customer.customerName.split(" ")[1][0]}
                                                                            />                                                               
                                                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                                                <Text h3 weight={"bold"}>{customer.customerName}</Text>
                                                                                <Text p>{customer.customerID}</Text>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Card.Body>
                                                            </Card>  
                                                        ))}                                                                                                                                                                    
                                                    </div>

                                                    {/* CUSTOMER REWARDS LIST */}
                                                    {(() => {
                                                        if(this.state.storeModeSelectedCustomerRewardsLoading == true){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF", overflowY: "none", paddingLeft: 15}}>
                                                                    <Card style={{display: "flex", height: "100%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}} variant="flat">
                                                                        <Loading size="lg" color={"error"}/>
                                                                    </Card>  
                                                                </div>                                                                 
                                                            );
                                                        }else{    
                                                            if(this.state.storeModeSelectedCustomerID != ""){
                                                                return(
                                                                    <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll", paddingLeft: 15}}>
                                                                        {this.state.storeModeSelectedCustomerRewards.sort((a, b) => ((b.rewardPointsEarned/b.rewardPointsGoal) * 100) - ((a.rewardPointsEarned/a.rewardPointsGoal) * 100)).map((reward) => (
                                                                            <div style={{width: "100%"}}>
                                                                                <Card style={{backgroundColor: "#FFF", marginBottom: 15, width: "100%"}} variant="bordered">
                                                                                    <Card.Body>
                                                                                        {reward.rewardImage != "" ? 
                                                                                            <div style={{height: 125, width: "100%", borderRadius: 10, position: "relative"}}>
                                                                                                <img style={{height: "100%", width: "100%", borderRadius: 10, objectFit: "cover"}} src={reward.rewardImage}/> 
                                                                                                <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.25, borderRadius: 10, position: "absolute", top: 0, left: 0}}/>
                                                                                                <div style={{display: "flex", position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: "transparent", zIndex: 15, justifyContent: "flex-end", padding: 10}}>
                                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0}} onClick={() => {
                                                                                                        
                                                                                                    }}>
                                                                                                        <SearchIcon style={{fontSize: 35, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                                    </button>
                                                                                                </div>                                                                                                
                                                                                            </div>  
                                                                                            :
                                                                                            <div style={{display: "flex", flexDirection: "row", height: 125, width: "100%", borderRadius: 10, backgroundColor: "red"}}>
                                                                                                <div style={{display: "flex", flexDirection: "column", width: "50%", backgroundColor: "red", justifyContent: "center", paddingLeft: 10, borderRadius: 10}}>
                                                                                                    {(() => {
                                                                                                        if(reward.rewardIcon == "icon1"){
                                                                                                            return(
                                                                                                                <EmojiFoodBeverageIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                                            );
                                                                                                        }else if(reward.rewardIcon == "icon2"){
                                                                                                            return(
                                                                                                                <FastfoodIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                                            );
                                                                                                        }else if(reward.rewardIcon == "icon3"){
                                                                                                            return(
                                                                                                                <MenuBookIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                                            );
                                                                                                        }else if(reward.rewardIcon == "icon4"){
                                                                                                            return(
                                                                                                                <RestaurantIcon style={{color: "#FFF", fontSize: 90}}/>
                                                                                                            );
                                                                                                        }                                                                                        
                                                                                                    })()}
                                                                                                </div>
                                                                                                <div style={{display: "flex", flexDirection: "row", width: "50%", backgroundColor: "red", justifyContent: "flex-end", paddingTop: 10, paddingRight: 10, borderRadius: 10}}>
                                                                                                    <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0}} onClick={() => {

                                                                                                    }}>
                                                                                                        <SearchIcon style={{fontSize: 35, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                                    </button>
                                                                                                </div>                                                                                                
                                                                                                                                                                                            
                                                                                            </div>                                                                                                                                                    
                                                                                        }

                                                                                        <h1 class="mt-5 mb-5 text-2xl font-bold">{reward.rewardTitle}</h1>

                                                                                        <div>
                                                                                            <Card style={{display: "flex", marginTop: 0, marginBottom: 30}} variant="flat">
                                                                                                <Card.Body style={{display: "flex", flexDirection: "column"}}>
                                                                                                    <div style={{display: "flex", flexDirection: "row"}}>
                                                                                                        <div style={{display: "flex", width: "33.33%", height: 75}}>
                                                                                                            <Button style={{height: "100%", width: "100%"}} flat auto color="error" icon={<RemoveIcon style={{fontSize: 50}} fill="currentColor" filled />} onClick={() => {

                                                                                                            this.pointSystemDecrease(this.state.storeModeSelectedCustomerID, reward.rewardID, reward.rewardPointsEarned, reward.rewardPointsEarned - 1)                                                                                                                
                                                                                                            }}/>
                                                                                                        </div>
                                                                                                        <div style={{display: "flex", width: "33.33%", height: 75, paddingLeft: 10, paddingRight: 10}}>
                                                                                                            <input type={"number"} style={{display: "flex", backgroundColor: "#FFF", height: "100%", width: "100%", border: "none", borderRadius: 5, textAlign: "center", fontWeight: "bold", fontSize: 30}} value={reward.rewardPointsEarned}/>
                                                                                                        </div>      
                                                                                                        <div style={{display: "flex", width: "33.33%", height: 75}}>
                                                                                                            <Button style={{height: "100%", width: "100%"}} flat auto color="success" icon={<AddIcon style={{fontSize: 50}} fill="currentColor" filled />} onClick={() => {
                                                                                                                this.pointSystemIncrease(this.state.storeModeSelectedCustomerID, reward.rewardID, reward.rewardPointsGoal, reward.rewardPointsEarned, reward.rewardPointsEarned + 1)
                                                                                                            }}/>
                                                                                                        </div>
                                                                                                    </div>   
                                                                                                </Card.Body>
                                                                                            </Card> 
                                                                                        </div>  

                                                                                        <div style={{display: "flex", position: "relative"}}>
                                                                                            <Progress color="error" value={(reward.rewardPointsEarned/reward.rewardPointsGoal) * 100} />                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                            <Button style={{position: "absolute", left: (reward.rewardPointsEarned/reward.rewardPointsGoal) * 100 - 2 + "%", top: -10}} flat auto color="error" icon={<StarIcon style={{fontSize: 20}} fill="currentColor" filled />}/>                                                                                                     
                                                                                        </div>                                                                                                                                                                         
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            </div>  
                                                                        ))}                                                      
                                                                    </div>  
                                                                );
                                                            }else{
                                                                return(
                                                                    <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF", overflowY: "none", paddingLeft: 15}}>
                                                                        <Card style={{display: "flex", height: "100%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}} variant="flat">
                                                                            <Button style={{marginBottom: 15, height: 90, width: 90}} flat auto color="error" icon={<StarIcon style={{fontSize: 70}} fill="currentColor" filled />}/> 
                                                                            <h1 class="text-4xl font-black mb-5">Select a customer to add rewards!</h1>
                                                                        </Card>  
                                                                    </div>                                                               
                                                                );
                                                            }                                                            
                                                        }                                                                              
                                                    })()}                                                 
                                                </div>
                                            </div>                                           
                                            // <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", paddingRight: 50, paddingTop: 25}}>
                                            //     <div style={{display: "flex", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll"}}>
                                            //         <h1 class="text-4xl font-black mb-5 pt-10">Your RewardLyst Customers</h1>                                                        
                                                                                                        
                                            //             <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF"}}>
                                            //                 <Card isPressable style={{backgroundColor: "#FFF"}} variant="bordered">
                                            //                     <Card.Body>
                                            //                         <p>user card</p>
                                            //                     </Card.Body>
                                            //                 </Card>
                                            //             </div>

                                            //             <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "#FFF"}}>
                                                        
                                            //             </div>                                                     
                                                   
                                            //     </div>
                                            // </div> 
                                        );
                                    }else if(this.state.focusedView == "settings"){
                                        return(
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", paddingRight: 50, paddingTop: 25}}>
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "", overflowY: "scroll"}}>
                                                    <h1 class="text-4xl font-black mb-5">Business Account Settings</h1>                                                           
                                                    <div class="border-b border-white-200">
                                                        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                                            <li class="mr-2">
                                                                <a href="#" class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                                                                    <svg class="mr-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>Public Business Info
                                                                </a>
                                                            </li>
                                                            <li class="mr-2">
                                                                <a href="#" class="inline-flex p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500 group" aria-current="page">
                                                                    <svg class="mr-2 w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>Private Account Info
                                                                </a>
                                                            </li>
                                                            <li class="mr-2">
                                                                <a href="#" class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                                                                    <svg class="mr-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M 4 8 L 10 1 L 13 0 L 12 3 L 5 9 C 6 10 6 11 7 10 C 7 11 8 12 7 12 A 1.42 1.42 0 0 1 6 13 A 5 5 0 0 0 4 10 Q 3.5 9.9 3.5 10.5 T 2 11.8 T 1.2 11 T 2.5 9.5 T 3 9 A 5 5 90 0 0 0 7 A 1.42 1.42 0 0 1 1 6 C 1 4 2 6 3 6 C 2 7 3 7 4 8 M 10 1 L 10 3 L 12 3 L 10.2 2.8 L 10 1"></path></svg>Subscription
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>                                                                                                    
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}                                                 
                            </div>
                        </div>
                        
                    </div>
                </div>
            );
        }
    }
}

export default function (props){
    const navigation = useNavigate();

    return <MigrateBusinessDashboard {...props} navigation={navigation}/>
}