import React, { useState } from "react";
import { setOptions, Document, Page } from "react-pdf";
import SignatureSelector from "./SignatureSelector";
const pdfjsVersion = "2.0.305";
setOptions({
  workerSrc: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`
});

const FileViewer = (props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [signatureMap, setSignatureMap] = useState({});
  const signatureWidth = 200;
  const signatureHeight = 100;
  const canvasWidth = 595;
  const canvasHeight = 842;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const previousPage = () => {
    //if (pageNumber > 1) {
    setPageNumber(pageNumber - 1);
    //}
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const fileURL =
    "https://www.sldttc.org/allpdf/21583473018.pdf";
  //const fileURL = "https://s3-ap-southeast-1.amazonaws.com/happay-local/HVP/BILL20198261213473719445688HP.pdf";
  return (
    <div style={{ position: "relative" }}>
      <div style={{ width: "100%" }}>
        <SignatureSelector
          signatureWidth={signatureWidth}
          signatureHeight={signatureHeight}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          enableSelect={true}
          enableDraw={true}
          signatureMap={signatureMap}
          updateSignatureMap={setSignatureMap}
          currentPage={pageNumber}
          textPlaceholder="Your sign will be here!"
        >
          <Document file={fileURL} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              width={canvasWidth}
              height={canvasHeight}
              pageNumber={pageNumber}
            />
          </Document>
        </SignatureSelector>
      </div>
      <div>
        <button onClick={previousPage}>Indietro</button>
        Page {pageNumber} of {numPages}
        <button onClick={nextPage}>Avanti</button>
      </div>
    </div>
  );
};

export default FileViewer;
