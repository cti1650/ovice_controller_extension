import { LogoutIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const LeaveControllButton: VFC = () => {
    const { leave, placeType } = useTabState()
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_leave', () => {
            if (chrome.runtime.lastError) {
                // console.error('error:', chrome.runtime.lastError.message)
                return
            }
            // console.log('leave')
        })
    }, [])
    return useMemo(
        () => (
            <IconButton
                tips={
                    placeType === 'room' ? 'Leave The Room' : 'Leave The oVice'
                }
                title='leave'
                size='medium'
                disabled={!leave}
                OnIcon={<LogoutIcon />}
                onClick={handleClick}
            />
        ),
        [leave, placeType, handleClick]
    )
}
