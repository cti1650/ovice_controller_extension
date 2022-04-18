import { RecoilState, RecoilValueReadOnly, selector } from 'recoil'
import { tabState } from '@components/Recoil'

// oViceを開いているタブのタブ名を保持するSelector
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

// oViceを開いているタブのマイクの状態を保持するSelector
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

// oViceを開いているタブのスピーカーのミュート状態を保持するSelector
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

// oViceを開いているタブ内にマイク操作用のボタンが存在するかの情報を保持するSelector
export const hasMicState: RecoilValueReadOnly<boolean> = selector({
    key: 'hasMicState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasMic
    },
})

// oViceを開いているタブの画面共有の状態を保持するSelector
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

// oViceを開いているタブでユーザーがどの状態（ログアウト、パブリックスペース、会議室）かの情報を保持するSelector
export const placeTypeState: RecoilValueReadOnly<string> = selector({
    key: 'placeTypeState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.placeType
    },
})

// oViceを開いているタブでユーザーがどこにいるかの情報を保持するSelector
export const placeState: RecoilValueReadOnly<string> = selector({
    key: 'placeState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.place
    },
})

// oViceを開いているタブ内に画面共有操作用のボタンが存在するかの情報を保持するSelector
export const hasScreenShareState: RecoilValueReadOnly<boolean> = selector({
    key: 'hasScreenShareState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasScreenShare
    },
})

// oViceを開いているタブ内に離席用のボタンが存在するかの情報を保持するSelector
export const restState: RecoilValueReadOnly<boolean> = selector({
    key: 'restState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasCoffee
    },
})

// oViceを開いているタブ内に退室用のボタンが存在するかの情報を保持するSelector
export const leaveState: RecoilValueReadOnly<boolean> = selector({
    key: 'leaveState',
    get: ({ get }) => {
        const tabData = get(tabState)
        return tabData.hasOpenSpace || tabData.hasLogout
    },
})
