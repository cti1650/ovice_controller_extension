import { useCallback, useMemo, VFC } from 'react'
import cc from 'classcat'

type Props = {
    OnIcon?: React.ReactNode
    OffIcon?: React.ReactNode
    on?: boolean | undefined
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    size?: 'small' | 'medium' | 'large' | undefined
    title?: string
    disabled?: boolean
}

export const IconButton: VFC<Props> = ({
    OnIcon,
    OffIcon,
    on,
    onClick,
    size,
    title,
    disabled,
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
                <div>
                    <button
                        onClick={handleClick}
                        disabled={disabled}
                        title={title}
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
                        ])}
                    >
                        {on ? OnIcon : OffIcon || OnIcon}
                    </button>
                </div>
            </>
        )
    }, [on, disabled, OnIcon, OffIcon, onClick, size, title])
}
