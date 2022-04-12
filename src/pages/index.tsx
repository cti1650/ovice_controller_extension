import React, { useCallback, useMemo } from 'react'
import { Layout } from '@components/Layout'
import { useOviceMic } from 'src/hooks/useOvice'
import { IconButton } from '@components/Button'
import {
    ClosedIcon,
    CoffeeIcon,
    FocusIcon,
    LockIcon,
    LogoutIcon,
    OffMicIcon,
    OnMicIcon,
    ScreenIcon,
    UnLockIcon,
} from '@components/Icon'
import { PrivateStatus } from '@components/Status'

const Pages = () => {
    const {
        mic,
        active,
        status,
        close,
        coffee,
        openspace,
        screenshare,
        changeMic,
    } = useOviceMic()
    const handleClick = useCallback(
        (event) => {
            if (chrome && chrome.tabs) {
                changeMic(!mic)
            }
        },
        [mic, changeMic]
    )
    const handleMove = useCallback(
        async (event) => {
            if (chrome && chrome.tabs) {
                active()
            }
        },
        [active]
    )
    const handleClose = useCallback(
        async (event) => {
            if (chrome && chrome.tabs) {
                close()
            }
        },
        [close]
    )
    const handleCoffee = useCallback(
        async (event) => {
            if (chrome && chrome.tabs) {
                coffee()
            }
        },
        [coffee]
    )
    const handleOpenSpace = useCallback(
        async (event) => {
            if (chrome && chrome.tabs) {
                openspace()
            }
        },
        [openspace]
    )
    const handleScreenShare = useCallback(
        async (event) => {
            if (chrome && chrome.tabs) {
                screenshare()
            }
        },
        [screenshare]
    )
    return useMemo(() => {
        console.log(status)
        return (
            <>
                <Layout
                    title={'oVice Controller Extension'}
                    classNames={{ root: 'relative' }}
                >
                    <PrivateStatus
                        label={status?.ovice_place_type}
                        size='large'
                        OnIcon={<LockIcon />}
                        OffIcon={<UnLockIcon />}
                        NoneIcon={<ClosedIcon />}
                        on={status?.ovice_place_type === 'room' ? true : false}
                        classNames={{ root: 'absolute top-[-15px] right-0' }}
                    />
                    <div className='flex flex-row items-end space-x-[19px]'>
                        <IconButton
                            title='Operate The Mic'
                            size='large'
                            on={status?.ovice_mic_on}
                            disabled={!status?.ovice_has_mic}
                            OnIcon={<OnMicIcon />}
                            OffIcon={<OffMicIcon />}
                            onClick={handleClick}
                        />
                        <IconButton
                            title='Operate The Screen Share'
                            size='large'
                            on={status?.ovice_screenshare_on}
                            disabled={!status?.ovice_has_screenshare}
                            OnIcon={<ScreenIcon />}
                            onClick={handleScreenShare}
                        />
                        <IconButton
                            title='To The Front'
                            size='medium'
                            disabled={status?.ovice_place_type === 'none'}
                            OnIcon={<FocusIcon />}
                            onClick={handleMove}
                        />
                        <IconButton
                            title='Rest'
                            size='medium'
                            disabled={!status?.ovice_has_coffee}
                            OnIcon={<CoffeeIcon />}
                            onClick={handleCoffee}
                        />
                        <IconButton
                            title={
                                status?.ovice_has_openspace
                                    ? 'Leave The Room'
                                    : 'Leave The oVice'
                            }
                            size='medium'
                            disabled={
                                !status?.ovice_has_openspace &&
                                !status?.ovice_has_logout
                            }
                            OnIcon={<LogoutIcon />}
                            onClick={
                                status?.ovice_has_openspace
                                    ? handleOpenSpace
                                    : handleClose
                            }
                        />
                    </div>
                </Layout>
            </>
        )
    }, [
        status,
        mic,
        handleClick,
        handleMove,
        handleClose,
        handleCoffee,
        handleOpenSpace,
        handleScreenShare,
    ])
}

export default Pages
