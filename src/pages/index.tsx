import React, { useEffect, useState } from 'react';
import { TextBox } from '@components/TextBox';
import { Buttons } from '@components/Button';
import { Title } from '@components/Title';
import { Layout } from '@components/Layout';
import { useOviceMic } from 'src/hooks/useOvice';

const Pages = () => {
    const [keyword, setKeyword] = useState('')
    const [exclusionKeyword, setExclusionKeyword] = useState('')
    const [extensionKeyword, setExtensionKeyword] = useState('')
    const {mic, active,close,coffee ,changeMic} = useOviceMic()
    const handleClick = (event) => {
        if (chrome && chrome.tabs) {
            changeMic(!mic)
        }
    }
    const handleMove = async (event) => {
        if (chrome && chrome.tabs) {
            // let queryOptions = { active: true, currentWindow: true };
            // let [tab] = await chrome.tabs.query(queryOptions);
            // let tabs = await chrome.tabs.query({})
            // tabs.forEach(tab => {
            //     if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
            //         chrome.tabs.update( tab.id, {selected:true}, function(tab){});
            //     }
            // })
            active()
        }
    }
    const handleClose = async (event) => {
        if (chrome && chrome.tabs) {
            close()
        }
    }
    const handleCoffee = async (event) => {
        if (chrome && chrome.tabs) {
            coffee()
        }
    }
    return (
        <>
            <Layout title={'oVice Controller Extension'}>
                <Buttons
                    label='Mic Control'
                    buttons={[
                        { label: `mic ${mic?'on':'off'}`, onClick: handleClick, on: mic }
                    ]}
                />
                <Buttons
                    label='Tab Control'
                    buttons={[
                        { label: 'Focus', onClick: handleMove }
                    ]}
                />
                <Buttons
                    label='Close Control'
                    buttons={[
                        { label: 'Close', onClick: handleClose },
                        { label: 'Coffee', onClick: handleCoffee }
                    ]}
                />
            </Layout>
        </>
    );
};

export default Pages;
