import React from 'react';
import './ThreeSCall.css';
import UserInput from './UserInput';
import { useState } from 'react';

const ThreeSCall = ({ responseBody = "", responseHeaders = "" }) => {
    console.log(typeof responseBody);
    if (typeof responseBody === 'object') {
        responseBody = JSON.stringify(responseBody);
    }
    return (
        <div className="threescall-container">
            <UserInput key={1} requestBody={responseBody} placeholder={"Response Body"}/>
            <UserInput key={2} requestBody={responseHeaders} placeholder={"Response Headers"} />
        </div>
    );
};

export default ThreeSCall;