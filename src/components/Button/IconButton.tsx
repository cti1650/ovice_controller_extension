import { useCallback, useMemo, VFC } from 'react'
import cc from 'classcat'

type ClassNamesType = {
    root?: string
    button?: string
    label?: string
}

type Props = {
    OnIcon?: React.ReactNode
    OffIcon?: React.ReactNode
    on?: boolean | undefined
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    size?: 'small' | 'medium' | 'large' | undefined
    title?: string
    tips?: string
    disabled?: boolean
    classNames?: ClassNamesType
}

export const IconButton: VFC<Props> = ({
    OnIcon,
    OffIcon,
    on,
    onClick,
    size,
    title,
    tips,
    disabled,
    classNames,
}) => {
    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event)
        },
        [onClick]
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
                    <button
                        onClick={handleClick}
                        disabled={disabled}
                        title={tips}
                        className={cc([
                            'flex justify-center items-center bg-[#F6F6F6] shadow rounded-full border border-[#E6E6E6]',
                            {
                                'w-[60px] h-[60px] text-[30px]':
                                    size === 'large',
                                'w-[30px] h-[30px] text-[13px]':
                                    size === 'small',
                                'w-[40px] h-[40px] text-[18px]':
                                    size !== 'large' && size !== 'small',
                            },
                            {
                                'text-[#E4E4E4] active:bg-[#F6F6F6]': disabled,
                                'text-[#91C699] active:bg-[#DFDFDF]':
                                    on === true && !disabled,
                                'text-[#E3342F] active:bg-[#DFDFDF]':
                                    on === false && !disabled,
                                'text-black active:bg-[#DFDFDF]':
                                    on === undefined && !disabled,
                            },
                            classNames?.button,
                        ])}
                    >
                        {on ? OnIcon : OffIcon || OnIcon}
                    </button>
                    {title && (
                        <label
                            className={cc([
                                'flex text-center mt-[2px] text-[#B8B8B8] text-[10px]',
                                classNames?.label,
                            ])}
                        >
                            {title}
                        </label>
                    )}
                </div>
            </>
        )
    }, [on, disabled, OnIcon, OffIcon, onClick, size, title])
}
