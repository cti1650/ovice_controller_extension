import { OffMicIcon, OnMicIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const MicControllButton: VFC = () => {
    const { mic, setMic, hasMic } = useTabState()
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_mic_chenge', () => {
            if (chrome.runtime.lastError) {
                // console.error('error:', chrome.runtime.lastError.message)
                return
            }
            // console.log('test')
            setMic(!mic)
        })
    }, [mic])
    return useMemo(
        () => (
            <IconButton
                tips='Operate The Mic'
                title='mic'
                size='large'
                on={mic}
                disabled={!hasMic}
                OnIcon={<OnMicIcon />}
                OffIcon={<OffMicIcon />}
                onClick={handleClick}
            />
        ),
        [mic, hasMic, handleClick]
    )
}
