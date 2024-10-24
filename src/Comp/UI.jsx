import React, { useState, useEffect } from 'react';
import Stars from "./Stars";
import AnimatedText from "./animatedtext";
import EarthGlobe from "./earth";
const UI = () => {
    return (
        <div className="app-wrapper">
            <Stars/>
            <div className="main-content">
                <div className="text-section">
                    <AnimatedText/>
                </div>
                <div className="earth-section">
                    <EarthGlobe/>
                </div>
            </div>
        </div>
    );
}
export default UI;