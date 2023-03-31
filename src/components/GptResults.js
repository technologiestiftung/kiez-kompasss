import { useState, useRef, useEffect } from "react";

export const GptResults = ({ resultGPT }) => {
  const [resultGPTParsed, setResultGPTParsed] = useState(false);

  useEffect(() => {
    if (resultGPT) {
      setResultGPTParsed(JSON.parse(resultGPT));
    }
  }, [resultGPT]);

  return (
    <div className="py-4">
      <h3 className="py-4 font-bold">
        Hier sind ein paar Sachen die du machen könntest:
      </h3>

      {resultGPTParsed && (
        <ul>
          {Object.keys(resultGPTParsed).map((item, i) => (
            <li className="flex py-2" key={`${"item-" + i}`}>
              <p className="mr-2 text-2xl p-2 w-10 h-10 border rounded-full justify-center items-center tex-center flex">
                {resultGPTParsed[item].emoji}
              </p>
              <p className="content-center grid">
                {resultGPTParsed[item].help}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
