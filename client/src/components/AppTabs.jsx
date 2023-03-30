import { useState, useEffect, useMemo } from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import { Tab, Tabs } from 'react-bootstrap';

function AppTabs() {
    return (
        <>
            <Tabs
                defaultActiveKey="wallet"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="wallet" title="Generate Wallet">
                    <Wallet />
                </Tab>
                <Tab eventKey="transfer" title="Transfer">
                    <Transfer />
                </Tab>
                <Tab eventKey="github" title="Github" >
                    will show github repo
                </Tab>
            </Tabs>
        </>
    );
}

export default AppTabs;