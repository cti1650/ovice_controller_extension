import { VFC } from 'react';
import { Title } from '@components/Title';

type Props = {
  title: string,
  children: React.ReactNode
}

export const Layout: VFC<Props> = (props) => {
  const { title, children } = props
  return (
    <>
      <div className='my-1 mx-6 w-[370px]'>
        <Title label={title} />
        <div className='flex flex-col'>
          {children}
        </div>
      </div>
    </>
  )
}