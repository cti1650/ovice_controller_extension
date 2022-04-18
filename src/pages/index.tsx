import React from 'react'
import { WideLayout } from '@components/Layout'
import { PlaceStatus, PrivateStatus } from '@components/Status'
import { useTabState } from '@components/Recoil'
import {
    VolumeControllButton,
    MicControllButton,
    ScreenShareControllButton,
    RestControllButton,
    LeaveControllButton,
    MoveFrontControllButton,
} from '@components/Button'
import { TabTitleStatus } from '@components/Status/TabTitleStatus'

const Pages = () => {
    // const { tabId } = useTabState()
    return (
        <>
            <WideLayout
                title={'oVice Controller Extension'}
                classNames={{ root: 'relative' }}
            >
                <PlaceStatus />
                <div className='flex flex-row items-end space-x-[19px]'>
                    <MicControllButton />
                    <VolumeControllButton />
                    <ScreenShareControllButton />
                    <MoveFrontControllButton />
                    <RestControllButton />
                    <LeaveControllButton />
                </div>
                <TabTitleStatus />
            </WideLayout>
        </>
    )
}

export default Pages
