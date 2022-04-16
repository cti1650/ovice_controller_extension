import { FocusIcon, LogoutIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const MoveFrontControllButton: VFC = () => {
    const { placeType } = useTabState()
    const handleClick = useCallback(() => {
        console.log('Front')
    }, [])
    return useMemo(
        () => (
            <IconButton
                tips='To The Front'
                title='front'
                size='medium'
                disabled={placeType === 'none'}
                OnIcon={<FocusIcon />}
                onClick={handleClick}
            />
        ),
        [placeType, handleClick]
    )
}
