const testMode = false

const storageResetData = {
    ovice_tab_title: '',
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
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        ovice_tab_id: 0,
        ...storageResetData,
    })
    chrome.action.setIcon({
        path: 'icons/icon_32_none.png',
    })
    testMode && console.log('Installed')
})

const checkOviceUrl = (url) => {
    const reg = /https?:\/\/.*?\.ovice\.in\/(@room_id-\d+|@\d+,\d+)+/
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
                    files: ['js/oviceConnecter.js', 'js/flagChecker.js'],
                },
                () => {
                    if (chrome.runtime.lastError) {
                        testMode &&
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
            chrome.storage.local.get(['ovice_tab_id'], (result) => {
                chrome.tabs.query({ tabId: result.ovice_tab_id }, (tabs) => {
                    if (tabs.length === 0) {
                        chrome.storage.local.set({
                            ovice_tab_id: 0,
                        })
                    }
                    chrome.storage.local.set(storageResetData)
                    chrome.action.setIcon({
                        path: 'icons/icon_32_none.png',
                    })
                })
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
                    ...storageResetData,
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
            ['ovice_tab_id', ...Object.keys(storageResetData)],
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
    if (~tab.url.indexOf('ovice.in')) {
        if (checkOviceUrl(tab.url)) {
            testMode && console.log('changeInfo', changeInfo)
            if (changeInfo?.status === 'complete' || changeInfo?.favIconUrl) {
                testMode && console.log('tab url', tab.url)
                testMode && console.log('changeInfo', changeInfo)
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId },
                        files: [
                            'js/oviceConnecter.js',
                            'js/oviceConnecterTick.js',
                        ],
                    },
                    () => {}
                )
                polingOviceStatus(tab.url, tabId)
            }
        } else {
            polingOviceStatus('', 0)
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

const actionMicChange = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: Number(data.ovice_tab_id) },
                files: ['js/oviceConnecter.js', 'js/micChange.js'],
            },
            () => {
                if (chrome.runtime.lastError) {
                    testMode &&
                        console.error(
                            'error:',
                            chrome.runtime.lastError.message
                        )
                    return
                }
                chrome.runtime.sendMessage('get_ovice_status', (res) => {
                    testMode && console.log('res', res)
                    sendResponse({})
                })
            }
        )
    })
}

const actionScreenshareChange = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(tab.windowId, { focused: true }, () => {
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: tab.id },
                            files: [
                                'js/oviceConnecter.js',
                                'js/screenShareChange.js',
                            ],
                        },
                        () => {
                            if (chrome.runtime.lastError) {
                                testMode &&
                                    console.error(
                                        'error:',
                                        chrome.runtime.lastError.message
                                    )
                                return
                            }
                            chrome.runtime.sendMessage(
                                'get_ovice_status',
                                (res) => {
                                    testMode && console.log('res', res)
                                    sendResponse({})
                                }
                            )
                        }
                    )
                })
            }
        )
    })
}

const actionMoveToOvice = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(tab.windowId, { focused: true })
                sendResponse({})
            }
        )
    })
}

const actionVolumeChange = () => {
    chrome.storage.local.get(['ovice_tab_id', 'ovice_volume_on'], (data) => {
        testMode && console.log(Number(data.ovice_tab_id))
        testMode && console.log(data.ovice_volume_on)
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { muted: data.ovice_volume_on },
            function (tab) {
                testMode && console.log(tab)
                chrome.storage.local.set({
                    ovice_volume_on: !tab.mutedInfo.muted,
                })
            }
        )
        sendResponse({})
    })
}

const actionRest = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(
                    tab.windowId,
                    {
                        focused: true,
                    },
                    () => {
                        chrome.scripting.executeScript(
                            {
                                target: {
                                    tabId: Number(data.ovice_tab_id),
                                },
                                files: [
                                    'js/oviceConnecter.js',
                                    'js/actionRest.js',
                                ],
                            },
                            () => {
                                if (chrome.runtime.lastError) {
                                    testMode &&
                                        console.error(
                                            'error:',
                                            chrome.runtime.lastError.message
                                        )
                                    return
                                }
                                chrome.runtime.sendMessage(
                                    'get_ovice_status',
                                    (res) => {
                                        if (chrome.runtime.lastError) {
                                            testMode &&
                                                console.error(
                                                    'error:',
                                                    chrome.runtime.lastError
                                                        .message
                                                )
                                            return
                                        }
                                        testMode && console.log('res', res)
                                        getStatus()
                                        sendResponse({})
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}

const actionLeave = () => {
    chrome.storage.local.get(['ovice_tab_id'], (data) => {
        chrome.tabs.update(
            Number(data.ovice_tab_id),
            { selected: true },
            function (tab) {
                chrome.windows.update(
                    tab.windowId,
                    {
                        focused: true,
                    },
                    () => {
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tab.id },
                                files: [
                                    'js/oviceConnecter.js',
                                    'js/actionLeave.js',
                                ],
                            },
                            () => {
                                if (chrome.runtime.lastError) {
                                    testMode &&
                                        console.error(
                                            'error:',
                                            chrome.runtime.lastError.message
                                        )
                                    return
                                }
                                chrome.runtime.sendMessage(
                                    'get_ovice_status',
                                    (res) => {
                                        if (chrome.runtime.lastError) {
                                            testMode &&
                                                console.error(
                                                    'error:',
                                                    chrome.runtime.lastError
                                                        .message
                                                )
                                            return
                                        }
                                        getStatus()
                                        sendResponse(res)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}

chrome.commands.onCommand.addListener((command) => {
    testMode && console.log(`Command: ${command}`)
    switch (command) {
        case 'ovice_option':
            // chrome.runtime.openOptionsPage(() => {})
            chrome.windows.create({
                type: 'popup',
                url: './dist/index.html',
                height: 230,
                width: 450,
            })
            break
        case 'action_mic_change':
            actionMicChange()
            break
        case 'action_screenshare_change':
            actionScreenshareChange()
            break
        case 'action_move_to_ovice':
            actionMoveToOvice()
            break
        case 'action_volume_change':
            actionVolumeChange()
            break
        case 'action_rest':
            actionRest()
            break
        case 'action_leave':
            actionLeave()
            break
        default:
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    testMode && console.log('request', request)
    switch (request) {
        case 'get_ovice_status':
            polingOviceStatus('', 0)
            chrome.storage.local.get(
                ['ovice_tab_id', ...Object.keys(storageResetData)],
                (data) => {
                    testMode && console.log('ovice_status', data)
                    sendResponse(data)
                }
            )
            break
        case 'action_mic_change':
            actionMicChange()
            break
        case 'action_screenshare_change':
            actionScreenshareChange()
            break
        case 'action_move_to_ovice':
            actionMoveToOvice()
            break
        case 'action_volume_change':
            actionVolumeChange()
            break
        case 'action_rest':
            actionRest()
            break
        case 'action_leave':
            actionLeave()
            break
        default:
            sendResponse({})
    }

    return true
})
