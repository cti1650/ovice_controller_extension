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
            console.log('test')
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
