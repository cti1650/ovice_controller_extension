import { useEffect, useMemo } from 'react'
import {
    atom,
    RecoilState,
    RecoilValueReadOnly,
    selector,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil'

type TabState = {
    tabId: number
    place?: string
    placeType?: string
    hasLogout?: boolean | undefined
    hasOpenSpace?: boolean | undefined
    hasCoffee?: boolean | undefined
    hasScreenShare?: boolean | undefined
    hasMic?: boolean | undefined
    screenShareOn?: boolean | undefined
    micOn?: boolean | undefined
    volumeOn?: boolean | undefined
}

const keyList = {
    tabId: 'ovice_tab_id',
    place: 'ovice_place',
    placeType: 'ovice_place_type',
    hasLogout: 'ovice_has_logout',
    hasOpenspace: 'ovice_has_openspace',
    hasCoffee: 'ovice_has_coffee',
    hasScreenShare: 'ovice_has_screenshare',
    hasMic: 'ovice_has_mic',
    micOn: 'ovice_mic_on',
    volumeOn: 'ovice_volume_on',
    screenShareOn: 'ovice_screenshare_on',
}

export const tabState: RecoilState<TabState> = atom({
    key: 'tabState',
    default: {
        tabId: 0,
        place: '',
        placeType: '',
        hasLogout: undefined,
        hasOpenSpace: undefined,
        hasCoffee: undefined,
        hasScreenShare: undefined,
        hasMic: undefined,
        screenShareOn: undefined,
        micOn: undefined,
        volumeOn: undefined,
    },
})

export const tabIdState: RecoilState<number> = selector({
    key: 'tabIdState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.tabId || 0
    },
    set: ({ set }, newValue) => {
        set(tabState, { ...tabState, tabId: Number(newValue) })
    },
})

export const micState: RecoilState<boolean | undefined> = selector({
    key: 'micState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.micOn
    },
    set: ({ set }, newValue) => {
        if (chrome.storage) {
            chrome.storage.local.set({ ovice_mic_on: newValue })
        } else {
            localStorage.setItem('ovice_mic_on', newValue ? 'true' : '')
        }
    },
})

export const volumeState: RecoilState<boolean | undefined> = selector({
    key: 'volumeState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.volumeOn
    },
    set: ({ set }, newValue) => {
        if (chrome.storage) {
            chrome.storage.local.set({ ovice_volume_on: newValue })
        } else {
            localStorage.setItem('ovice_volume_on', newValue ? 'true' : '')
        }
    },
})

export const hasMicState: RecoilValueReadOnly<boolean> = selector({
    key: 'hasMicState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasMic
    },
})

export const screenShareState: RecoilState<boolean | undefined> = selector({
    key: 'screenShareState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.screenShareOn
    },
    set: ({ set }, newValue) => {
        if (chrome.storage) {
            chrome.storage.local.set({ ovice_screenshare_on: newValue })
        } else {
            localStorage.setItem('ovice_screenshare_on', newValue ? 'true' : '')
        }
    },
})

export const placeTypeState: RecoilValueReadOnly<string> = selector({
    key: 'placeTypeState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.placeType
    },
})

export const placeState: RecoilValueReadOnly<string> = selector({
    key: 'placeState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.place
    },
})

export const hasScreenShareState: RecoilValueReadOnly<boolean> = selector({
    key: 'hasScreenShareState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasScreenShare
    },
})

export const restState: RecoilValueReadOnly<boolean> = selector({
    key: 'restState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasCoffee
    },
})

export const leaveState: RecoilValueReadOnly<boolean> = selector({
    key: 'leaveState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasOpenSpace || tabData.hasLogout
    },
})

export const useTabState = () => {
    const tab = useRecoilValue(tabState)
    const setTab = useSetRecoilState(tabState)
    const mic = useRecoilValue(micState)
    const setMic = useSetRecoilState(micState)
    const volume = useRecoilValue(volumeState)
    const setVolume = useSetRecoilState(volumeState)
    const screenShare = useRecoilValue(screenShareState)
    const setScreenShare = useSetRecoilState(screenShareState)

    const placeType = useRecoilValue(placeTypeState)
    const place = useRecoilValue(placeState)
    const hasMic = useRecoilValue(hasMicState)
    const hasScreenShare = useRecoilValue(hasScreenShareState)
    const tabId = useRecoilValue(tabIdState)
    const rest = useRecoilValue(restState)
    const leave = useRecoilValue(leaveState)
    useEffect(() => {
        const tick = setInterval(() => {
            if (chrome.storage) {
                chrome.storage?.local.get(
                    [...Object.keys(keyList).map((key) => keyList[key])],
                    (data) => {
                        Object.keys(tab).forEach((key) => {
                            switch (key) {
                                case '':
                                    break
                                default:
                                    if (tab[key] !== data[keyList[key]]) {
                                        setTab({
                                            ...tab,
                                            [key]: data[keyList[key]],
                                        })
                                    }
                                    break
                            }
                        })
                    }
                )
            } else {
                let data = {}
                Object.keys(tab).forEach((key) => {
                    switch (key) {
                        case '':
                            break
                        case 'tabId':
                            if (
                                tab[key] !==
                                Number(localStorage.getItem(keyList[key]))
                            ) {
                                data = {
                                    ...data,
                                    [key]:
                                        Number(
                                            localStorage.getItem(keyList[key])
                                        ) || 0,
                                }
                            }
                            break
                        case 'place':
                        case 'placeType':
                            if (
                                tab[key] !== localStorage.getItem(keyList[key])
                            ) {
                                data = {
                                    ...data,
                                    [key]: localStorage.getItem(keyList[key]),
                                }
                            }
                            break
                        default:
                            if (
                                tab[key] !==
                                !!localStorage.getItem(keyList[key])
                            ) {
                                data = {
                                    ...data,
                                    [key]: !!localStorage.getItem(keyList[key]),
                                }
                            }
                            break
                    }
                })
                if (Object.keys(data).length > 0) {
                    setTab({ ...tab, ...data })
                }
            }
        }, 200)
        return () => {
            clearInterval(tick)
        }
    }, [tab, setTab])

    return useMemo(() => {
        return {
            tab,
            setTab,
            mic,
            setMic,
            volume,
            setVolume,
            screenShare,
            setScreenShare,
            tabId,
            placeType,
            place,
            rest,
            leave,
            hasMic,
            hasScreenShare,
        }
    }, [
        tab,
        mic,
        volume,
        screenShare,
        tabId,
        placeType,
        place,
        rest,
        leave,
        hasMic,
        hasScreenShare,
    ])
}
