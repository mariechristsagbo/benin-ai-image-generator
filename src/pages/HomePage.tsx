import Link from "next/link"

const HomePage = () => {
  return (

    <main className='text-white h-screen bg-no-repeat bg-cover bg-[url("https://s.rfi.fr/media/display/dfedfd3a-3f03-11ed-81a9-005056bf30b7/w:1280/p:16x9/000_32JN7YL.jpg")]'>
            <div className=' bg-black bg-opacity-40 h-screen w-full'>
                <div className='space-y-20 flex flex-col justify-center h-screen max-w-homepageblock mx-auto px-4'>
                <h1 className='text-3xl font-bold max-w-[14em]'>The Future of Chat is Here With AI Technology</h1>
                    <p className='max-w-[80em]'>"The future of chat is here with AI technology" implies that the integration of AI into chat technology is already happening and that it's an exciting development for the way we communicate. AI-powered chatbots are becoming increasingly sophisticated and are able to understand and respond to natural language,</p>
             <Link href="/ChatPage"><button className='bg-mainColor lg:w-[38em] text-white py-2 px-3 rounded-full cursor-pointer text-lg font-bold'>Get started</button></Link>   
             </div>
        </div>
    </main>

  )
}

export default HomePage
