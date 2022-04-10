import { VFC } from 'react';

type ButtonsItem = {
  label: string,
  onClick: (any) => void,
}

type Props = {
  label: string,
  buttons?: ButtonsItem[],
}

export const Buttons: VFC<Props> = (props) => {
  const { label, buttons } = props
  return (
    <>
      <div className="mt-2 mb-0.5 text-gray-400 text-xs"><label>{label}</label></div>
      <div className="grid grid-cols-2 space-x-2">
        {buttons && buttons.map((button, index) => {
          const { label, onClick } = button
          return (
            <button onClick={onClick} className="py-1 text-white focus:text-blue-400 bg-gray-700 border border-gray-500 focus:border-blue-400 rounded-lg focus:outline-none">{label}</button>
          )
        })}
      </div>
    </>
  )
}