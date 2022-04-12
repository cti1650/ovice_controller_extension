const testMode = false

const checkOviceUrl = (url) => {
    const reg = /https?:\/\/.*?\.ovice\.in\/(@room_id-\d+|@\d+,\d+)?/
    return reg.exec(url)
}

const flagChecker = () => {
    chrome.storage.local.set({
        ovice_has_logout: !!document.querySelector("#leave-openspace-block"),
    })
    chrome.storage.local.set({
        ovice_has_openspace: !!document.querySelector("#leave-room-block"),
    })
    chrome.storage.local.set({
        ovice_has_coffee: !!document.querySelector("#away-block"),
    })
    const screenshare_ele = document.querySelector("#screenshare-block > div")
    if (screenshare_ele) {
        chrome.storage.local.set({ ovice_has_screenshare: true })
        if (screenshare_ele.querySelector("i.bar-device-on")) {
            chrome.storage.local.set({ ovice_screenshare_on: true })
        } else {
            chrome.storage.local.set({ ovice_screenshare_on: false })
        }
    } else {
        const eleList = document.querySelectorAll(".dynamic-object-element")
        if (eleList) {
            eleList.forEach((ele) => {
                if (ele.querySelector("img")) {
                    if (
                        ele.querySelector("img")["src"].includes("screenshare")
                    ) {
                        chrome.storage.local.set({
                            ovice_has_screenshare: true,
                        })
                        if (ele.querySelector("i.bar-device-on")) {
                            chrome.storage.local.set({
                                ovice_screenshare_on: true,
                            })
                        } else {
                            chrome.storage.local.set({
                                ovice_screenshare_on: false,
                            })
                        }
                    }
                }
            })
        }
    }
    const mic_ele = document.querySelector("#mic-block > div")
    if (mic_ele.querySelector(".bar-device-off")) {
        chrome.storage.local.set({ ovice_has_mic: true, ovice_mic_on: false })
    }
    if (mic_ele.querySelector(".bar-device-on")) {
        chrome.storage.local.set({ ovice_has_mic: true, ovice_mic_on: true })
    }
}

const polingOviceStatus = (url, tabId) => {
    const data = checkOviceUrl(url)
    if (data) {
        if (data[1]) {
            const place = data[1]
            if (place.indexOf("@room_id-") === 0) {
                chrome.storage.local.set({ ovice_place_type: "room" })
            } else {
                chrome.storage.local.set({ ovice_place_type: "openspace" })
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
                    chrome.storage.local.get(["ovice_mic_on"], (result) => {
                        if (result.ovice_mic_on) {
                            chrome.action.setIcon({
                                path: "icons/icon_32_on.png",
                            })
                        } else {
                            chrome.action.setIcon({
                                path: "icons/icon_32_off.png",
                            })
                        }
                    })
                }
            )
        } else {
            chrome.storage.local.set({
                ovice_tab_id: 0,
                ovice_place: "",
                ovice_place_type: "none",
                ovice_has_logout: false,
                ovice_has_openspace: false,
                ovice_has_coffee: false,
                ovice_has_screenshare: false,
                ovice_has_mic: false,
                ovice_screenshare_on: false,
                ovice_mic_on: false,
            })
            chrome.action.setIcon({
                path: "icons/icon_32_none.png",
            })
        }
    } else {
        chrome.tabs.query({}, (tabs) => {
            const oviceTabs = [...tabs].filter((tab) => {
                return /https?:\/\/.*?\.ovice\.in/.test(tab.url)
            })
            if (oviceTabs.length > 0) {
                polingOviceStatus(oviceTabs[0].url, oviceTabs[0].id)
            } else {
                chrome.storage.local.set({
                    ovice_tab_id: 0,
                    ovice_place: "",
                    ovice_place_type: "none",
                    ovice_has_logout: false,
                    ovice_has_openspace: false,
                    ovice_has_coffee: false,
                    ovice_has_screenshare: false,
                    ovice_has_mic: false,
                    ovice_screenshare_on: false,
                    ovice_mic_on: false,
                })
                chrome.action.setIcon({
                    path: "icons/icon_32_none.png",
                })
            }
        })
    }
}

const tick = setInterval(() => {
    testMode && console.log("tick")
    polingOviceStatus("", 0)
    chrome.storage.local.get(
        [
            "ovice_tab_id",
            "ovice_place",
            "ovice_place_type",
            "ovice_has_logout",
            "ovice_has_openspace",
            "ovice_has_coffee",
            "ovice_has_screenshare",
            "ovice_has_mic",
            "ovice_mic_on",
            "ovice_screenshare_on",
        ],
        (data) => {
            testMode && console.log("ovice_status", data)
        }
    )
}, 10000)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    testMode && console.log("tab url", tab.url)
    testMode && console.log("changeInfo", changeInfo)
    polingOviceStatus(tab.url, tabId)
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    testMode && console.log("active Info", activeInfo)
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        polingOviceStatus(tab.url, tab.id)
    })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    testMode && console.log("request", request)
    if (request.type === "get_ovice_status") {
        polingOviceStatus("", 0)
        chrome.storage.local.get(
            [
                "ovice_tab_id",
                "ovice_place",
                "ovice_place_type",
                "ovice_has_logout",
                "ovice_has_openspace",
                "ovice_has_coffee",
                "ovice_has_screenshare",
                "ovice_has_mic",
                "ovice_mic_on",
                "ovice_screenshare_on",
            ],
            (data) => {
                testMode && console.log("ovice_status", data)
                sendResponse(data)
            }
        )
    }
    return true
})
