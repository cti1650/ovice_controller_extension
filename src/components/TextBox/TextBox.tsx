import { useCallback, useEffect, useState, VFC } from 'react';

type Props = {
  value: string,
  onChange: (string) => void,
  label: string,
  placeholder?: string,
  holder?: string
}

export const TextBox: VFC<Props> = (props) => {
  const { value, onChange, label, placeholder, holder } = props
  const [keyword, setKeyword] = useState(()=>{
    return value
  })

  const handleChange = useCallback((event) => {
    holder && localStorage.setItem(holder, event.target.value)
    setKeyword(prev => {
      const next = event.target.value
      if (prev !== next) {
        onChange(next)
        return next;
      }
    })
  },[keyword,onChange])

  useEffect(()=>{
    if(keyword === ''){
      const local = localStorage.getItem(holder) || '';
      if(holder){
        setKeyword(prev => {
          const next = local
          if (prev !== next) {
            onChange(next)
            return next;
          }
        })
      }
    }
  },[keyword])
  
  return (
    <>
      <div className="mt-2 mb-0.5 text-gray-400 text-xs"><label>{label ?? 'ラベル'}</label></div>
      <div>
        <input
          type='text'
          placeholder={placeholder ?? ''}
          onChange={handleChange}
          value={keyword ?? ''}
          className='w-full px-4 py-1 text-white focus:text-black rounded-lg border border-gray-600 bg-gray-800 focus:bg-gray-200 focus:outline-none'
        ></input>
      </div>
    </>
  )
}