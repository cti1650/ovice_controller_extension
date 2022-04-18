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

    const getStatus = useCallback(async () => {
        chrome.storage.local.get(
            [
                'ovice_tab_id',
                'ovice_tab_title',
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

    const close = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document?.querySelector(
                        '#leave-openspace-block'
                    )
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                chrome.runtime.sendMessage('get_ovice_status', (res) => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                        return
                    }
                    console.log('res', res)
                    getStatus()
                })
            }
        )
    }, [tabId, addScript, getStatus])
    const openspace = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document?.querySelector('#leave-room-block')
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                chrome.runtime.sendMessage('get_ovice_status', (res) => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                        return
                    }
                    console.log('res', res)
                    getStatus()
                })
            }
        )
    }, [tabId, addScript, getStatus])
    const active = useCallback(() => {
        if (tabId) {
            chrome.tabs.update(tabId, { selected: true }, function (tab) {})
        }
    }, [tabId, addScript])

    const coffee = useCallback(() => {
        addScript(
            {
                func: () => {
                    const ele = document?.querySelector('#away-block')
                    if (ele) {
                        ele['click']()
                    }
                },
            },
            () => {
                chrome.runtime.sendMessage('get_ovice_status', (res) => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                        return
                    }
                    console.log('res', res)
                    getStatus()
                })
            }
        )
    }, [tabId, addScript, getStatus])
    const screenshare = useCallback(() => {
        if (tabId) {
            chrome.tabs.update(tabId, { selected: true }, function (tab) {})
            addScript(
                {
                    func: () => {
                        const ele = document?.querySelector(
                            '#screenshare-block > div'
                        )
                        if (ele) {
                            ele['click']()
                        } else {
                            const eleList = document?.querySelectorAll(
                                '.dynamic-object-element'
                            )
                            if (eleList) {
                                eleList.forEach((ele) => {
                                    if (ele?.querySelector('img')) {
                                        if (
                                            ele
                                                ?.querySelector('img')
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
                    chrome.runtime.sendMessage('get_ovice_status', (res) => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                'error:',
                                chrome.runtime.lastError.message
                            )
                            return
                        }
                        console.log('res', res)
                        getStatus()
                    })
                }
            )
        }
    }, [tabId, status, addScript, getStatus])
    const changeMic = useCallback(
        (flag: boolean) => {
            if (mic !== flag) {
                addScript(
                    {
                        func: () => {
                            const ele =
                                document?.querySelector('#mic-block > div')
                            if (ele) {
                                ele['click']()
                            }
                        },
                    },
                    () => {
                        chrome.runtime.sendMessage(
                            'get_ovice_status',
                            (res) => {
                                if (chrome.runtime.lastError) {
                                    console.error(
                                        'error:',
                                        chrome.runtime.lastError.message
                                    )
                                    return
                                }
                                console.log('res', res)
                                getStatus()
                            }
                        )
                    }
                )
            }
        },
        [mic, tabId, status, addScript, getStatus]
    )

    useEffect(() => {
        getStatus()
        const tick = setInterval(() => {
            getStatus()
        }, 1000)
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
