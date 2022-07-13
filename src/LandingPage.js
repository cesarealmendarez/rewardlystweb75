import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

import * as auth from "firebase/auth";

import { FaApplePay } from "react-icons/fa";

import LandingPageHero from "./assets/LandingPageHero.jpg";

function LandingPage(){
    let navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(auth.getAuth(), (currentUser) => {
            if(currentUser){
                navigate('/dashboard');
            }
        });
    }, [])

    return(
        <>
            {/* HERO */}
            <div class="relative bg-white overflow-hidden mb-40">
                <div class="max-w-7xl mx-auto">
                    <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <div>
                            <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
                                <nav class="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                                    <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                                        <div class="flex items-center justify-between w-full md:w-auto">
                                            <a href="#">
                                                <span class="sr-only">Workflow</span>
                                                <FaApplePay size={60} class="text-red-600"/>
                                                {/* <img alt="Workflow" class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"/> */}
                                            </a>
                                            <div class="-mr-2 flex items-center md:hidden">
                                                <button type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
                                                    <span class="sr-only">Open main menu</span>
                                                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                                        <a href="#features" class="font-medium text-gray-500 hover:text-gray-900">Features</a>
                                        <a href="#" class="font-medium text-gray-500 hover:text-gray-900">How it works</a>
                                        <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Pricing</a>
                                        <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Customer app</a>
                                        <a href="#" class="font-medium text-red-600 hover:text-red-500">Log in</a>
                                    </div>
                                </nav>
                            </div>

                            {/* <div class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                                <div class="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                                    <div class="px-5 pt-4 flex items-center justify-between">
                                        <div>
                                            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt=""/>
                                        </div>
                                        <div class="-mr-2">
                                            <button type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                            <span class="sr-only">Close main menu</span>
                                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="px-2 pt-2 pb-3 space-y-1">
                                        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Product</a>
                                        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Features</a>
                                        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Marketplace</a>
                                        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Company</a>
                                    </div>
                                    <a href="#" class="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"> Log in </a>
                                </div>
                            </div> */}
                        </div>

                        <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div class="sm:text-center lg:text-left">
                                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span class="block xl:inline">Create and upload your business rewards in record time!</span>
                                </h1>
                                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
                                <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div class="rounded-md shadow">
                                        <a href="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-600 md:py-4 md:text-lg md:px-10"> Get started </a>
                                    </div>
                                    <div class="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 md:py-4 md:text-lg md:px-10"> Log In </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={LandingPageHero} alt=""/>
                </div>          
            </div>
            
            {/* FEATURES */}
            <div class="">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-40">
                    <div class="lg:text-center" id="features">
                        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Features</p>
                        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.</p>
                    </div>

                    <div class="mt-10">
                        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Competitive exchange rates</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</dd>
                            </div>

                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-gray-900">No hidden fees</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</dd>
                            </div>

                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Transfers are instant</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</dd>
                            </div>

                            <div class="relative">
                                <dt>
                                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <p class="ml-16 text-lg leading-6 font-medium text-gray-900">Mobile notifications</p>
                                </dt>
                                <dd class="mt-2 ml-16 text-base text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>  

            {/* HOW IT WORKS */}

            {/* PRICING */}
            <div class="bg-white mb-15 pb-15">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-15 pb-32">
                    <div class="lg:text-center">
                        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Pricing</p>
                        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-2 lg:grid-cols-2">                        
                        <div class="w-full p-8 space-y-8 bg-white-600 rounded-lg border-2 border-gray-200">
                            <p class="font-medium text-gray-700 uppercase">Starter</p>

                            <h2 class="text-5xl font-bold text-gray-700 uppercase">
                                $25
                            </h2>

                            <p class="font-medium text-gray-700">Per month</p>

                            <ul>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-700">
                                        $10/month per user
                                    </p>
                                </li>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-700">
                                        Unlimited number of projects
                                    </p>
                                </li>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-green-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-700">
                                        Cancel anytime
                                    </p>
                                </li>
                            </ul>                            
                        </div>

                        <div class="w-full p-8 space-y-8 bg-red-600 rounded-lg">
                            <p class="font-medium text-gray-200 uppercase">Premium</p>

                            <h2 class="text-5xl font-bold text-white uppercase">
                                $50
                            </h2>

                            <p class="font-medium text-gray-200">Per month</p>

                            <ul>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-200">
                                        Complimentary iPad to manage rewards in-store
                                    </p>
                                </li>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-200">
                                        Unlimited number of projects
                                    </p>
                                </li>
                                <li class="mt-4 flex items-start">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="ml-3 text-base leading-6 text-gray-200">
                                        Cancel anytime
                                    </p>
                                </li>
                            </ul>                            
                        </div>
                    </div>
                </div>
            </div>
          
                    
            {/* PRICING */}
            {/* <section class="pt-28 pb-32 bg-gray-50 overflow-hidden">
                <div class="container mx-auto px-4">
                    <div class="max-w-xl">
                    <span class="inline-block mb-3 text-gray-600 text-base">Flexible Pricing Plan</span>
                    <h2 class="mb-16 font-heading font-bold text-6xl sm:text-7xl text-gray-900">Everything you need to launch a website</h2>
                    </div>
                    <div class="flex flex-wrap">
                    <div class="w-full md:w-1/3">
                        <div class="pt-8 px-11 xl:px-20 pb-10 bg-transparent border-b md:border-b-0 md:border-r border-gray-200 rounded-10">
                        <h3 class="mb-0.5 font-heading font-semibold text-lg text-gray-900">Basic</h3>
                        <p class="mb-5 text-gray-600 text-sm">Best for freelancers</p>
                        <div class="mb-9 flex">
                            <span class="mr-1 mt-0.5 font-heading font-semibold text-lg text-gray-900">$</span>
                            <span class="font-heading font-semibold text-6xl sm:text-7xl text-gray-900">29</span>
                            <span class="font-heading font-semibold self-end">/ m</span>
                        </div>
                        <div class="p-1">
                            <button class="group relative mb-9 p-px w-full font-heading font-semibold text-xs text-gray-900 bg-gradient-green uppercase tracking-px overflow-hidden rounded-md">
                            <div class="absolute top-0 left-0 transform -translate-y-full group-hover:-translate-y-0 h-full w-full bg-gradient-green transition ease-in-out duration-500"></div>
                            <div class="p-4 bg-gray-50 overflow-hidden rounded-md">
                                <p class="relative z-10">Join now</p>
                            </div>
                            </button>
                        </div>
                        <ul>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>100GB Cloud Storage</p>
                            </li>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>10 Email Connection</p>
                            </li>
                            <li class="flex items-center font-heading font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Daily Analytics</p>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3">
                        <div class="pt-8 px-11 xl:px-20 pb-10 bg-transparent rounded-10">
                        <h3 class="mb-0.5 font-heading font-semibold text-lg text-gray-900">Premium</h3>
                        <p class="mb-5 text-gray-600 text-sm">Best for small agency</p>
                        <div class="mb-9 flex">
                            <span class="mr-1 mt-0.5 font-heading font-semibold text-lg text-gray-900">$</span>
                            <span class="font-heading font-semibold text-6xl sm:text-7xl text-gray-900">99</span>
                            <span class="font-heading font-semibold self-end">/ m</span>
                        </div>
                        <div class="p-1">
                            <button class="group relative mb-9 p-px w-full font-heading font-semibold text-xs text-gray-900 bg-gradient-green uppercase tracking-px overflow-hidden rounded-md">
                            <div class="absolute top-0 left-0 transform -translate-y-full group-hover:-translate-y-0 h-full w-full bg-gradient-green transition ease-in-out duration-500"></div>
                            <div class="p-4 bg-gray-50 overflow-hidden rounded-md">
                                <p class="relative z-10">Join now</p>
                            </div>
                            </button>
                        </div>
                        <ul>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>500GB Cloud Storage</p>
                            </li>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>50 Email Connection</p>
                            </li>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Daily Analytics</p>
                            </li>
                            <li class="flex items-center font-heading font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Premium Support</p>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3">
                        <div class="relative pt-8 px-11 pb-10 bg-white rounded-10 shadow-8xl">
                        <p class="absolute right-2 top-2 font-heading px-2.5 py-1 text-xs max-w-max bg-gray-100 uppercase tracking-px rounded-full text-gray-900">Popular choice</p>
                        <h3 class="mb-0.5 font-heading font-semibold text-lg text-gray-900">Enterprise</h3>
                        <p class="mb-5 text-gray-600 text-sm">Best for large agency</p>
                        <div class="mb-9 flex">
                            <span class="mr-1 mt-0.5 font-heading font-semibold text-lg text-gray-900">$</span>
                            <span class="font-heading font-semibold text-6xl sm:text-7xl text-gray-900">199</span>
                            <span class="font-heading font-semibold self-end">/ m</span>
                        </div>
                        <div class="group relative mb-9">
                            <div class="absolute top-0 left-0 w-full h-full bg-gradient-green opacity-0 group-hover:opacity-50 p-1 rounded-lg transition ease-out duration-300"></div>
                            <button class="p-1 w-full font-heading font-semibold text-xs text-gray-900 uppercase tracking-px overflow-hidden rounded-md">
                            <div class="relative z-10 p-4 bg-gradient-green overflow-hidden rounded-md">
                                <p>Join now</p>
                            </div>
                            </button>
                        </div>
                        <ul>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>2TB Cloud Storage</p>
                            </li>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Unlimited Email Connection</p>
                            </li>
                            <li class="flex items-center font-heading mb-3 font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Daily Analytics</p>
                            </li>
                            <li class="flex items-center font-heading font-medium text-base text-gray-900">
                            <svg class="mr-2.5" width="22" height="22" viewbox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.58301 11.9167L8.24967 15.5834L17.4163 6.41669" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Premium Support</p>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
            </section>             */}
            {/* FOOTER */}
            {/* <footer class="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-800">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" class="flex items-center mb-4 sm:mb-0">
                        <img src="/docs/images/logo.svg" class="mr-3 h-8" alt="Flowbite Logo"/>
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <ul class="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6 ">Licensing</a>
                        </li>
                        <li>
                            <a href="#" class="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
                <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
                </span>
            </footer> */}


        </>
        
    );
}

export default LandingPage;