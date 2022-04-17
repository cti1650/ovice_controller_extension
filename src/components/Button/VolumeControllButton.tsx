import { OffVolumeIcon, OnVolumeIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const VolumeControllButton: VFC = () => {
    const { volume, tab, hasMic } = useTabState()
    const handleClick = useCallback(() => {
        chrome?.runtime.sendMessage('action_volume_change', () => {
            console.log('test')
        })
    }, [volume, tab])
    return useMemo(
        () => (
            <IconButton
                tips='Operate The Volume'
                title='volume'
                size='large'
                on={volume}
                disabled={!hasMic}
                OnIcon={<OnVolumeIcon />}
                OffIcon={<OffVolumeIcon />}
                onClick={handleClick}
            />
        ),
        [volume, tab, hasMic, handleClick]
    )
}
