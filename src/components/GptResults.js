import { useState, useRef, useEffect } from "react";

export const GptResults = ({ resultGPT, geoData, productInput }) => {
  const [resultGPTParsed, setResultGPTParsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultSzenarioText, setResultSzenarioText] = useState(false);

  useEffect(() => {
    if (resultGPT) {
      setResultGPTParsed(JSON.parse(resultGPT));
    }
  }, [resultGPT]);

  async function pickSzenario(item) {
    console.log(item, geoData);

    setIsLoading(true);

    const emoji = item.emoji;

    const filteredgeoData = [];
    geoData.forEach((d) => {
      if (d.properties.emoji == emoji) {
        filteredgeoData.push(d.properties);
      }
    });
    const response = await fetch("/api/szenario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        szenarioText: productInput,
        data: filteredgeoData,
      }),
    });
    const data = await response.json();

    setIsLoading(false);

    setResultSzenarioText(data.result);

    console.log(data);
  }

  return (
    <div className="py-4 w-3/4">
      {resultGPTParsed && (
        <>
          <h3 className="py-4 font-bold">
            Hier sind ein paar Sachen die du machen könntest. Suche dir ein aus:
          </h3>

          <ul>
            {Object.keys(resultGPTParsed).map((item, i) => (
              <li
                className="flex py-2 hover:bg-black/30 cursor-pointer"
                key={`${"item-" + i}`}
                onClick={() => pickSzenario(resultGPTParsed[item])}
              >
                <p className="mr-2 text-2xl p-2 w-10 h-10 border rounded-full justify-center items-center tex-center flex">
                  {resultGPTParsed[item].emoji}
                </p>

                <p className="content-center grid">
                  {resultGPTParsed[item].help}
                </p>
              </li>
            ))}
          </ul>

          {isLoading ? <p>Loading...</p> : null}

          {resultSzenarioText ? (
            <p className="py-4">{resultSzenarioText}</p>
          ) : null}
        </>
      )}
    </div>
  );
};
