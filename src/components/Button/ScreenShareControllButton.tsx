import { ScreenIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const ScreenShareControllButton: VFC = () => {
    const { screenShare, setScreenShare, hasScreenShare } = useTabState()
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_screenshare_chenge', () => {
            if (chrome.runtime.lastError) {
                // console.error('error:', chrome.runtime.lastError.message)
                return
            }
            // console.log('test')
            setScreenShare(!screenShare)
        })
    }, [screenShare])
    return useMemo(
        () => (
            <IconButton
                tips='Operate The Screen Share'
                title='screenShare'
                size='large'
                on={screenShare}
                disabled={!hasScreenShare}
                OnIcon={<ScreenIcon />}
                onClick={handleClick}
            />
        ),
        [screenShare, hasScreenShare, handleClick]
    )
}
