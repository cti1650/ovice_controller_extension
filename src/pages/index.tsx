import React, { useEffect, useState } from 'react';
import { TextBox } from '@components/TextBox';
import { Buttons } from '@components/Button';
import { Title } from '@components/Title';
import { Layout } from '@components/Layout';

const Pages = () => {
    const [keyword, setKeyword] = useState('')
    const [exclusionKeyword, setExclusionKeyword] = useState('')
    const [extensionKeyword, setExtensionKeyword] = useState('')
    const handleClick = async (event) => {
        if (chrome && chrome.tabs) {
            // let queryOptions = { active: true, currentWindow: true };
            // let [tab] = await chrome.tabs.query(queryOptions);
            let tabs = await chrome.tabs.query({})
            tabs.forEach(tab => {
                if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id },
                            func: () => {
                                console.log(window)
                                console.log(document)
                                const ele = document.querySelector("#mic-block > div")
                                ele['click']()
                                if (ele.querySelector(".bar-device-off")) {
                                    console.log("mic off")
                                }
                                if (ele.querySelector(".bar-device-on")) {
                                    console.log("mic on")
                                }
                            }
                        },
                        () => { }
                    );
                }
            })
        }
    }
    const handleMove = async (event) => {
        if (chrome && chrome.tabs) {
            // let queryOptions = { active: true, currentWindow: true };
            // let [tab] = await chrome.tabs.query(queryOptions);
            let tabs = await chrome.tabs.query({})
            tabs.forEach(tab => {
                if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
                    chrome.tabs.update( tab.id, {selected:true}, function(tab){});
                }
            })
        }
    }
    return (
        <>
            <Layout title={'GitHub Search Extension'}>
                <TextBox
                    value={keyword}
                    onChange={setKeyword}
                    label='Keyword'
                    placeholder='Search or jump to… ( keyword )'
                    holder='search_keyword' />
                <TextBox
                    value={exclusionKeyword}
                    onChange={setExclusionKeyword}
                    label='Exclusion'
                    placeholder='Add keywords for searching ( -keyword )'
                    holder='search_exclusion_keyword' />
                <TextBox
                    value={extensionKeyword}
                    onChange={setExtensionKeyword}
                    label='File or Extension'
                    placeholder='file extension keyword ( tsx,ts )'
                    holder='search_file_extension_keyword' />
                <Buttons
                    label='Search Type'
                    buttons={[
                        { label: 'Login', onClick: handleClick },
                        { label: 'Focus', onClick: handleMove }
                    ]}
                />
            </Layout>
        </>
    );
};

export default Pages;
