import React from 'react'
import { BsChatLeftText } from "react-icons/bs";

const Suggestions = () => {

        const textArray = [
          "Vǐ wè ɖò ayihunhun ɖu wɛ ɖò atín e è nɔ ylɔ ɖɔ mangá é glɔ",
          "vi ɖe lε nɔ kplɔn nu ɖo azɔmε ɖo nuvi yetɔn sin nukɔn",
          "idile Afirika ni imura ibile",
          "a lẹwa starry ọrun ni alẹ",
        ];

  return (
    <div className='max-w-[45em] mx-auto text-black my-10'>

            <h1 className='font-bold px-5 my-4 text-lg'>Suggestions</h1>
        
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-8 px-4'>
                {textArray.map((text, index) => (
                     <div key={index} className='border border-grey max-w-card rounded-xl p-3 px-4 hover:bg-gray-100'>
                         <p>{text}</p>
                    </div>
                 ))}
            </div>

          <div className='flex items-center gap-5 w-full px-4'>

            <input 
                type="text" 
                className='w-11/12 border my-4 rounded-xl bg-gray-50 py-3 px-5 outline-none'
                placeholder='Write your prompt'
            /> 

            <button className='bg-mainColor text-white py-2 px-3 rounded-lg cursor-pointer text-lg'>
                Generate
            </button>
        </div>
    </div>
  )
}

export default Suggestions
