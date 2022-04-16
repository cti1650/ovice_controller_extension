import { OffVolumeIcon, OnVolumeIcon } from '@components/Icon'
import { useTabState } from '@components/Recoil'
import { useCallback, useMemo, VFC } from 'react'
import { IconButton } from './IconButton'

export const VolumeControllButton: VFC = () => {
    const { volume, setVolume, hasMic } = useTabState()
    const handleClick = useCallback(() => {
        console.log('test')
        setVolume(!volume)
    }, [volume])
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
        [volume, hasMic, handleClick]
    )
}
