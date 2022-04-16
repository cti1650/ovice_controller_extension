import React from 'react'
import { Layout } from '@components/Layout'
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

const Pages = () => {
    // const { tabId } = useTabState()
    return (
        <>
            <Layout
                title={'oVice Controller Extension'}
                classNames={{ root: 'relative' }}
            >
                <PlaceStatus />
                <div className='flex flex-row items-end space-x-[19px]'>
                    <LeaveControllButton />
                    <RestControllButton />
                    <MoveFrontControllButton />
                    <ScreenShareControllButton />
                    <VolumeControllButton />
                    <MicControllButton />
                </div>
            </Layout>
        </>
    )
}

export default Pages
