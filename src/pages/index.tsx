import Head from "next/head";
// import Image from "next/image";
import { Inter } from "next/font/google";
import { QueryInput } from "../components/QueryInput";
import { MapComponent } from "../components/Map";
import { GptResults } from "../components/GptResults";

import { useState, useRef, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [geoData, setGeoData] = useState([]);
  const [queryBounds, setQueryBounds] = useState([]);
  const [resultGPT, setResultGPT] = useState(() => "");

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center">
        {/* <h1>Kiez Kompass</h1> */}
        <QueryInput
          setGeoData={setGeoData}
          queryBounds={queryBounds}
          resultGPT={resultGPT}
          setResultGPT={setResultGPT}
        />
        <GptResults resultGPT={resultGPT} />
        <div className="w-3/4 h-[400px]">
          <MapComponent markerData={geoData} setQueryBounds={setQueryBounds} />
        </div>
      </main>
    </>
  );
}
