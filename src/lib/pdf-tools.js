import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import { getPDFWritableStream } from "./fs-tools.js";

export const getPDFReadableStream = (mediaArray) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const content = mediaArray.map((media) => {
    return [
      { text: media.title, style: "header" },
      { text: media.category, style: "subheader" },
      "\n\n",
    ];
  });

  const docDefinition = {
    content: [...content],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};

export const asyncPDFGeneration = async (mediaArray) => {
  const source = getPDFReadableStream(mediaArray);
  const destination = getPDFWritableStream("media.pdf");

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
