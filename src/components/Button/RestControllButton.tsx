import { CoffeeIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const RestControllButton: VFC = () => {
    const { rest } = useTabState()
    const handleClick = useCallback(() => {
        if (!chrome?.runtime) {
            return
        }
        chrome?.runtime.sendMessage('action_rest', () => {
            if (chrome.runtime.lastError) {
                // console.error('error:', chrome.runtime.lastError.message)
                return
            }
            // console.log('test')
        })
    }, [])
    return useMemo(
        () => (
            <IconButton
                tips='Rest'
                title='rest'
                size='medium'
                disabled={!rest}
                OnIcon={<CoffeeIcon />}
                onClick={handleClick}
            />
        ),
        [rest, handleClick]
    )
}
