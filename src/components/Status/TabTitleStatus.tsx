import { useMemo, VFC } from 'react'
import { tabTitleState } from '@components/Recoil'
import { useRecoilValue } from 'recoil'

export const TabTitleStatus: VFC = () => {
    const tabTitle = useRecoilValue(tabTitleState)
    return useMemo(
        () => (
            <div className='mt-3 w-full break-all text-[10px] text-[#B8B8B8] font-light text-right tracking-wider'>
                {`space : ${tabTitle.replace(' | oVice', '') || 'none'}`}
            </div>
        ),
        [tabTitle]
    )
}
