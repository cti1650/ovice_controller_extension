import '@styles/globals.css'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }) {
    return (
        <div className='bg-[#F8F8F8] p-[25px]'>
            <RecoilRoot>
                <Component {...pageProps} />
            </RecoilRoot>
        </div>
    )
}

export default MyApp
