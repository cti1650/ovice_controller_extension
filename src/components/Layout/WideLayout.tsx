import { useMemo, VFC } from 'react'
import { Title } from '@components/Title'
import cc from 'classcat'

type ClassNamesType = {
    root?: string
    content?: string
}

type Props = {
    title: string
    children: React.ReactNode
    classNames?: ClassNamesType
}

export const WideLayout: VFC<Props> = ({ title, children, classNames }) => {
    return useMemo(
        () => (
            <>
                <div className={cc(['w-[400px]', classNames?.root])}>
                    <Title label={title} />
                    <div className={cc(['flex flex-col', classNames?.content])}>
                        {children}
                    </div>
                </div>
            </>
        ),
        [title, children, classNames]
    )
}
