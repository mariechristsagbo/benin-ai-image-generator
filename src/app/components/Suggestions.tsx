import React from 'react'

const Suggestions = () => {

        const textArray = [
          "Vǐ wè ɖò ayihunhun ɖu wɛ ɖò atín e è nɔ ylɔ ɖɔ mangá é glɔ",
          "vi ɖe lε nɔ kplɔn nu ɖo azɔmε ɖo nuvi yetɔn sin nukɔn",
          "Hwetɔ́n è nɔ mɔ ɖɔ è ɖò mɔ̌ bló wɛ é ɔ, è nɔ mɔ ɖɔ è ɖò nǔ wà wɛ",
          "Tɔsisa Viktɔ́ya tɔn ɖaxó ɔ ɖò jɔhɔn ɖaxó ɖé jí",
        ];

  return (

    <div className='text-black my-5 max-w-3xl mt-auto mx-auto'>

            <h1 className='font-bold px-5 my-4 text-lg'>Suggestions</h1>
        
            <div className='grid sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 px-4'>
                {textArray.map((text, index) => (
                     <div key={index} className='border border-grey max-w-card rounded-xl p-3 px-4 hover:bg-gray-100'>
                         <p>{text}</p>
                    </div>
                 ))}
            </div>
    </div>
  )
}

export default Suggestions
