import { VFC } from 'react';

type Props = {
  label: string
}

export const Title: VFC<Props> = (props) => {
  const { label } = props
  return (
    <>
      <div className="mt-2 mb-0.5">
        <h1 className="text-gray-200 text-lg font-extrabold">{label ?? 'タイトル'}</h1>
      </div>
    </>
  )
}