import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TextBox } from '@components/TextBox';
import { Buttons } from '@components/Button';
import { Title } from '@components/Title';
import { Layout } from '@components/Layout';
import { useOviceMic } from 'src/hooks/useOvice';

const Pages = () => {
    const [keyword, setKeyword] = useState('')
    const [exclusionKeyword, setExclusionKeyword] = useState('')
    const [extensionKeyword, setExtensionKeyword] = useState('')
    const { mic, active,status, close, coffee, openspace, screenshare, changeMic } = useOviceMic()
    const handleClick = useCallback((event) => {
        if (chrome && chrome.tabs) {
            changeMic(!mic)
        }
    },[mic,changeMic])
    const handleMove = useCallback(async (event) => {
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
    },[active])
    const handleClose = useCallback(async (event) => {
        if (chrome && chrome.tabs) {
            close()
        }
    },[close])
    const handleCoffee = useCallback(async (event) => {
        if (chrome && chrome.tabs) {
            coffee()
        }
    },[coffee])
    const handleOpenSpace = useCallback(async (event) => {
        if (chrome && chrome.tabs) {
            openspace()
        }
    },[openspace])
    const handleScreenShare = useCallback(async (event) => {
        if (chrome && chrome.tabs) {
            screenshare()
        }
    },[screenshare])
    return useMemo(()=>{
        console.log(status)
        return (<>
            <Layout title={'oVice Controller Extension'}>
                <Buttons
                    label='Mic Control'
                    buttons={[
                        { label: `mic ${status?.ovice_mic_on ? 'on' : 'off'}`, onClick: handleClick, on: status?.ovice_mic_on }
                    ]}
                />
                <Buttons
                    label='Screen Control'
                    buttons={[
                        { label: 'ScreenShare', onClick: handleScreenShare,on: status?.ovice_screenshare_on }
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
                        { label: 'Coffee', onClick: handleCoffee },
                        { label: 'OpenSpace', onClick: handleOpenSpace }
                    ]}
                />
            </Layout>
        </>
    )},[status,mic,handleClick,handleMove,handleClose,handleCoffee,handleOpenSpace,handleScreenShare]);
};

export default Pages;
