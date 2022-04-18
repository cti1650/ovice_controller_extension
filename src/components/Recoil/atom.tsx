import { atom, RecoilState } from 'recoil'

export type TabState = {
    tabId: number
    tabTitle?: string
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

export const keyList = {
    tabId: 'ovice_tab_id',
    tabTitle: 'ovice_tab_title',
    place: 'ovice_place',
    placeType: 'ovice_place_type',
    hasLogout: 'ovice_has_logout',
    hasOpenSpace: 'ovice_has_openspace',
    hasCoffee: 'ovice_has_coffee',
    hasScreenShare: 'ovice_has_screenshare',
    hasMic: 'ovice_has_mic',
    micOn: 'ovice_mic_on',
    volumeOn: 'ovice_volume_on',
    screenShareOn: 'ovice_screenshare_on',
}

// oViceのタブ情報を保持するAtom
export const tabState: RecoilState<TabState> = atom({
    key: 'tabState',
    default: {
        tabId: 0,
        tabTitle: '',
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
