import { VFC } from 'react';
import cc from 'classcat';

type ButtonsItem = {
  label: string,
  onClick: (any) => void,
  className?: string,
  on?: boolean,
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
          const { label, onClick, className, on } = button
          return (
            <button onClick={onClick} className={cc([
              "py-1 text-white rounded-lg focus:outline-none",
              {
                "focus:text-green-400 bg-green-700 border border-gray-500 focus:border-green-400": on,
                "focus:text-red-400 bg-red-700 border border-gray-500 focus:border-red-400": !on,
              }
            ])}>{label}</button>
          )
        })}
      </div>
    </>
  )
}