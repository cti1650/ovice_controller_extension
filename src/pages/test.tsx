import React, { useMemo } from 'react'
import { Layout } from '@components/Layout'
import { IconButton } from '@components/Button/IconButton'
import {
    CoffeeIcon,
    FocusIcon,
    LockIcon,
    LogoutIcon,
    OffMicIcon,
    OnMicIcon,
    ScreenIcon,
    UnLockIcon,
} from '@components/Icon'
import { PlaceStatus, PrivateStatus } from '@components/Status'
import { useTabState } from '@components/Recoil'

const status = {
    ovice_mic_on: false,
    ovice_screenshare_on: false,
    ovice_tab_id: false,
    ovice_has_mic: true,
    ovice_has_screenshare: true,
    ovice_has_logout: true,
    ovice_has_coffee: true,
    ovice_has_openspace: true,
    ovice_place: '',
    ovice_place_type: 'none',
}

const Pages = () => {
    const {
        setTab,
        tabId,
        rest,
        leave,
        mic,
        setMic,
        screenShare,
        setScreenShare,
        hasMic,
        hasScreenShare,
    } = useTabState()
    return useMemo(() => {
        console.log(tabId)
        console.log(rest)
        console.log(leave)
        console.log(mic)
        console.log(screenShare)
        return (
            <>
                <Layout title={'oVice Controller Extension'}>
                    <div className='flex flex-row space-x-[19px]'>
                        <PlaceStatus />
                        <IconButton
                            size='large'
                            on={!!mic}
                            disabled={!hasMic}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                                setMic((tab) => {
                                    return !tab
                                })
                            }}
                        />
                        <IconButton
                            size='large'
                            on={!!screenShare}
                            disabled={!hasScreenShare}
                            OnIcon={<ScreenIcon />}
                            OffIcon={<ScreenIcon />}
                            onClick={() => {
                                console.log('click')
                                setScreenShare((tab) => {
                                    return !tab
                                })
                            }}
                        />
                        <IconButton
                            size='large'
                            on={true}
                            disabled={false}
                            OnIcon={<FocusIcon />}
                            OffIcon={<FocusIcon />}
                            onClick={() => {
                                console.log('click')
                                setTab((tab) => {
                                    return {
                                        ...tab,
                                        place: '',
                                        placeType: '',
                                    }
                                })
                            }}
                        />
                        <IconButton
                            size='large'
                            on={true}
                            disabled={false}
                            OnIcon={<LockIcon />}
                            OffIcon={<UnLockIcon />}
                            onClick={() => {
                                console.log('click')
                                setTab((tab) => {
                                    return {
                                        ...tab,
                                        place: '',
                                        placeType: '',
                                    }
                                })
                            }}
                        />
                        <IconButton
                            size='large'
                            on={true}
                            disabled={false}
                            OnIcon={<CoffeeIcon />}
                            OffIcon={<CoffeeIcon />}
                            onClick={() => {
                                console.log('click')
                                setTab((tab) => {
                                    return {
                                        ...tab,
                                        place: '',
                                        placeType: '',
                                    }
                                })
                            }}
                        />
                        <IconButton
                            size='large'
                            on={false}
                            disabled={false}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='large'
                            on={undefined}
                            disabled={false}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='large'
                            on={undefined}
                            disabled={true}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='large'
                            on={true}
                            disabled={true}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='medium'
                            on={false}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='small'
                            on={undefined}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                    </div>
                    <div className='flex flex-row items-end space-x-[19px]'>
                        <IconButton
                            size='large'
                            on={status.ovice_mic_on}
                            disabled={!status.ovice_has_mic}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='large'
                            on={status.ovice_screenshare_on}
                            disabled={!status.ovice_has_screenshare}
                            OnIcon={<ScreenIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='medium'
                            disabled={status.ovice_place_type === 'none'}
                            OnIcon={<FocusIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='medium'
                            disabled={!rest}
                            OnIcon={<CoffeeIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <IconButton
                            size='medium'
                            disabled={!leave}
                            OnIcon={<LogoutIcon />}
                            onClick={() => {
                                console.log('click')
                            }}
                        />
                        <PrivateStatus
                            label='room'
                            size='large'
                            OnIcon={<LockIcon />}
                            OffIcon={<UnLockIcon />}
                            on={true}
                        />
                        <PrivateStatus
                            label='public'
                            size='large'
                            OnIcon={<LockIcon />}
                            OffIcon={<UnLockIcon />}
                            on={false}
                        />
                        <PrivateStatus
                            label='public'
                            size='medium'
                            OnIcon={<LockIcon />}
                            OffIcon={<UnLockIcon />}
                            on={true}
                        />
                        <PrivateStatus
                            label='public'
                            size='small'
                            OnIcon={<LockIcon />}
                            OffIcon={<UnLockIcon />}
                            on={true}
                        />
                    </div>
                </Layout>
            </>
        )
    }, [
        tabId,
        rest,
        leave,
        mic,
        setMic,
        screenShare,
        setScreenShare,
        hasMic,
        hasScreenShare,
    ])
}

export default Pages
