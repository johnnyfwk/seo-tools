'use client';

import Nav from "./nav";
import NavButton from "./navButton";
import { useState } from "react";

export default function NavAndNavButton() {
    const [isNavVisible, setIsNavVisible] = useState(false);

    return (
        <div>
            <Nav
                isNavVisible={isNavVisible}
                setIsNavVisible={setIsNavVisible}
            />

            <NavButton
                isNavVisible={isNavVisible}
                setIsNavVisible={setIsNavVisible}
            />
        </div>
    )
}