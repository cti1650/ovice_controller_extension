import { VFC } from 'react'
import cc from 'classcat'

type Props = {
    label: string
    position?: 'left' | 'right' | 'center'
    dark?: boolean
}

export const Title: VFC<Props> = ({ label, position, dark }) => {
    return (
        <>
            <div
                className={cc([
                    'flex flex-row mt-2 mb-[18px]',
                    {
                        'justify-start items-center': position === 'left',
                        'justify-end items-center': position === 'right',
                        'justify-evenly items-center':
                            position !== 'left' && position !== 'right',
                    },
                ])}
            >
                <h1
                    className={cc([
                        'text-[14px] font-bold',
                        { 'text-gray-200': dark, 'text-gray-800': !dark },
                    ])}
                >
                    {label ?? 'タイトル'}
                </h1>
            </div>
        </>
    )
}
