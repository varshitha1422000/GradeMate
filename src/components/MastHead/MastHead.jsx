import React from "react";

import { FaRegQuestionCircle, FaBell } from "react-icons/fa";
import  icon  from '../../img/icons8-logo-50.png';

import './MastHead.css';


export default function MastHead() {
    return (
        <div className="mast-header">
            <div className="side-header">
                <img src={icon} alt="app-icon" />
                <h3>Hi Pankajam</h3>
            </div>
            <div className="icons">
                <FaRegQuestionCircle />
                <FaBell />
                <div className="profile-pic"></div>
            </div>
        </div>
    );
}