import { useCallback, useEffect, useMemo, useState } from 'react'

export const useOviceMic = () => {
    const testMode = false
    const [mic, setMic] = useState(false)
    const [status, setStatus] = useState(null)
    const [tabId, setTabId] = useState(0)
    const tabCheck = useCallback(async () => {
        let tabs = await chrome.tabs.query({})
        const oviceTabs = [...tabs].filter((tab) => {
            return /https?:\/\/.*?\.ovice\.in/.test(tab.url)
        })
        if (oviceTabs.length > 0) {
            setTabId(oviceTabs[0].id)
        } else {
            setTabId(0)
            chrome.action.setIcon({
                path: '../icons/icon_32_none.png',
            })
        }
    }, [tabId])
    const addScript = useCallback(
        (funcOption = {}, callback) => {
            if (tabId) {
                chrome.scripting.executeScript(
                    {
                        ...funcOption,
                        target: { tabId: tabId },
                    },
                    (injectionResults) => {
                        for (const frameResult of injectionResults) {
                            if (callback) callback(frameResult.result)
                        }
                    }
                )
            }
        },
        [tabId]
    )
    const close = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document.querySelector('#leave-openspace-block')
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                getStatus()
            }
        )
    }, [tabId, addScript])
    const openspace = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document.querySelector('#leave-room-block')
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                getStatus()
            }
        )
    }, [tabId, addScript])
    const active = useCallback(() => {
        if (tabId) {
            chrome.tabs.update(tabId, { selected: true }, function (tab) {})
        }
    }, [tabId, addScript])

    const coffee = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document.querySelector('#away-block')
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                getStatus()
            }
        )
    }, [tabId, addScript])
    const screenshare = useCallback(() => {
        if (tabId) {
            chrome.tabs.update(tabId, { selected: true }, function (tab) {})
            addScript(
                {
                    func: () => {
                        const ele = document.querySelector(
                            '#screenshare-block > div'
                        )
                        if (ele) {
                            ele['click']()
                        } else {
                            const eleList = document.querySelectorAll(
                                '.dynamic-object-element'
                            )
                            if (eleList) {
                                eleList.forEach((ele) => {
                                    if (ele.querySelector('img')) {
                                        if (
                                            ele
                                                .querySelector('img')
                                                ['src'].includes('screenshare')
                                        ) {
                                            ele['click']()
                                        }
                                    }
                                })
                            }
                        }
                    },
                },
                () => {
                    getStatus()
                }
            )
        }
    }, [tabId, status, addScript])
    const changeMic = useCallback(
        (flag: boolean) => {
            if (mic !== flag) {
                addScript(
                    {
                        func: () => {
                            const ele =
                                document.querySelector('#mic-block > div')
                            if (ele) {
                                ele['click']()
                            }
                        },
                    },
                    () => {
                        chrome.runtime.sendMessage(
                            'get_ovice_status',
                            (res) => {
                                setStatus(res)
                            }
                        )
                    }
                )
            }
        },
        [mic, tabId, status, addScript]
    )
    // const getMic = useCallback(async () => {
    //   addScript(
    //     {
    //       func: () => {
    //         const ele = document.querySelector("#mic-block > div");
    //         if (ele.querySelector(".bar-device-off")) {
    //           testMode && console.log("getMic", "mic off");
    //           return false;
    //         }
    //         if (ele.querySelector(".bar-device-on")) {
    //           testMode && console.log("getMic", "mic on");
    //           return true;
    //         }
    //         return null;
    //       },
    //     },
    //     (result) => {
    //       chrome.notifications.create(
    //         "",
    //         {
    //           title: "mic",
    //           message: "on",
    //           iconUrl:
    //             "https://feedback.ovice.io/images/dashboard/2703/ec8fdd382aff5d52b8f6efb31a5eb9dd",
    //           type: "basic",
    //         },
    //         () => {}
    //       );
    //       if(result === null){
    //         chrome.action.setIcon({
    //           path: "../icons/icon_32_none.png"
    //         });
    //         setMic(result);
    //         return
    //       }
    //       chrome.action.setIcon({
    //         path: result ? "../icons/icon_32_on.png" : "../icons/icon_32_off.png",
    //       });
    //       setMic(result);
    //     }
    //   );
    // }, [addScript]);
    const getStatus = useCallback(async () => {
        chrome.storage.local.get(
            [
                'ovice_tab_id',
                'ovice_place',
                'ovice_place_type',
                'ovice_has_logout',
                'ovice_has_openspace',
                'ovice_has_coffee',
                'ovice_has_screenshare',
                'ovice_has_mic',
                'ovice_mic_on',
                'ovice_screenshare_on',
            ],
            (data) => {
                setStatus(data)
                setTabId(data.ovice_tab_id)
            }
        )
    }, [tabId, addScript, setStatus, setTabId])

    useEffect(() => {
        // tabCheck();
        getStatus()
        // getMic();
        const tick = setInterval(() => {
            // tabCheck();
            getStatus()
            // getMic();
        }, 2000)
        return () => {
            clearInterval(tick)
        }
    }, [getStatus])
    return useMemo(() => {
        return {
            mic,
            screenshare,
            status,
            close,
            openspace,
            coffee,
            active,
            tabCheck,
            changeMic,
        }
    }, [
        mic,
        tabId,
        status,
        changeMic,
        tabCheck,
        active,
        close,
        coffee,
        openspace,
        screenshare,
    ])
}
