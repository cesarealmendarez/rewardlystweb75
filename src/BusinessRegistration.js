import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

import * as auth from "firebase/auth";
import * as firestore from "firebase/firestore";

import { FaApplePay } from "react-icons/fa";

import { Loading } from "@nextui-org/react";

function BusinessRegistration(){
    let navigate = useNavigate();

    const [businessRegistrationEmail, setBusinessRegistrationEmail] = useState("");
    const [businessRegistrationPassword, setBusinessRegistrationPassword] = useState("");
    const [businessRegistrationName, setBusinessRegistrationName] = useState("");
    const [view, setView] = useState("form");

    useEffect(() => {
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                navigate('/dashboard');
            }
        });
    }, [])

    const handleBusinessRegistration = (businessRegistrationEmail, businessRegistrationPassword, businessRegistrationName) => {
        setView("loading");

        auth.createUserWithEmailAndPassword(auth.getAuth(), businessRegistrationEmail, businessRegistrationPassword).then(() => {   
            firestore.addDoc(firestore.collection(firestore.getFirestore(), "Businesses"), {
                businessName: businessRegistrationName,
                businessRewards: [],
                businessAddress: "",
                businessAddressLatitude: "",
                businessAddressLongitude: "",
                businessCustomers: [],
                businessBannerPicture: "",
                businessDescription: "",
                businessOwnerName: "",
                businessSubscriptionPaid: false,
            }).then((docRef) => {
                firestore.setDoc(firestore.doc(firestore.getFirestore(), 'Users', businessRegistrationEmail), {
                    accountType: 'business',
                    businessID: docRef.id
                }).then(() => {
                    navigate('/onboarding');
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }


    if(view == "loading"){
        return(
            <div style={{display: "flex", flexDirection: "column", height: "100vh", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center", justifyItems: "center"}}>
                <Loading color={"error"}/>
            </div>
        );
    }else{
        return(    
            <div class="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                <div class="max-w-lg mx-auto">
                    <FaApplePay size={60} class="text-red-600 w-full justify-self-center"/>
                    <h1 class="text-2xl font-black text-center sm:text-3xl">Get started in minutes!</h1>                    
                    
                    <form class="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl">
                        <div>
                            <label class="text-sm font-medium">Business Name</label>
                            <div class="relative mt-1">
                                <input
                                    value={businessRegistrationName}
                                    onChange={(value) => {setBusinessRegistrationName(value.target.value);}}
                                    type="email"
                                    id="email"
                                    class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter Business Name"
                                />

                                <span class="absolute inset-y-0 inline-flex items-center right-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>                    
                        <div>
                            <label for="email" class="text-sm font-medium">Email</label>
                            <div class="relative mt-1">
                                <input
                                    value={businessRegistrationEmail}
                                    onChange={(value) => {setBusinessRegistrationEmail(value.target.value);}}
                                    type="email"
                                    id="email"
                                    class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter email"
                                />

                                <span class="absolute inset-y-0 inline-flex items-center right-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label for="password" class="text-sm font-medium">Password</label>
                            <div class="relative mt-1">
                                <input
                                    value={businessRegistrationPassword}
                                    onChange={(value) => {setBusinessRegistrationPassword(value.target.value);}}
                                    type="password"
                                    id="password"
                                    class="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter password"
                                />

                                <span class="absolute inset-y-0 inline-flex items-center right-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        
                        <button onClick={() => {handleBusinessRegistration(businessRegistrationEmail, businessRegistrationPassword, businessRegistrationName)}} type="submit" class="block w-full px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg">
                            Sign up
                        </button>
                        <p class="text-sm text-center text-gray-500">
                            Forgot Password? <a class="underline ml-1" href="">Enter email, then click here</a>
                        </p>      
                    </form>  
                </div>
            </div>            
        );
    }
}

export default BusinessRegistration;

// import React, { useEffect, useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

// import * as auth from "firebase/auth";
// import * as firestore from "firebase/firestore";

// import { FaApplePay } from "react-icons/fa";

// function BusinessRegistration(){
//     let navigate = useNavigate();

//     const [businessOwnerFirstName, setBusinessOwnerFirstName] = useState("");
//     const [businessOwnerLastName, setBusinessOwnerLastName] = useState("");
//     const [businessEmail, setBusinessEmail] = useState("");
//     const [businessPassword, setBusinessPassword] = useState("");

//     useEffect(() => {
//         auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
//             if(currentUser){
//                 navigate('/dashboard');
//             }
//         });
//     }, [])

//     const handleBusinessRegistration = (businessOwnerFirstName, businessOwnerLastName, businessEmail, businessPassword) => {
//         auth.createUserWithEmailAndPassword(auth.getAuth(), businessEmail, businessPassword).then(() => {
//             firestore.addDoc(firestore.collection(firestore.getFirestore(), "Businesses"), {
//                 businessName: "",
//                 businessRewards: [],
//                 businessAddress: "",
//                 businessAddressLatitude: "",
//                 businessAddressLongitude: "",
//                 businessCustomers: [],
//                 businessBannerPicture: "",
//                 businessDescription: "",
//                 businessSetupStatus: "businessInfo",
//                 businessOwnerFirstName: businessOwnerFirstName,
//                 businessOwnerLastName: businessOwnerLastName
//             }).then((docRef) => {
//                 firestore.setDoc(firestore.doc(firestore.getFirestore(), 'Users', businessEmail), {
//                     accountType: 'business',
//                     businessID: docRef.id
//                 }).then(() => {
//                     navigate('/dashboard');
//                 }).catch((error) => {
//                     console.log(error);
//                 });
//             }).catch((error) => {
//                 console.log(error);
//             });
//         }).catch((error) => {
//             console.log(error);
//         });
//     }

//     return(
//         <div className="w-full bg-white p-10">
//             {/* STEPPER BAR */}
//             <FaApplePay size={65} class="text-red-600 mb-5"/>    
//             <div className="md:flex items-center border-b pb-6 border-gray-200">
//                 <div className="flex items-center md:mt-0 mt-4">
//                     <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center">
//                         <p className="text-base font-medium leading-none text-white">01</p>
//                     </div>
//                     <p className="text-base ml-3 font-medium leading-4 text-gray-800">Business Account Creation</p>
//                 </div>
//                 <div className="flex items-center md:mt-0 mt-4 md:ml-12">
//                     <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
//                         <p className="text-base font-medium leading-none text-gray-800">02</p>
//                     </div>
//                     <p className="text-base ml-3 font-medium leading-4 text-gray-800">Business Info</p>
//                 </div>
//                 <div className="flex items-center md:mt-0 mt-4 md:ml-12">
//                     <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
//                         <p className="text-base font-medium leading-none text-gray-800">03</p>
//                     </div>
//                     <p className="text-base ml-3 font-medium leading-4 text-gray-800">Confirmation Overview</p>
//                 </div>              
//             </div>

//             <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
//                 Business Owner Details
//             </h2>
//             <p className="text-sm font-light leading-none text-gray-600 mt-0.5">These are private details that will be used to manage your RewardLyst account</p>
//             <div className="mt-8 md:flex items-center">
//                 <div className="flex flex-col">
//                     <label className="mb-3 text-sm leading-none text-gray-800">First name</label>
//                     <input value={businessOwnerFirstName} onChange={(value) => {setBusinessOwnerFirstName(value.target.value)}} type="name" tabIndex={0} aria-label="Enter first name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="William" />
//                 </div>
//                 <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
//                     <label className="mb-3 text-sm leading-none text-gray-800">Last name</label>
//                     <input value={businessOwnerLastName} onChange={(value) => {setBusinessOwnerLastName(value.target.value)}} type="name" tabIndex={0} aria-label="Enter last name" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="Smith" />
//                 </div>
//             </div>
//             <div className="mt-12 md:flex items-center">
//                 <div className="flex flex-col">
//                     <label className="mb-3 text-sm leading-none text-gray-800">Accessible Email Address</label>
//                     <input value={businessEmail} onChange={(value) => {setBusinessEmail(value.target.value)}} type="email" tabIndex={0} aria-label="Enter email Address" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="smith.william@gmail.com" />
//                 </div>
//                 <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
//                     <label className="mb-3 text-sm leading-none text-gray-800">Account Password</label>
//                     <input value={businessPassword} onChange={(value) => {setBusinessPassword(value.target.value)}}  tabIndex={0} aria-label="Enter phone number" className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200" defaultValue="+81 839274" />
//                 </div>
//             </div>
//             {businessOwnerFirstName.trim().length > 0 && businessOwnerLastName.trim().length > 0 && businessEmail.trim().length > 0 && businessPassword.trim().length >= 6 ? 
//                 <button onClick={() => {handleBusinessRegistration(businessOwnerFirstName, businessOwnerLastName, businessEmail, businessPassword);}} role="button" aria-label="Next step" className="flex items-center justify-center py-4 px-7 focus:outline-none bg-white border rounded border-gray-400 mt-7 md:mt-14 hover:bg-gray-100  focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">
//                     <span className="text-sm font-medium text-center text-gray-800 capitalize">Next Step</span>
//                     <svg className="mt-1 ml-3" width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M8.01 3H0V5H8.01V8L12 4L8.01 0V3Z" fill="#242731" />
//                     </svg>
//                 </button>            
//             :
//                 <button disabled role="button" aria-label="Next step" className="flex items-center justify-center py-4 px-7 focus:outline-none bg-white border rounded border-gray-400 mt-7 md:mt-14 hover:bg-gray-100  focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">
//                     <span className="text-sm font-medium text-center text-gray-800 capitalize">Next Step</span>
//                     <svg className="mt-1 ml-3" width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M8.01 3H0V5H8.01V8L12 4L8.01 0V3Z" fill="#242731" />
//                     </svg>
//                 </button>            
//             }
//         </div>
//     );
// }

// export default BusinessRegistration;