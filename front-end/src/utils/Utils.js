import "../index.css";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newRow = (csvElement, csvHeader) => {
  let jsonObject = {};
  for (let i = 0; i < csvHeader.length; i++) {
    jsonObject[csvHeader[i]] = csvElement[i];
  }

  return jsonObject;
};

export function makeCsvData(csvBody, csvHeader) {
  return range(csvBody.length).map(d => {
    return {
      ...newRow(csvBody[d], csvHeader)
    };
  });
}
