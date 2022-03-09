async function parseFile(file, type) {
  const response = await fetch(file);

  // https://javascript.info/fetch-progress
  const reader = response.body.getReader();

  // Step 2: get total length
  const contentLength = +response.headers.get("Content-Length");

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    console.log(`Received ${receivedLength} of ${contentLength}`);
    postMessage({ type: "progress", receivedLength, contentLength })
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  // Step 5: decode into a string
  let result = new TextDecoder("utf-8").decode(chunksAll);

  // We're done!
  let json = JSON.parse(result);

  if (type === "level") {
    //await parseFile(json.tileset, "tileset");
    postMessage({ type: "level", index: json.index, width: json.width, height: json.height, ...json.tiles })
  } else if (type === "tileset") {
    if (json.tiles.palette.normalized) {
      json.tiles.palette.data = json.tiles.palette.data.map(x => x * 255);
    }
    postMessage({ type: "tileset", palette: new Uint8Array(json.tiles.palette.data) })
  }
}
onmessage = function(e) {
  if (e.data.type === "level") {
    parseFile(e.data.file, "level");
  }
};
