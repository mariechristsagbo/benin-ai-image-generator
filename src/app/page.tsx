"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import FormData from "form-data";
import { translate } from "./actions";

type Generation = {
  prompt: string;
  image: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setError("");
    setLoading(true);
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
          Authorization: `Bearer sk-dBypJQ7dv03gUIjiopBsboh1c4r1LU6p6sUjoRJgUw0h0Yk0`,
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
    <main className="flex h-screen flex-col items-center justify-between p-4 bg-[url('https://images.unsplash.com/photo-1600241005059-71de13374958?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <h1 className="font-bold text-yellow-300 text-center text-4xl">
        Benin AI Image Generator
      </h1>
      <p className="text-red-700 font-bold text-lg text-center">{error}</p>
      <div className="grow my-2 overflow-auto bg-[#0005] text-white px-4 w-full lg:w-1/2">
        {generations.length > 0 ? (
          generations.map((generation, index) => (
            <GenerationView
              key={index}
              prompt={generation.prompt}
              image={generation.image}
            />
          ))
        ) : (
          <p className="text-center">Your generations will appear here</p>
        )}
      </div>
      <div className="flex justify-between gap-2 w-full lg:w-1/2">
        <input
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          type="text"
          name="prompt"
          id="prompt"
          placeholder="Describe what you want to see"
          className="grow px-4 rounded-lg text-black"
        />
        <button
          className="text-green-500"
          disabled={prompt === ""}
          onClick={() => generateImage()}
        >
          Generat{loading ? "ing..." : "e"}
        </button>
      </div>
    </main>
  );
}

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
