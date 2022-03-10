async function parseFile(file, type) {
  const response = await fetch(file);

  // https://javascript.info/fetch-progress
  const reader = response.body.getReader();

  // Step 2: get total length
  const contentLength = +response.headers.get("Content-Length");

  let receivedLength = 0;
  let chunks = [];
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

  let chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  let result = new TextDecoder("utf-8").decode(chunksAll);

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
