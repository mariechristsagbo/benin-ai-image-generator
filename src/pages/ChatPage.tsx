"use client";
import Image from 'next/image';
import Suggestions from '../app/components/Suggestions'
import { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { translate } from "../app/actions";
import Dropdown from "../app/components/Dropdown"

type Generation = {
  prompt: string;
  image: string;
};

  const ChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRequested, setHasRequested] = useState(false);

  const generateImage = async () => {
    setError("");
    setLoading(true);
    setHasRequested(true);

    const translatedPrompt = await translate(prompt);
    console.log(translatedPrompt);
    const formData = {
      prompt: translatedPrompt,
      output_format: "webp",
    };
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer sk-2qvON1cu0DukGmmy1yobxPDUqdSq6jG9a9Ls61433fQJgqj`,
          Accept: "image/*",
        },
      }
    );
    setLoading(false);
    if (response.status === 200) {
      const arrayBuffer = response.data;
      const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      console.log("imageUrl: ", url);
      setGenerations([...generations, { prompt, image: url }]);
      // URL.revokeObjectURL(url);
      setPrompt("");
    } else if (response.status === 403) {
      setError(
        "Your request was flagged by our content moderation system, as a result your request was denied. Enter another prompt."
      );
    } else if (response.status === 429) {
      setError("The server is busy now. Try again in two minutes.");
    // } else if (response.status === 401) {
    //   setError("Please, try again later");
    } else if (response.status === 402) {
      setError("Payment required to generate image. Contact app creators.");
    } else {
      setError(
        "An error occurred while generating the image. Please try again."
      );
      // throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  };

  return (
    <>
        <div className='flex flex-col max-w-3xl mx-auto h-screen'>
        
             <div className='max-w-2xl mx-auto my-4'>
                <h1 className='font-bold text-5xl text-center py-3'>BenAI Image <span className='text-mainColor'>Generator</span></h1>
                <p className='text-lg text-center font-medium'>What image can I help you generate today ?</p>
             </div>

            <div className='my-2 px-4 flex justify-between'>
                <p>Choose your language</p>
                <Dropdown/>
            </div>

              <div className='h-[60em]'>
        
        <div className="grow my-2 overflow-auto text-black px-4 w-full lg:w-1/2">

       {generations.length > 0 ? (
          generations.map((generation, index) => (
            <GenerationView
              key={index}
              prompt={generation.prompt}
              image={generation.image}
            />
          ))
        ) : (
                    <p className=" font-semibold">Your generations will appear here</p>
      )}
      </div>
              </div>
        
          
            <div>

            {hasRequested ? null : <Suggestions />}

            <div className='flex items-center sm:gap-5 w-full px-4 sm:flex-row flex-col'>

              <input 
                value={prompt}
                onChange={(e) => {
                setPrompt(e.target.value);
                }}
                type="text"
                name="prompt"
                id="prompt"   
                className='sm:w-11/12 w-full border my-4 rounded-xl bg-gray-50 py-3 px-5 outline-none'
                placeholder='Write your prompt'
              />    

                <button 
                  disabled={prompt === ""}
                  onClick={() => generateImage()}
                  className='bg-mainColor text-white py-2 px-3 my-5 sm:my-0 hover:bg-green-400 rounded-lg cursor-pointer text-md w-full sm:w-2/12'>
                   Generat{loading ? "ing..." : "e"}
                </button>
          </div>

        </div>
        </div>

        
    </>
  )
}

export default ChatPage

interface GenerationProps {
    prompt: string;
    image: string;
  }
  
  function GenerationView({ prompt, image }: GenerationProps) {
    return (
      <div>
        <p className="font-bold text-lg text-left">{prompt}</p>
        <Image
          src={image}
          alt={prompt}
          width={400}
          height={400}
          className="mb-4"
        />
      </div>
    );
  }