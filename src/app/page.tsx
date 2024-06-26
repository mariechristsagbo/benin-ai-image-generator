"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className='text-white h-screen bg-no-repeat bg-cover bg-[url("https://s.rfi.fr/media/display/dfedfd3a-3f03-11ed-81a9-005056bf30b7/w:1280/p:16x9/000_32JN7YL.jpg")] bg-center'>
      <div className=" bg-black bg-opacity-40 h-screen w-full">
        <div className="space-y-20 flex flex-col justify-center h-screen max-w-homepageblock mx-auto px-4">
          <h1 className="text-3xl font-bold max-w-[20em] lg:text-4xl">
            The Future of Benin Local Languages is Here With AI Technology
          </h1>
          <p className="max-w-[50em] lg:text-lg xl:text-2xl">
            Generating culturally relevant images from local languages such as
            Fon and Yoruba, to improve cultural accessibility and preservation
            of Benin&apos;s languages.
          </p>

          <button
            className="bg-mainColor lg:w-[38em] text-white py-2 px-3 rounded-full cursor-pointer text-lg font-semibold"
            onClick={() => router.push("/chat")}
          >
            Get started
          </button>
        </div>
      </div>
    </main>
  );
}
