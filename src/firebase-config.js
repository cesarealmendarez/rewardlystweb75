import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBYOGWXGq3KmO0uYbZDTCPPu1o65OecQis",
    authDomain: "rewardlyst75.firebaseapp.com",
    databaseURL: "https://rewardlyst75-default-rtdb.firebaseio.com",
    projectId: "rewardlyst75",
    storageBucket: "rewardlyst75.appspot.com",
    messagingSenderId: "422884186015",
    appId: "1:422884186015:web:3b09c094becd617e740faa",
    measurementId: "G-HWPJDPQLDY"
};

export const app = initializeApp(firebaseConfig);