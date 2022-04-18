import { useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import {
    tabState,
    micState,
    volumeState,
    hasMicState,
    screenShareState,
    placeTypeState,
    placeState,
    hasScreenShareState,
    tabIdState,
    restState,
    leaveState,
} from '@components/Recoil'
import { getStorageData } from './func'

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
        // ストレージのデータ変更を200ms毎に監視して、変更があったら、
        // ストレージのデータをatomに反映させる
        const tick = setInterval(async () => {
            const result = await getStorageData(tab)
            if (result) {
                console.log('result', result)
                setTab({ ...tab, ...result })
            }
        }, 200)
        // レンダリング発生時に監視処理のリセットを行う
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
