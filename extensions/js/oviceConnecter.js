;((global) => {
    const oviceConnecterClass = () => {
        let data = {
            title: document.title.replace(' | oVice', ''),
            url: document.URL,
            userName:
                document?.getElementById('userName')?.value ?? 'anonymous',
            newChatMessageCount:
                Number(
                    document?.querySelector('div#chat-button > span.counter')
                        ?.textContent || '0'
                ) ||
                Number(
                    document?.querySelector(
                        'span.MuiBadge-badge:not(.MuiBadge-invisible)'
                    )?.textContent || '0'
                ),
            hasLogout:
                !!document?.querySelector('#leave-openspace-block') ||
                !!document?.querySelector(
                    '.MuiBox-root > button.MuiIconButton-root.MuiIconButton-colorInfo:last-child'
                ),
            hasOpenSpace:
                !!document?.querySelector('#leave-room-block') ||
                !!document?.querySelector(
                    '.MuiBox-root > button.MuiIconButton-root.MuiIconButton-colorInfo:last-child'
                ),
            hasLeave:
                !!document?.querySelector('#leave-openspace-block') ||
                !!document?.querySelector('#leave-room-block') ||
                !!document?.querySelector(
                    '.MuiBox-root > button.MuiIconButton-root.MuiIconButton-colorInfo:last-child'
                ),
            hasCoffee:
                !!document?.querySelector('#away-block') ||
                !!document?.querySelector('div#away.show') ||
                !![
                    ...document?.querySelectorAll('button.MuiIconButton-root'),
                ].filter((ele) => {
                    return (
                        ele?.querySelector('path')?.getAttribute('d') ===
                        'M9.9 17h4a5 5 0 0 0 5-5v-1h1a3 3 0 0 0 0-6h-1V4a1 1 0 0 0-1-1h-12a1 1 0 0 0-1 1v8a5 5 0 0 0 5 5Zm9-10h1a1 1 0 1 1 0 2h-1V7Zm-12-2h10v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5Zm15 14h-18a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z'
                    )
                }).length,
        }
        data.getChatMessage = () => {
            messageList = []
            document.querySelectorAll('div#chat-scroll > div').forEach((el) => {
                const messageData = {
                    name:
                        el?.querySelector('.name')?.textContent ||
                        data?.userName ||
                        '',
                    message:
                        el?.querySelector('.break-space')?.textContent.trim() ||
                        '',
                    time:
                        el
                            ?.querySelector('.time-message')
                            ?.textContent.trim() || '',
                }
                messageList.push(messageData)
            })
            return messageList
        }

        // oViceの画面状況を取得する
        if (document.URL.includes('@room_id-')) {
            data = {
                ...data,
                ...{
                    placeType: 'room',
                },
            }
        } else {
            const placeType_ele =
                document.querySelector('#away.show') ||
                document.querySelector(
                    'div.MuiDialog-root div.MuiDialog-paperWidthXs'
                )
            if (placeType_ele) {
                data = {
                    ...data,
                    ...{
                        placeType: 'resting',
                    },
                }
            } else {
                data = {
                    ...data,
                    ...{
                        placeType: 'openspace',
                    },
                }
            }
        }

        // 画面共有のステータスを取得する
        const screenshare_ele = document?.querySelector(
            '#screenshare-block > div'
        )
        if (screenshare_ele) {
            data = {
                ...data,
                ...{
                    hasScreenshare: true,
                    screenshareState:
                        !!screenshare_ele?.querySelector('i.bar-device-on'),
                },
            }
        } else {
            const eleList = document?.querySelectorAll(
                '.dynamic-object-element'
            )
            if (eleList && eleList.length) {
                const optionMenu = [...eleList].filter((ele) => {
                    return ele
                        ?.querySelector('img')
                        ?.['src']?.includes('screenshare')
                })
                data = {
                    ...data,
                    ...{
                        hasScreenshare: !!optionMenu.length,
                        screenshareState:
                            !!optionMenu?.[0]?.querySelector('i.bar-device-on'),
                    },
                }
            } else {
                const screenshare_ele = document?.querySelector(
                    'button[aria-label=screenshare]'
                )
                if (screenshare_ele) {
                    data = {
                        ...data,
                        ...{
                            hasScreenshare: data.placeType !== 'resting',
                            screenshareState:
                                !![...screenshare_ele.classList].filter((v) => {
                                    return v === 'MuiIconButton-colorInfo'
                                }).length || false,
                        },
                    }
                } else {
                    data = {
                        ...data,
                        ...{
                            hasScreenshare:
                                data.placeType !== 'resting' &&
                                !!document?.querySelector(
                                    'button[aria-label=other]'
                                ),
                            screenshareState:
                                !!document?.querySelectorAll(
                                    'div.react-draggable button.MuiIconButton-root.MuiIconButton-colorError'
                                ).length || false,
                        },
                    }
                }
            }
        }

        // マイクのステータスを取得する
        const mic_ele = document?.querySelector('#mic-block > div')
        if (mic_ele) {
            if (mic_ele.querySelector('.bar-device-off')) {
                data = {
                    ...data,
                    ...{
                        hasMic: true,
                        micState: false,
                    },
                }
            }
            if (mic_ele.querySelector('.bar-device-on')) {
                data = {
                    ...data,
                    ...{
                        hasMic: true,
                        micState: true,
                    },
                }
            }
        } else {
            const mic_ele = document?.querySelector(
                'button[aria-label=microphone]'
            )
            if (mic_ele) {
                data = {
                    ...data,
                    ...{
                        hasMic: data.placeType !== 'resting',
                        micState:
                            mic_ele.getAttribute('data-status') === 'true' ||
                            false,
                    },
                }
            } else {
                data = {
                    ...data,
                    ...{
                        hasMic: false,
                        micState: false,
                    },
                }
            }
        }

        // oViceの退室ボタンをクリックする
        data.leave = () => {
            const ele =
                document?.querySelector('#leave-openspace-block') ||
                document?.querySelector('#leave-room-block') ||
                document?.querySelector(
                    '.MuiBox-root > button.MuiIconButton-root.MuiIconButton-colorInfo:last-child'
                ) ||
                document?.querySelector('#away-block')
            if (ele) {
                ele['click']()
            }
        }

        // oViceの離席ボタンをクリックする
        data.rest = () => {
            if (data.placeType === 'resting') {
                // 離席中は離席を解除する
                const ele = document?.querySelector(
                    'div#away.show button.btn-dark'
                )
                if (ele) {
                    ele['click']()
                } else {
                    const restExitButton = document.querySelector(
                        'div.MuiDialog-root div.MuiDialog-paperWidthXs button.MuiButton-contained'
                    )
                    if (restExitButton) {
                        restExitButton['click']()
                    }
                }
            } else {
                // 離席中でない場合は離席する
                const ele = document?.querySelector('#away-block')
                if (ele) {
                    ele['click']()
                } else {
                    // 新UIで離席ボタンの判断が難しいので、アイコンを探してクリックする処理にて実装
                    const eleList = document?.querySelectorAll(
                        'button.MuiIconButton-root'
                    )
                    if (eleList && eleList.length) {
                        const optionMenu = [...eleList].filter((ele) => {
                            return (
                                ele.querySelector('path')?.getAttribute('d') ===
                                'M9.9 17h4a5 5 0 0 0 5-5v-1h1a3 3 0 0 0 0-6h-1V4a1 1 0 0 0-1-1h-12a1 1 0 0 0-1 1v8a5 5 0 0 0 5 5Zm9-10h1a1 1 0 1 1 0 2h-1V7Zm-12-2h10v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5Zm15 14h-18a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z'
                            )
                        })
                        if (optionMenu.length) {
                            optionMenu[0]['click']()
                        }
                    }
                }
            }
        }

        // oViceの画面共有ボタンをクリックする
        data.screenShare = () => {
            const ele =
                document?.querySelector('#screenshare-block > div') ||
                document?.querySelector('button[aria-label=screenshare]')
            if (ele) {
                ele['click']()
            } else {
                const eleList = document?.querySelectorAll(
                    '.dynamic-object-element'
                )
                if (eleList && eleList.length) {
                    eleList.forEach((ele) => {
                        if (ele?.querySelector('img')) {
                            if (
                                [...ele?.querySelectorAll('img')].filter(
                                    (item) =>
                                        item?.['src']?.includes('screenshare')
                                ).length !== 0
                            ) {
                                ele['click']()
                            }
                        }
                    })
                } else {
                    // 新UI用に共有ウィンドウのボタンで画面共有状況を判断し切り替え処理を行う
                    const screenSharePopupExitButton =
                        document?.querySelectorAll(
                            'div.react-draggable button.MuiIconButton-root.MuiIconButton-colorError'
                        )
                    if (screenSharePopupExitButton.length) {
                        screenSharePopupExitButton[0]['click']()
                    } else {
                        const screenshare_ele = document?.querySelector(
                            'button[aria-label=other]'
                        )
                        if (screenshare_ele) {
                            screenshare_ele['click']()
                            const screenshare_button = document.querySelector(
                                'li[aria-label=screenshare-plugin]'
                            )
                            if (screenshare_button) {
                                screenshare_button['click']()
                            }
                        }
                    }
                }
            }
        }

        // oViceのマイクボタンをクリックする
        data.mic = () => {
            const ele =
                document?.querySelector('#mic-block > div') ||
                document?.querySelector('button[aria-label=microphone]')
            if (ele) {
                ele['click']()
            }
        }
        return data
    }
    global.oviceConnecter = oviceConnecterClass
})(window)
