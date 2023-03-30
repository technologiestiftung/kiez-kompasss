import { useState, useRef, useEffect } from "react";

export const QueryInput = ({ setGeoData }) => {
  const textDivRef = null;
  const [productInput, setProductInput] = useState("");
  const [result, setResult] = useState(() => "");
  const [isLoading, setIsLoading] = useState(false);

  function findEmoji(tags) {
    console.log(tags, result);
    let matchingEmoji = "";
    for (const key in tags) {
      const tagKey = key + "=" + tags[key];

      for (const keyy in result) {
        console.log(result[keyy], " ", tagKey);

        console.log(result[keyy].tag, " ", tagKey);
        if (result[keyy].tag.includes(tagKey)) {
          matchingEmoji = result[keyy].emoji;
        }
      }
    }

    return matchingEmoji;
  }

  function parseOverpassData(d) {
    let geoJSON = {
      type: "FeatureCollection",
      features: [],
    };
    const elements = d.elements;
    elements.forEach((e) => {
      const feat = {
        type: "Feature",
        properties: e.tags || {},
        geometry: {
          coordinates: [e.lon || e?.center?.lon, e.lat || e?.center?.lat],
          type: "Point",
        },
      };
      console.log("ÄÄÄÄÄÄÄÄ", e.tags);
      feat.properties.emoji = findEmoji(e.tags);
      geoJSON.features.push(feat);
    });
    setGeoData(geoJSON.features);
  }

  function queryOverpass(d) {
    const data = JSON.parse(d);
    const baseUrl =
      "https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(";
    const bbox =
      "52.52804962287233,13.376691341400146,52.53917045060706,13.388965129852295";

    let tagQuerries = "";
    for (const property in data) {
      const tag = data[property].tag;
      const tagQuery = `node[${tag}](${bbox});way[${tag}](${bbox});relation[${tag}](${bbox});`;
      tagQuerries += tagQuery;
    }

    const endURL = `);out center;`;

    const query = baseUrl + tagQuerries + endURL;

    console.log("query", query);

    fetch(query)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        parseOverpassData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function onSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: productInput }),
    });
    const data = await response.json();
    console.log("data", data);
    console.log("data.result", data.result);

    let rawResult = data.result;
    console.log("rawResult", rawResult);

    // let rawResult = {
    //   amenity: {
    //     tag: "amenity=theatre",
    //     description: "A place where people can watch performances",
    //     emoji: "🎭",
    //     help: "Going to the theatre is a great way to get out of the house and enjoy some entertainment. ",
    //   },
    //   leisure: {
    //     tag: "leisure=playground",
    //     description: "A place for children to play",
    //     emoji: "🤸",
    //     help: "Heading to the playground is a great way to get some exercise, have some fun and meet new people. ",
    //   },
    //   shop: {
    //     tag: "shop=comic_book",
    //     description: "A shop that sells comic books",
    //     emoji: "📖",
    //     help: "Checking out a comic book store is a great way to get your imagination going and explore some new stories. ",
    //   },
    // };

    // set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
    setResult(rawResult);

    queryOverpass(rawResult);

    setProductInput("");
    setIsLoading(false);
  }

  return (
    <div>
      <main
        className="flex flex-col 
                    items-center justify-center m-20"
      >
        <h3 className="text-slate-900 text-xl mb-3">Kiez Kompass</h3>
        <form onSubmit={onSubmit}>
          <input
            className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
            type="text"
            name="product"
            placeholder="Enter a product name"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
          />

          <button
            className="text-sm w-full bg-fuchsia-600 h-7 text-white
                              rounded-2xl mb-10"
            type="submit"
          >
            Run Query
          </button>
        </form>
        {isLoading ? (
          <p>Loading... be patient.. may take 30s+</p>
        ) : result ? (
          <div className="relative w-2/4 ">
            <div
              ref={textDivRef}
              className="rounded-md border-spacing-2 border-slate-900 bg-slate-100 break-words max-w-500 overflow-x-auto  "
            >
              <pre className="">
                <code
                  className=""
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </pre>
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer copy-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-copy"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
              </svg>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
