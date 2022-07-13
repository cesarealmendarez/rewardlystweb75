import React, {} from "react"
import { useNavigate } from "react-router-dom";

// UI COMPONENT PACKAGES
import { Loading, NextUIProvider, Button, Card, Text, Grid, Popover, Input, Textarea, Avatar, Progress, Modal, Dropdown } from "@nextui-org/react";
import { Snackbar, Box, Tabs, Tab, TextField } from "@mui/material";

// CUSTOM COMPONENT FILES
// import Discover from "./Discover";

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

class BusinessDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            currentBusinessID: "",

            // FULLSCREEN 
            loadingDashboard: true,
            focusedTab: "rewards",
            // CARD
            focusedView: "loading",

            announcementBannerVisible: false,

            currentBusinessRewards: [],
            currentBusinessCustomers: [],
            currentBusinessSubscriptionPaid: false,

            createRewardModalOpen: false,
            createRewardView: "form",
            createRewardTitle: "",
            createRewardDescription: "",
            createRewardIcon: "icon1",
            createRewardImage: "",
            createRewardImageObject: "",
            createRewardPointsGoal: "",
            createRewardIconOptions: ["icon1", "icon2", "icon3", "icon4"],

            editRewardID: "",
            editRewardModalOpen: false,
            editRewardView: "form",
            editRewardTitle: "",
            editRewardDescription: "",
            editRewardIcon: "",
            editRewardImage: "",
            editRewardImageObject: "",
            editRewardPointsGoal: "",
            editRewardIconOptions: ["icon1", "icon2", "icon3", "icon4"],

            storeModeCustomers: [],
            storeModeCustomerRewards: [],
            storeModeSelectedCustomerID: "",
            storeModeSelectedCustomerName: "",
            storeModeCustomerRewardsLoading: false,

        }

        // const { domNavigate } = this.props;
    }

    navigation = this.props.navigation;

    componentDidMount(){
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                this.setState({currentUser: currentUser["email"]}, () => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + currentUser["email"])).then((currentUserDoc) => {
                        firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {   
                            this.setState({currentBusinessID: currentBusinessDoc.id});
                            // CHECK IF BUSINESS HAS; NAME, DESCRIPTION, ADDRESS, LATER ALSO CONFIRM THAT EMAIL IS VERIFIED 
                            let businessSetupCompleted = currentBusinessDoc.data()["businessAddress"] != "" && currentBusinessDoc.data()["businessName"] != "" && currentBusinessDoc.data()["businessOwnerName"] != "" && currentBusinessDoc.data()["businessDescription"] != "";
    
                            if(businessSetupCompleted){
                                this.navigate("rewards");
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

    navigate = (target) => {
        this.setState({loadingDashboard: false});
        if(target == "rewards"){
            this.setState({focusedTab: target});
            this.setState({focusedView: "loading"});
            
            this.setState({currentUser: auth.getAuth().currentUser["email"]}, () => {
                console.log("Current User ID: " + this.state.currentUser);
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + this.state.currentUser)).then((currentUserDoc) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {
                        this.setState({currentBusinessID: currentBusinessDoc.id}, () => {
                            console.log("Current Business ID: " + this.state.currentBusinessID);
                            // SET CURRENT BUSINESS CUSTOMER IDS LIST
                            this.setState({currentBusinessCustomers: currentBusinessDoc.data()["businessCustomers"]});
                            this.setState({currentBusinessSubscriptionPaid: currentBusinessDoc.data()["businessSubscriptionPaid"]})
                            if(currentBusinessDoc.data()["businessSubscriptionPaid"] == false){
                                this.setState({announcementBannerVisible: true});
                            }
                        
                            console.log(currentBusinessDoc.data()["businessSubscriptionPaid"])

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
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            });
        }else if(target == "createReward"){
            this.setState({focusedView: "createReward"});
        }else if(target == "storeMode"){
            this.setState({focusedTab: target});
            this.setState({focusedView: "loading"});

            this.setState({currentUser: auth.getAuth().currentUser["email"]}, () => {
                console.log("Current User ID: " + this.state.currentUser);
                firestore.getDoc(firestore.doc(firestore.getFirestore(), "Users/" + this.state.currentUser)).then((currentUserDoc) => {
                    firestore.getDoc(firestore.doc(firestore.getFirestore(), "Businesses/" + currentUserDoc.data()["businessID"])).then((currentBusinessDoc) => {
                        this.setState({currentBusinessID: currentBusinessDoc.id}, () => {
                            console.log("Current Business ID: " + this.state.currentBusinessID);

                            let storeModeCustomersPushList = [];

                            firestore.getDocs(firestore.collection(firestore.getFirestore(), "Businesses/" + this.state.currentBusinessID + "/CustomerData/")).then((customerData) => {
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
                                                console.log("Store Mode Customers List")
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
                }).catch((error) => {
                    console.log(error);
                });
            });
        
        }else if(target == "discover"){
            this.setState({focusedTab: target});
            this.setState({focusedView: "discover"});
        }else if(target == "accountSettings"){
            this.setState({focusedTab: target});
            this.setState({focusedView: "loading"});
            this.setState({focusedView: "accountSettings"});
        }
    }
    
    makeStringTimestamp = (timestamp) => {
        let timestampFinalString = "";
        let timestampArray = timestamp.toDate().toString().split(" ");

        timestampFinalString = timestampArray[1] + " " + timestampArray[2] + " " + timestampArray[3];

        return timestampFinalString;
    }

    uploadReward = (rewardTitle, rewardDescription, rewardPointsGoal, rewardIcon, rewardImage) => {
        this.setState({createRewardView: "loading"});

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
                        this.setState({createRewardModalOpen: false});
                        this.navigate("rewards");
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
                    this.setState({createRewardModalOpen: false});
                    this.navigate("rewards");
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    selectCustomer = (customerID) => {
        this.setState({storeModeCustomerRewardsLoading: true});
        this.setState({storeModeSelectedCustomerID: customerID});
        this.setState({storeModeCustomerRewards: []});

        let storeModeCustomerRewardsPushList = [];

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
                            storeModeCustomerRewardsPushList.push({
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
                            this.setState({storeModeCustomerRewards: storeModeCustomerRewardsPushList}, () => {
                                console.log("Selected Customer Rewards: ");
                                console.log(this.state.storeModeCustomerRewards);
                            });
                        }, 1000);
                    }).catch((error) => {alert(error)});
                }); 
            }).then(() => {
                this.setState({storeModeCustomerRewardsLoading: false});
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
                    let updatedStoreModeFocusedCustomerRewardsPushList = this.state.storeModeCustomerRewards;
    
                    for(let i = 0; i < updatedStoreModeFocusedCustomerRewardsPushList.length; i++){
                        if(updatedStoreModeFocusedCustomerRewardsPushList[i].rewardID == rewardID){
                            updatedStoreModeFocusedCustomerRewardsPushList[i].rewardPointsEarned =  newPoints;
                            this.setState({storeModeCustomerRewards: updatedStoreModeFocusedCustomerRewardsPushList});
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
                let updatedStoreModeFocusedCustomerRewardsPushList = this.state.storeModeCustomerRewards;

                for(let i = 0; i < updatedStoreModeFocusedCustomerRewardsPushList.length; i++){
                    if(updatedStoreModeFocusedCustomerRewardsPushList[i].rewardID == rewardID){
                        updatedStoreModeFocusedCustomerRewardsPushList[i].rewardPointsEarned = newPoints;
                        this.setState({storeModeCustomerRewards: updatedStoreModeFocusedCustomerRewardsPushList});
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
                <div style={{display: "flex", width: "100%", height: "100vh", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", backgroundColor: "#FFF"}}>
                    <Loading size="lg" color={"error"} />
                </div>                   
            );
        }else{
            return(
                <NextUIProvider>
                    {/* MODALS */}
                    <Modal
                        scroll
                        width="600px"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        open={this.state.createRewardModalOpen}
                        preventClose
                        closeButton
                        onClose={() => {
                            this.setState({createRewardModalOpen: false});
                            this.setState({createRewardView: "form"})
                            this.setState({createRewardTitle: ""})
                            this.setState({createRewardDescription: ""})
                            this.setState({createRewardIcon: "icon1"})
                            this.setState({createRewardImage: ""})
                            this.setState({createRewardImageObject: ""})
                            this.setState({createRewardPointsGoal: ""})
                            this.setState({createRewardIconOptions: ["icon1", "icon2", "icon3", "icon4"]})
                        }}
                    >
                        {(() => {
                            if(this.state.createRewardView == "form"){
                                return(
                                    <>
                                        <Modal.Header>
                                            <Text h3 weight={"bold"}>
                                                Create New Reward
                                            </Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
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
                                                {(() => {
                                                    if(this.state.createRewardImageObject != ""){
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
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Input onChange={(value) => {this.setState({createRewardTitle: value.target.value})}} bordered label="Title" placeholder="Title" />                           
                                                </div>
    
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Textarea onChange={(value) => {this.setState({createRewardDescription: value.target.value})}} bordered label="Description" placeholder="Description" />                             
                                                </div>
    
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Input onChange={(value) => {this.setState({createRewardPointsGoal: value.target.value})}} bordered label="Points Goal" placeholder="Points Goal" />                             
                                                </div>
                                            </div>                        
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <div style={{display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
                                                {this.state.createRewardTitle != "" && this.state.createRewardDescription != "" && this.state.createRewardPointsGoal != "" ?
                                                    <Button style={{backgroundColor: "red"}} auto onClick={() => {
                                                        this.uploadReward(this.state.createRewardTitle, this.state.createRewardDescription, this.state.createRewardPointsGoal, this.state.createRewardIcon, this.state.createRewardImage);
                                                    }}>
                                                        Upload
                                                    </Button>                            
                                                    :
                                                    <Button disabled auto>
                                                        Complete Fields
                                                    </Button>
                                                }
                                            </div>
                                        </Modal.Footer>                                
                                    </>
                                );
                            }else if(this.state.createRewardView == "loading"){
                                return(
                                    <>
                                    <Modal.Body>
                                        <div style={{display: "flex", flexDirection: "column", height: 200, width: "100%", alignContent: "center", alignContent: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}}>
                                            <Loading size="lg" color={"error"}/>
                                        </div>
                                    </Modal.Body>
                                    </>
                                );
                            }
                        })()}  
                    </Modal>
    
                    <Modal
                        scroll
                        width="600px"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        open={this.state.editRewardModalOpen}
                        preventClose
                        closeButton
                        onClose={() => {
                            this.setState({editRewardModalOpen: false});
                            this.setState({editRewardView: "form"})
                            this.setState({editRewardTitle: ""})
                            this.setState({editRewardDescription: ""})
                            this.setState({editRewardIcon: "icon1"})
                            this.setState({editRewardImage: ""})
                            this.setState({editRewardImageObject: ""})
                            this.setState({editRewardPointsGoal: ""})
                            this.setState({editRewardIconOptions: ["icon1", "icon2", "icon3", "icon4"]})
                        }}
                    >
                        {(() => {
                            if(this.state.editRewardView == "form"){
                                return(
                                    <>
                                        <Modal.Header>
                                            <Text h3 weight={"bold"}>
                                                Edit Reward
                                            </Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
                                                <input
                                                    id="editRewardImageUpload"
                                                    style={{display: 'none'}}
                                                    type="file"
                                                    accept="image/*"
                                                    name="myImage"
                                                    onChange={(event) => {
                                                        // this.setState({createRewardImageObject: URL.createObjectURL(event.target.files[0])});
                                                        // this.setState({createRewardImage: event.target.files[0]});
                                                    }}
                                                />                            
                                                {(() => {
                                                    if(this.state.editRewardImage != ""){
                                                        return(
                                                            <div style={{height: 125, width: "100%", borderRadius: 10, marginBottom: 15}}>
                                                                <img style={{height: "100%", width: "100%", borderRadius: 10, objectFit: "cover"}} src={this.state.editRewardImage}/> 
                                                            </div>                                        
                                                        );
                                                    }else{
                                                        if(this.state.editRewardIcon == "icon1"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <EmojiFoodBeverageIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            );
                                                        }else if(this.state.editRewardIcon == "icon2"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <FastfoodIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }else if(this.state.editRewardIcon == "icon3"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <MenuBookIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }else if(this.state.editRewardIcon == "icon4"){
                                                            return(
                                                                <div style={{display: "flex", flexDirection: "column", height: 125, width: "100%", borderRadius: 10, marginBottom: 15, backgroundColor: "#fdd8e5", alignItems: "center", alignContent: "center", justifyContent: "center", justifyItems: "center"}}>
                                                                    <RestaurantIcon style={{color: "red", fontSize: 70}}/>
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                })()}        
                                                {this.state.editRewardImage != "" ?
                                                    <div style={{display: "flex", flexDirection: "row", width: "100%", marginBottom: 15}}>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingRight: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                // this.setState({createRewardImage: ""});
                                                                // this.setState({createRewardImageObject: ""});
                                                            }}>
                                                                Remove Image
                                                            </Button>
                                                        </div>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingLeft: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                document.getElementById("editRewardImageUpload").click();
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
                                                                let randomIcon = this.state.editRewardIconOptions[randomIconIndex];
    
                                                                this.setState({editRewardIcon: randomIcon}); 
                                                            }}>
                                                                Random Icon
                                                            </Button>
                                                        </div>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", paddingLeft: 5}}>
                                                            <Button flat color={"error"} onPress={() => {
                                                                document.getElementById("editRewardImageUpload").click();
                                                            }}>
                                                                Upload Custom Image
                                                            </Button>
                                                        </div>
                                                    </div>                                
                                                }                    
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Input value={this.state.editRewardTitle} onChange={(value) => {this.setState({editRewardTitle: value.target.value})}} bordered label="Title" placeholder="Title" />                           
                                                </div>
    
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Textarea value={this.state.editRewardDescription} onChange={(value) => {this.setState({editRewardDescription: value.target.value})}} bordered label="Description" placeholder="Description" />                             
                                                </div>
    
                                                <div style={{display: "flex", flexDirection: "column", width: "100%", marginBottom: 15}}>
                                                    <Input value={this.state.editRewardPointsGoal} onChange={(value) => {this.setState({editRewardPointsGoal: value.target.value})}} bordered label="Points Goal" placeholder="Points Goal" />                             
                                                </div>
                                            </div>                        
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <div style={{display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
                                                {this.state.editRewardTitle != "" && this.state.editRewardDescription != "" && this.state.editRewardPointsGoal != "" ?
                                                    <Button style={{backgroundColor: "red"}} auto onClick={() => {
                                                        this.editReward(this.state.editRewardID, this.state.editRewardTitle, this.state.editRewardDescription, this.state.editRewardPointsGoal, this.state.editRewardIcon, this.state.editRewardImage);
                                                    }}>
                                                        Upload
                                                    </Button>                            
                                                    :
                                                    <Button disabled auto>
                                                        Complete Fields
                                                    </Button>
                                                }
                                            </div>
                                        </Modal.Footer>                                
                                    </>
                                );
                            }else if(this.state.editRewardView == "loading"){
                                return(
                                    <>
                                    <Modal.Body>
                                        <div style={{display: "flex", flexDirection: "column", height: 200, width: "100%", alignContent: "center", alignContent: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}}>
                                            <Loading size="lg" color={"error"}/>
                                        </div>
                                    </Modal.Body>
                                    </>
                                );
                            }
                        })()}  
                    </Modal>
    
                    {/* LIGHT BACKDROP */}
                    {this.state.currentBusinessSubscriptionPaid == false ?
                        <div>
                            {this.state.announcementBannerVisible == true ?
                                <div className="bg-red-600">
                                    <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                                        <div className="flex items-center justify-between flex-wrap">
                                            <div className="w-0 flex-1 flex items-center">
                                                <span className="flex p-2 rounded-lg bg-red-800">
                                                    <CampaignIcon style={{color: "#FFF"}}/>
                                                </span>
                                                <p className="ml-3 font-medium text-white truncate">
                                                <span className="md:hidden">We announced a new product!</span>
                                                <span className="hidden md:inline">Select your business payment plan to go live!</span>
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
                                :
                                null                                
                            }                                
                        </div>                                
                        :
                        null              
                    }        
                                
                    <div style={{display: "flex", flexDirection: "column", width: "100%", backgroundColor: "#FFF", height: "100vh"}}>
                        <div style={{display: "flex", backgroundColor: "#F5F6F8", height: "100vh"}}>
                            {/* NAV BAR */}
                            <div style={{display: "flex", position: "absolute", top: 0, left: 0, height: "100%", width: 100, backgroundColor: "#FFF", flexDirection: "column"}}>
                                {/* REWARDS NAV BUTTON */}
                                {(() => {
                                    if(this.state.focusedTab == "rewards"){
                                        return(
                                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                                <LocalActivityIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }else{
                                        return(
                                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {this.navigate("rewards")}}>
                                                <LocalActivityIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }
                                })()}     
        
                                {/* STORE MODE NAV BUTTON */}
                                {(() => {
                                    if(this.state.focusedTab == "storeMode"){
                                        return(
                                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                                <StorefrontIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }else{
                                        return(
                                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {this.navigate("storeMode")}}>
                                                <StorefrontIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }
                                })()}  
        
                                {/* DISCOVER NAV BUTTON */}
                                {(() => {
                                    if(this.state.focusedTab == "discover"){
                                        return(
                                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                                <MapIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }else{
                                        return(
                                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error" onClick={() => {this.navigate("discover")}}>
                                                <MapIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }
                                })()}    
        
                                {/* ACCOUNT SETTINGS NAV BUTTON */}
                                {(() => {
                                    if(this.state.focusedTab == "accountSettings"){
                                        return(
                                            <Button flat auto style={{borderRadius: 0, height: 75}} color="error">
                                                <SettingsIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }else{
                                        return(
                                            <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {this.navigate("accountSettings")}}>
                                                <SettingsIcon style={{color: "red", fontSize: 30}}/>
                                            </Button>
                                        );
                                    }
                                })()}
                                <Button auto style={{borderRadius: 0, height: 75, backgroundColor: "#FFF"}} color="error"  onClick={() => {
                                    auth.getAuth().signOut().catch((error) => {console.log(error)});
                                }}>
                                    <LogoutIcon style={{color: "red", fontSize: 30}}/>
                                </Button>                        
                            </div> 
        
                            {/* FOCUSED DASHBOARD VIEW */}
                            <div style={{display: "flex", height: "100%", width: "100%", paddingLeft: 100}}>
                                <div style={{display: "flex", width: "100%", height: "100%", padding: 15}}>
                                    {/* CONDITIONAL CONTENT RENDER */}
                                    {(() => {
                                        if(this.state.focusedView == "loading"){
                                            return(
                                                <Card style={{display: "flex", height: "95%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}} variant="flat">
                                                    <Loading color={"error"}/>
                                                </Card>
                                            );
                                        }else if(this.state.focusedView == "rewards"){
                                            return(
                                                <Card style={{display: "flex", height: "90%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}} variant="flat">
                                                    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#FFF", overflowY: "scroll", overflowX: "hidden"}}>
                                                        {/* REWARDS HEADER */}
                                                        <div style={{display: "flex", flexDirection: "row", width: "100%", height: "auto", backgroundColor: "#FFF", paddingRight: 15, paddingLeft: 15}}>
                                                            <div style={{display: "flex", flexDirection: "row", width: "50%", backgroundColor: "#FFF"}}>
                                                                <Text h1 weight={"black"}>Manage Rewards({this.state.currentBusinessRewards.length})</Text>
                                                            </div>
                                                            <div style={{display: "flex", flexDirection: "row", width: "50%", backgroundColor: "#FFF", alignItems: "center", justifyContent: "flex-end"}}>
                                                                <Button style={{backgroundColor: "red", marginRight: 15}} onPress={() => {
                                                                    this.setState({createRewardModalOpen: true});
                                                                }}>
                                                                    + Create Reward
                                                                </Button>
                                                                <Dropdown>
                                                                    <Dropdown.Trigger >
                                                                        <Button
                                                                            auto
                                                                            flat
                                                                            color={"error"}
                                                                            icon={
                                                                                <FilterListIcon/>
                                                                            }
                                                                        />  
                                                                    </Dropdown.Trigger>                                                               
                                                                    <Dropdown.Menu aria-label="Static Actions">
                                                                        <Dropdown.Item key="edit">Title</Dropdown.Item>
                                                                        <Dropdown.Item key="new">Upload Date</Dropdown.Item>
                                                                        <Dropdown.Item key="edit">Archived</Dropdown.Item>
                                                                        <Dropdown.Item key="copy">Customers Completed</Dropdown.Item>
                                                                        <Dropdown.Item key="edit">Customers Started</Dropdown.Item>                                                                
                                                                    </Dropdown.Menu>
                                                                </Dropdown>                                                                                                               
                                                            </div>
                                                        </div>
        
                                                        {/* REWARDS MAP GRID */}
                                                        <div style={{display: "flex", backgroundColor: "#FFF"}}>
                                                            <Grid.Container gap={2} justify="flex-start">
                                                                {this.state.currentBusinessRewards.sort((a, b) => b.rewardCreationTimestamp - a.rewardCreationTimestamp).map((reward) => (
                                                                    <Grid xs={4}>
                                                                        <Card style={{backgroundColor: "#FFF"}} variant="bordered">
                                                                            <Card.Body>
                                                                                {reward.rewardImage != "" ? 
                                                                                    <div style={{height: 125, width: "100%", borderRadius: 10, position: "relative"}}>
                                                                                        <img style={{height: "100%", width: "100%", borderRadius: 10, objectFit: "cover"}} src={reward.rewardImage}/> 
                                                                                        <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.25, borderRadius: 10, position: "absolute", top: 0, left: 0}}/>
                                                                                        <div style={{display: "flex", position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: "transparent", zIndex: 15, justifyContent: "flex-end", padding: 10}}>
                                                                                            <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0, marginRight: 15}} onClick={() => {
                                                                                                alert("ting")
                                                                                            }}>
                                                                                                <SearchIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                            </button>
                                                                                            <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0,}} onClick={() => {
                                                                                                this.setState({editRewardID: reward.rewardID});
                                                                                                this.setState({editRewardView: "form"});
                                                                                                this.setState({editRewardTitle: reward.rewardTitle});
                                                                                                this.setState({editRewardDescription: reward.rewardDescription});
                                                                                                this.setState({editRewardIcon: reward.rewardIcon});
                                                                                                this.setState({editRewardImage: reward.rewardImage});
                                                                                                this.setState({editRewardPointsGoal: reward.rewardPointsGoal});
                                                                                                this.setState({editRewardModalOpen: true});
                                                                                            }}>
                                                                                                <EditIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
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
                                                                                            <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0, marginRight: 15}} onClick={() => {
        
                                                                                            }}>
                                                                                                <SearchIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                            </button>
                                                                                            <button style={{display: "flex", backgroundColor: "transparent", border: "none", padding: 0,}} onClick={() => {
                                                                                                this.setState({editRewardID: reward.rewardID});
                                                                                                this.setState({editRewardView: "form"});
                                                                                                this.setState({editRewardTitle: reward.rewardTitle});
                                                                                                this.setState({editRewardDescription: reward.rewardDescription});
                                                                                                this.setState({editRewardIcon: reward.rewardIcon});
                                                                                                this.setState({editRewardImage: reward.rewardImage});
                                                                                                this.setState({editRewardPointsGoal: reward.rewardPointsGoal});
                                                                                                this.setState({editRewardModalOpen: true});
                                                                                            }}>
                                                                                                <EditIcon style={{fontSize: 25, color: "#FFF", fontWeight: "bolder"}} filled />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>                                                                                                                                                    
                                                                                }
                                                                                
                                                                                <Text h2 weight={"extrabold"}>{reward.rewardTitle}</Text>
                                                                                <div style={{display: "flex", flexDirection: "column", backgroundColor: "#FFF"}}>
                                                                                    {/* NUM HAVE COMPLETED */}
                                                                                    <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                        <CheckIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                        <Text p weight={"medium"} style={{color: "#AAA"}}>{reward.rewardCustomersCompleted.length} customers completed this reward</Text>
                                                                                    </div>
                                                                                    {/* NUM HAVE STARTED EARNING */}
                                                                                    <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                        <StartIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                        <Text p weight={"medium"} style={{color: "#AAA"}}>{reward.rewardCustomersStarted.length} customers started this reward</Text>
                                                                                    </div>                                                                            
                                                                                    {/* START AND END DATES */}  
                                                                                    <div style={{display: "flex", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 5}}>
                                                                                        <CalendarMonthIcon style={{color: "#AAA", fontSize: 25, marginRight: 5}}/>
                                                                                        <Text p weight={"medium"} style={{color: "#AAA"}}>Start Date {reward.rewardCreationTimestampString}</Text>
                                                                                    </div>                                                                                                                                                        
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Card>                                
                                                                    </Grid>
                                                                ))}
                                                            </Grid.Container>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        }else if(this.state.focusedView == "storeMode"){
                                            return(
                                                <Card style={{display: "flex", height: "90%", width: "100%", backgroundColor: "transparent", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}} variant="flat">
                                                    <div style={{display: "flex", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "transparent"}}>
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", backgroundColor: "transparent", overflowY: "scroll", paddingLeft: 15}}>
                                                            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "auto", backgroundColor: "transparent"}}>
                                                                {this.state.storeModeSelectedCustomerID != "" ?
                                                                    <Text h1 weight={"black"}>{this.state.storeModeSelectedCustomerName.split(" ")[0]}'s Rewards ({this.state.storeModeCustomerRewards.length})</Text>
                                                                    :
                                                                    <Text h1 weight={"black"}>Your Customers ({this.state.storeModeCustomers.length})</Text>
                                                                }
                                                                
                                                            </div>
                                                            {/* CUSTOMER MAP HERE */}
                                                            {this.state.storeModeCustomers.map((customer) => (
                                                                <Card key={customer.customerID} variant="flat" style={{marginBottom: 15, backgroundColor: "#FFF"}} isPressable onPress={() => {this.selectCustomer(customer.customerID)}}>
                                                                    <Card.Body>
                                                                        <div style={{display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
                                                                            {/* SYNC STATUS */}
                                                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                                                <div style={{height: 15, width: 15, backgroundColor: "orange", borderRadius: 15/2, marginRight: 5}}/>
                                                                                <Text p style={{color: "#000"}}>Last Business Sync: {customer.customerLastBusinessSyncTimestampString}</Text>
                                                                            </div>
        
                                                                            {/* AVATAR, NAME, PHONE NUMBER */}
                                                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                                                                {customer.customerProfilePicture != "" ?
                                                                                    <Avatar
                                                                                        size="xl"
                                                                                        src={customer.customerProfilePicture}
                                                                                        color="error"
                                                                                        bordered
                                                                                        squared
                                                                                        style={{marginRight: 10}}
                                                                                    />                                                                        
                                                                                    :
                                                                                    <Avatar
                                                                                        size="xl"
                                                                                        bordered
                                                                                        squared
                                                                                        style={{marginRight: 10}}
                                                                                        text={customer.customerName.split(" ")[0][0] + customer.customerName.split(" ")[1][0]}
                                                                                    />                                                               
                                                                                }
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
        
                                                        
                                                        <div style={{display: "flex", flexDirection: "column", width: "50%", height: "100%", overflowY: "scroll", paddingLeft: 15}}>
                                                            {(() => {
                                                                if(this.state.storeModeCustomerRewardsLoading == true){
                                                                    return(
                                                                        <Card style={{display: "flex", height: "100%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}} variant="flat">
                                                                            <Loading color={"error"}/>
                                                                        </Card>                                                                     
                                                                    );
                                                                }else{
                                                                    if(this.state.storeModeSelectedCustomerID != ""){
                                                                        return(
                                                                            <Card style={{display: "flex", height: "100%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyItems: "center", textAlign: "center", paddingLeft: 15, paddingRight: 15, paddingTop: 15, overflowY: 'scroll'}} variant="flat">
                                                                                {/* SELECTED CUSTOMER REWARDS MAP */}
                                                                                {this.state.storeModeCustomerRewards.sort((a, b) => ((b.rewardPointsEarned/b.rewardPointsGoal) * 100) - ((a.rewardPointsEarned/a.rewardPointsGoal) * 100)).map((reward) => (
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
        
                                                                                                <Text h2 weight={"extrabold"}>{reward.rewardTitle}</Text>
                                                                                                <div>
                                                                                                    <Card style={{display: "flex", marginTop: 5, marginBottom: 30}} variant="flat">
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
                                                                            </Card>
                                                                        );
                                                                    }else{
                                                                        return(
                                                                            <Card style={{display: "flex", height: "100%", width: "100%", backgroundColor: "#FFF", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center", textAlign: "center"}} variant="flat">
                                                                                <Button style={{marginBottom: 15, height: 90, width: 90}} flat auto color="error" icon={<StarIcon style={{fontSize: 70}} fill="currentColor" filled />}/> 
                                                                                <Text h2 weight={"extrabold"} style={{marginBottom: 15}}>Select a customer to add rewards!</Text>
                                                                            </Card>                                                                     
                                                                        );
                                                                    }
                                                                }                                                                              
                                                            })()} 
                                                            
                                                        </div>                                                
                                                    </div>
                                                </Card>
                                            );
                                        }else if(this.state.focusedView == "discover"){
                                            return(
                                                <div>
                                                    <p>discover screen</p>
                                                </div>
                                            );
                                        }else if(this.state.focusedView == "accountSettings"){
                                            return(
                                                <div>
                                                    <p>working on it...</p>
                                                </div>
                                            );
                                        }else if(this.state.focusedView == "error"){
                                            return(
                                                <div>
                                                    <p>working on it...</p>
                                                </div>
                                            );
                                        }
                                    })()} 
                                </div>                    
                            </div>
        
                        </div>

                    </div>
                </NextUIProvider>
            );
        }
    }
}

export default function (props){
    const navigation = useNavigate();

    return <BusinessDashboard {...props} navigation={navigation}/>
}