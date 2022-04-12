import { useCallback, useMemo, VFC } from 'react'
import cc from 'classcat'

type ClassNamesType = {
    root?: string
    icon?: string
    label?: string
}

type Props = {
    label: string
    OnIcon: React.ReactNode
    OffIcon?: React.ReactNode
    NoneIcon?: React.ReactNode
    on?: boolean
    size?: 'small' | 'medium' | 'large'
    classNames?: ClassNamesType
}

const replaceLabel = (label?: string) => {
    switch (label) {
        case 'room':
            return 'room'
        case 'openspace':
            return 'public'
        case 'none':
            return 'closed'
        default:
            return label
    }
}

export const PrivateStatus: VFC<Props> = ({
    label,
    OnIcon,
    OffIcon,
    NoneIcon,
    on,
    size,
    classNames,
}) => {
    const selectIcon = useCallback(
        (label?: string) => {
            switch (label) {
                case 'room':
                    return OnIcon
                case 'openspace':
                    return OffIcon || OnIcon
                case 'none':
                    return NoneIcon || OnIcon
                default:
                    return NoneIcon || OnIcon
            }
        },
        [label, OnIcon, OffIcon, NoneIcon]
    )
    return useMemo(() => {
        return (
            <>
                <div
                    className={cc([
                        'flex flex-col justify-center items-center',
                        classNames?.root,
                    ])}
                >
                    <div
                        className={cc([
                            'flex',
                            {
                                'text-[30px]': size === 'large',
                                'text-[18px]': size === 'small',
                                'text-[25px]':
                                    size !== 'large' && size !== 'small',
                            },
                            {
                                'text-[#FACC15]': on,
                                'text-[#CDCACA]': !on,
                            },
                            classNames?.icon,
                        ])}
                    >
                        {selectIcon(label)}
                    </div>
                    <label
                        className={cc([
                            'flex mt-[2px] text-[#B8B8B8] text-[10px]',
                            classNames?.label,
                        ])}
                    >
                        {replaceLabel(label) || 'Status'}
                    </label>
                </div>
            </>
        )
    }, [label, on, OnIcon, OffIcon, size, classNames])
}
