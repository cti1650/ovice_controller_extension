import { ClosedIcon, LockIcon, UnLockIcon } from '@components/Icon'
import { placeTypeState, useTabState } from '@components/Recoil'
import { PrivateStatus } from '@components/Status'
import { useMemo, VFC } from 'react'
import { useRecoilValue } from 'recoil'

export const PlaceStatus: VFC = () => {
    const placeType = useRecoilValue(placeTypeState)
    return useMemo(
        () => (
            <PrivateStatus
                label={placeType}
                size='large'
                OnIcon={<LockIcon />}
                OffIcon={<UnLockIcon />}
                NoneIcon={<ClosedIcon />}
                on={placeType === 'room' ? true : false}
                classNames={{ root: 'absolute top-[-15px] right-0' }}
            />
        ),
        [placeType]
    )
}
