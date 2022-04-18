const testMode = false

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        ovice_tab_id: 0,
        ovice_place: '',
        ovice_place_type: 'none',
        ovice_has_logout: false,
        ovice_has_openspace: false,
        ovice_has_coffee: false,
        ovice_has_screenshare: false,
        ovice_has_mic: false,
        ovice_screenshare_on: false,
        ovice_mic_on: false,
        ovice_volume_on: true,
    })
    chrome.action.setIcon({
        path: 'icons/icon_32_none.png',
    })
    console.log('Installed')
})

const checkOviceUrl = (url) => {
    const reg = /https?:\/\/.*?\.ovice\.in\/(@room_id-\d+|@\d+,\d+)?/
    return reg.exec(url)
}

const addScript = (funcOption = {}, callback) => {
    chrome.storage.local.get(['ovice_tab_id'], (result) => {
        if (result.ovice_tab_id !== 0) {
            chrome.scripting.executeScript(
                {
                    ...funcOption,
                    target: { tabId: result.ovice_tab_id },
                },
                (injectionResults) => {
                    for (const frameResult of injectionResults) {
                        if (callback) callback(frameResult.result)
                    }
                }
            )
        }
    })
}

const flagChecker = () => {
    chrome.storage.local.set({
        ovice_has_logout: !!document?.querySelector('#leave-openspace-block'),
        ovice_has_openspace: !!document?.querySelector('#leave-room-block'),
        ovice_has_coffee: !!document?.querySelector('#away-block'),
    })
    const screenshare_ele = document?.querySelector('#screenshare-block > div')
    if (screenshare_ele) {
        chrome.storage.local.set({
            ovice_has_screenshare: true,
            ovice_screenshare_on:
                !!screenshare_ele?.querySelector('i.bar-device-on'),
        })
    } else {
        const eleList = document?.querySelectorAll('.dynamic-object-element')
        if (eleList) {
            eleList.forEach((ele) => {
                if (!ele) return
                if (
                    ele?.querySelector('img')?.['src']?.includes('screenshare')
                ) {
                    chrome.storage.local.set({
                        ovice_has_screenshare: true,
                        ovice_screenshare_on:
                            !!ele?.querySelector('i.bar-device-on'),
                    })
                }
            })
        } else {
            chrome.storage.local.set({
                ovice_has_screenshare: false,
                ovice_screenshare_on: false,
            })
        }
    }
    const mic_ele = document?.querySelector('#mic-block > div')
    if (mic_ele) {
        if (mic_ele.querySelector('.bar-device-off')) {
            chrome.storage.local.set({
                ovice_has_mic: true,
                ovice_mic_on: false,
            })
        }
        if (mic_ele.querySelector('.bar-device-on')) {
            chrome.storage.local.set({
                ovice_has_mic: true,
                ovice_mic_on: true,
            })
        }
    }
}

const polingOviceStatus = (url, tabId) => {
    const data = checkOviceUrl(url)
    if (data) {
        if (data[1]) {
            const place = data[1]
            if (place.indexOf('@room_id-') === 0) {
                chrome.storage.local.set({ ovice_place_type: 'room' })
            } else {
                chrome.storage.local.set({ ovice_place_type: 'openspace' })
            }
            chrome.storage.local.set({
                ovice_tab_id: tabId,
                ovice_place: place,
            })
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    func: flagChecker,
                },
                () => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                        return
                    }
                    chrome.storage.local.get(['ovice_mic_on'], (result) => {
                        if (result.ovice_mic_on) {
                            chrome.action.setIcon({
                                path: 'icons/icon_32_on.png',
                            })
                        } else {
                            chrome.action.setIcon({
                                path: 'icons/icon_32_off.png',
                            })
                        }
                    })
                }
            )
        } else {
            chrome.storage.local.set({
                ovice_tab_id: 0,
                ovice_place: '',
                ovice_place_type: 'none',
                ovice_has_logout: false,
                ovice_has_openspace: false,
                ovice_has_coffee: false,
                ovice_has_screenshare: false,
                ovice_has_mic: false,
                ovice_screenshare_on: false,
                ovice_mic_on: false,
                ovice_volume_on: true,
            })
            chrome.action.setIcon({
                path: 'icons/icon_32_none.png',
            })
        }
    } else {
        chrome.tabs.query({}, (tabs) => {
            const oviceTabs = [...tabs].filter((tab) => {
                return checkOviceUrl(tab.url)
            })
            if (oviceTabs.length > 0) {
                polingOviceStatus(oviceTabs[0].url, oviceTabs[0].id)
            } else {
                chrome.storage.local.set({
                    ovice_tab_id: 0,
                    ovice_place: '',
                    ovice_place_type: 'none',
                    ovice_has_logout: false,
                    ovice_has_openspace: false,
                    ovice_has_coffee: false,
                    ovice_has_screenshare: false,
                    ovice_has_mic: false,
                    ovice_screenshare_on: false,
                    ovice_mic_on: false,
                    ovice_volume_on: true,
                })
                chrome.action.setIcon({
                    path: 'icons/icon_32_none.png',
                })
            }
        })
    }
}

let counter = 0
const tick = setInterval(() => {
    testMode && console.log('tick')
    testMode && console.log('counter', counter)
    if (counter % 20 === 0) {
        polingOviceStatus('', 0)
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
                'ovice_volume_on',
                'ovice_screenshare_on',
            ],
            (data) => {
                testMode && console.log('ovice_status', data)
                if (data?.ovice_place_type !== 'none') {
                    counter = 0
                }
            }
        )
    }
    counter++
}, 4000)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (checkOviceUrl(tab.url)) {
        console.log('changeInfo', changeInfo)
        if (changeInfo?.status === 'complete' || changeInfo?.favIconUrl) {
            testMode && console.log('tab url', tab.url)
            testMode && console.log('changeInfo', changeInfo)
            polingOviceStatus(tab.url, tabId)
        }
    }
})

const deletePopup = (tabId) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            func: () => {
                const items = document?.querySelectorAll(
                    'div[name=ovice-controller-popup]'
                )
                if (items) {
                    items.forEach((item) => {
                        item.remove()
                    })
                }
            },
        },
        () => {}
    )
}

const addPopup = (tabId) => {
    chrome.storage.local.get(['ovice_mic_on'], (data) => {
        if (data?.ovice_mic_on) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: () => {
                        let ele = document.createElement('div')
                        ele.setAttribute('name', 'ovice-controller-popup')
                        ele.onClick = (event) => {
                            event.target.remove()
                        }
                        ele.innerHTML = 'oVice Voice Sharing'
                        document.body.append(ele)
                    },
                },
                () => {}
            )
        }
    })
}

const checkPopup = () => {
    chrome.tabs.query({}, (tabs) => {
        const oviceTabs = [...tabs].forEach((tab) => {
            return checkOviceUrl(tab.url)
        })
        if (oviceTabs.length > 0) {
            chrome.tabs.update(oviceTabs[0].id, { active: true })
        }
    })
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    testMode && console.log('active Info', activeInfo)
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (checkOviceUrl(tab.url)) {
            polingOviceStatus(tab.url, tab.id)
        } else {
            // TODO: 動作が不安定なため、一旦コメントアウト
            // chrome.scripting.executeScript(
            //     {
            //         target: { tabId: tab.id },
            //         func: () => {
            //             const items = document?.querySelectorAll(
            //                 'div[name=ovice-controller-popup]'
            //             )
            //             if (items) {
            //                 items.forEach((item) => {
            //                     item.remove()
            //                 })
            //             }
            //         },
            //     },
            //     () => {
            //         chrome.storage.local.get(['ovice_mic_on'], (data) => {
            //             if (data?.ovice_mic_on) {
            //                 chrome.scripting.executeScript(
            //                     {
            //                         target: { tabId: tab.id },
            //                         func: () => {
            //                             let ele = document.createElement('div')
            //                             ele.setAttribute(
            //                                 'name',
            //                                 'ovice-controller-popup'
            //                             )
            //                             ele.onClick = (event) => {
            //                                 event.target.remove()
            //                             }
            //                             ele.innerHTML = 'oVice Voice Sharing'
            //                             document.body.append(ele)
            //                         },
            //                     },
            //                     () => {}
            //                 )
            //             }
            //         })
            //     }
            // )
            polingOviceStatus('', '')
        }
    })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    testMode && console.log('request', request)
    switch (request) {
        case 'get_ovice_status':
            polingOviceStatus('', 0)
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
                    'ovice_volume_on',
                    'ovice_screenshare_on',
                ],
                (data) => {
                    testMode && console.log('ovice_status', data)
                    sendResponse(data)
                }
            )
            break
        case 'action_mic_chenge':
            chrome.storage.local.get(['ovice_tab_id'], (data) => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: Number(data.ovice_tab_id) },
                        func: () => {
                            const ele =
                                document?.querySelector('#mic-block > div')
                            if (ele) {
                                ele['click']()
                            }
                        },
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                'error:',
                                chrome.runtime.lastError.message
                            )
                            return
                        }
                        chrome.runtime.sendMessage(
                            'get_ovice_status',
                            (res) => {
                                console.log('res', res)
                            }
                        )
                    }
                )
            })
            break
        case 'action_screenshare_chenge':
            chrome.storage.local.get(['ovice_tab_id'], (data) => {
                chrome.tabs.update(
                    Number(data.ovice_tab_id),
                    { selected: true },
                    function (tab) {
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tab.id },
                                func: () => {
                                    const ele = document?.querySelector(
                                        '#screenshare-block > div'
                                    )
                                    if (ele) {
                                        ele['click']()
                                    } else {
                                        const eleList =
                                            document?.querySelectorAll(
                                                '.dynamic-object-element'
                                            )
                                        if (eleList) {
                                            eleList.forEach((ele) => {
                                                if (ele?.querySelector('img')) {
                                                    if (
                                                        [
                                                            ...ele?.querySelectorAll(
                                                                'img'
                                                            ),
                                                        ].filter((item) =>
                                                            item?.[
                                                                'src'
                                                            ]?.includes(
                                                                'screenshare'
                                                            )
                                                        ).length !== 0
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
                                if (chrome.runtime.lastError) {
                                    console.error(
                                        'error:',
                                        chrome.runtime.lastError.message
                                    )
                                    return
                                }
                                chrome.runtime.sendMessage(
                                    'get_ovice_status',
                                    (res) => {
                                        console.log('res', res)
                                    }
                                )
                            }
                        )
                    }
                )
            })
            break
        case 'action_move_to_ovice':
            chrome.storage.local.get(['ovice_tab_id'], (data) => {
                chrome.tabs.update(
                    Number(data.ovice_tab_id),
                    { selected: true },
                    function (tab) {}
                )
            })
            break
        case 'action_volume_change':
            chrome.storage.local.get(
                ['ovice_tab_id', 'ovice_volume_on'],
                (data) => {
                    console.log(Number(data.ovice_tab_id))
                    console.log(data.ovice_volume_on)
                    chrome.tabs.update(
                        Number(data.ovice_tab_id),
                        { muted: data.ovice_volume_on },
                        function (tab) {
                            console.log(tab)
                            chrome.storage.local.set({
                                ovice_volume_on: !tab.mutedInfo.muted,
                            })
                        }
                    )
                }
            )
            break
        case 'action_rest':
            chrome.storage.local.get(['ovice_tab_id'], (data) => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: Number(data.ovice_tab_id) },
                        func: () => {
                            const ele = document?.querySelector('#away-block')
                            if (ele) {
                                ele['click']()
                            }
                        },
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                'error:',
                                chrome.runtime.lastError.message
                            )
                            return
                        }
                        chrome.runtime.sendMessage(
                            'get_ovice_status',
                            (res) => {
                                console.log('res', res)
                                chrome.tabs.update(
                                    Number(data.ovice_tab_id),
                                    { selected: true },
                                    function (tab) {
                                        getStatus()
                                    }
                                )
                            }
                        )
                    }
                )
            })
            break
        case 'action_leave':
            chrome.storage.local.get(['ovice_tab_id'], (data) => {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: Number(data.ovice_tab_id) },
                        func: () => {
                            const ele = document?.querySelector(
                                '#leave-openspace-block'
                            )
                            if (ele) {
                                ele['click']()
                            }
                            const ele2 =
                                document?.querySelector('#leave-room-block')
                            if (ele2) {
                                ele2['click']()
                            }
                        },
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                'error:',
                                chrome.runtime.lastError.message
                            )
                            return
                        }
                        chrome.runtime.sendMessage(
                            'get_ovice_status',
                            (res) => {
                                chrome.tabs.update(
                                    Number(data.ovice_tab_id),
                                    { selected: true },
                                    function (tab) {
                                        getStatus()
                                    }
                                )
                                sendResponse(res)
                            }
                        )
                    }
                )
            })
            break
        default:
    }
    return true
})
