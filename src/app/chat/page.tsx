"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { translate } from "../actions";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

type Generation = {
  prompt: string;
  image: string;
};

const fonSuggestions = [
  "Foto-kpɔnkpɔn e ɖè glesi Benɛ tɔn ɖé e ɖò atín sín gle ɖé mɛ ɖò hwesivɔ Aflika tɔn e nɔ hwesivɔ é mɛ é",
  "Nǔɖexlɛ́mɛ ɖé ɖò nùnywɛ xwitixwiti mɛ e xlɛ́ xwédo Bénin tɔn ɖé e ɖò azɔ̌ wa wɛ ɖò gle ɔ mɛ é",
  "Gletoxo Benin tɔn ɖé wɛ, bɔ è nɔ dó sɛ́n lɛ́ɛ, bo nɔ dó xá lɛ",
  "Tɔsisa Viktɔ́ya tɔn ɖaxó ɔ ɖò jɔhɔn ɖaxó ɖé jí",
];

const yorubaSuggestions = [
  "Fí àwòrán àwòròsán kan tí ń ṣe àwòkó ẹ̀wú ní pápá ilẹ̀ lábé òòrùn Àfríkà tó gbóná",
  "Fí àwòrán pैनोरamik kan ti àwọn eti okun ẹlẹ́wà ti Grand Popo, Bẹ̀nín, pẹ́lú igi òpẹ́ tó ń yágàn ní ìjì",
  "Kun oju iṣẹlẹ ti awọn ara abule ti n ṣiṣẹ papọ ni isokan, titọju si awọn irugbin ati pinpin imọ, ti o ni ẹmi ti ogbin agbegbe",
  "Fí àwòrán kan ti àwọn arìnrìn àjò kan tí ń gbádùn ìrìn àjò bákan láti inú òdotun Bẹ̀nín, tí àwọn igbo òkè tí ó wúfù yí wa",
];

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitingVisible, setWaitingVisible] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [language, setLanguage] = useState("fon");
  const suggestions = language === "fon" ? fonSuggestions : yorubaSuggestions;
  const apiKeys = [
    "sk-xhnOGJwpzdpk7rLQxmTRez5ldv5oG38RbT6QUZqf6IFCOGRp",
    "sk-1aiQS8vzQ30FskcR3xEH6Qs21OvOJ80azFfoDSSsqwH5xYrL",
    "sk-ivvT1qvBQZNAZOtFiMb5ZwD6oBJdvu0E1vhuyeplwmInKWcr",
  ];
  let currentKeyIndex = 0;

  const generateImage = async () => {
    setError("");
    setLoading(true);
    setSuggestionsVisible(false);
    setWaitingVisible(true);

    const englishPrompt = await translate(language, prompt);
    // console.log(englishPrompt);
    const formData = {
      prompt: englishPrompt,
      output_format: "webp",
    };
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${apiKeys[currentKeyIndex]}`,
          Accept: "image/*",
        },
      }
    );
    setLoading(false);
    if (response.status === 200) {
      const arrayBuffer = response.data;
      const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      // console.log("imageUrl: ", url);
      setGenerations([...generations, { prompt, image: url }]);
      // URL.revokeObjectURL(url);
      setWaitingVisible(false);
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
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      if (currentKeyIndex === 0) {
        setError("Payment required to generate image. Contact app creators.");
      } else {
        // retry to generate the image
        generateImage();
      }
    } else {
      setError(
        "An error occurred while generating the image. Please try again."
      );
      // throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between max-w-3xl mx-auto h-[100vh] py-2 px-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-extrabold lg:text-5xl sm:text-4xl text-3xl text-center">
            <a href="/">BeninGbe2Image</a>
          </h1>
          <p className="text-lg text-center font-medium">
            What image can I help you generate today ?
          </p>
          <div className="flex justify-center gap-8">
            <div>
              <label className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="fon"
                  checked={language === "fon"}
                  onChange={() => setLanguage("fon")}
                />
                Fon
              </label>
            </div>
            <div>
              <label className="flex gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="yoruba"
                  checked={language === "yoruba"}
                  onChange={() => setLanguage("yoruba")}
                />
                Yoruba
              </label>
            </div>
          </div>
          <p className="text-red-600">{error}</p>
        </div>

        <div className="grow overflow-auto my-2">
          <div className="text-black w-full flex flex-col gap-4">
            {generations.length > 0 ? (
              generations.map((generation, index) => (
                <GenerationView
                  key={index}
                  prompt={generation.prompt}
                  image={generation.image}
                />
              ))
            ) : (
              <p className="font-semibold">Your generations will appear here</p>
            )}
          </div>

          {/* Loading Animation */}
          {waitingVisible && (
            <div className="flex items-center gap-2 px-4 my-4 mx-4">
              <span className="h-3 w-3 rounded-full bg-gray-500 animate-pulse"></span>
              <span className="h-3 w-3 rounded-full bg-gray-500 animate-pulse"></span>
              <span className="h-3 w-3 rounded-full bg-gray-500 animate-pulse"></span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-black max-w-3xl">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg">Suggestions</h1>
              <button
                onClick={() => setSuggestionsVisible(!suggestionsVisible)}
              >
                {suggestionsVisible ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>

            {suggestionsVisible && (
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 max-h-[300px] overflow-auto">
                {suggestions.map((text, index) => (
                  <div
                    key={index}
                    className="border border-grey max-w-card rounded-xl p-3 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setPrompt(text)}
                  >
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center w-full lg:flex-row flex-col gap-2 lg:gap-4">
            <input
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              type="text"
              name="prompt"
              id="prompt"
              className="border rounded-xl bg-gray-50 py-2 px-5 outline-none w-full lg:grow"
              placeholder={`Enter your ${language} prompt here`}
            />

            <button
              disabled={prompt === ""}
              onClick={() => generateImage()}
              className="bg-mainColor text-white py-2 px-3 hover:bg-green-400 rounded-lg cursor-pointer text-md w-full lg:w-auto"
            >
              Generat{loading ? "ing..." : "e"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface GenerationProps {
  prompt: string;
  image: string;
}

function GenerationView({ prompt, image }: GenerationProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <p className="bg-mainColor text-white rounded-lg px-4 py-2 shadow-md w-fit">
          {prompt}
        </p>
      </div>
      <Image src={image} alt={prompt} width={400} height={400} className="" />
    </div>
  );
}
