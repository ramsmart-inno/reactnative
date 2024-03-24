import React, { useEffect } from "react";
import PropTypes from "prop-types";

const A4SIZE = {
  DPI_72: {
    WIDTH: 595,
    HEIGHT: 842
  }
};

const SignatureSelector = (props) => {
  const {
    enableSelect,
    enableDraw,
    signatureWidth,
    signatureHeight,
    canvasWidth,
    canvasHeight,
    currentPage,
    signatureMap,
    updateSignatureMap,
    textPlaceholder
  } = props;

  useEffect(() => {
    if (enableDraw) {
      clearOverlayCanvas();
      if (signatureMap[currentPage]) {
        console.log(signatureMap[currentPage]);
        drawOnOverlayCanvas(
          signatureMap[currentPage].xCanvas,
          signatureMap[currentPage].yCanvas
        );
      }
    }
  }, [currentPage]);

  const clearOverlayCanvas = () => {
    let canvasOverlay = document.getElementById("sc-canvas-overlay");
    let ctx = canvasOverlay.getContext("2d");
    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
  };

  const drawOnOverlayCanvas = (
    signX,
    signY,
    color = "red",
    text = textPlaceholder
  ) => {
    let canvasOverlay = document.getElementById("sc-canvas-overlay");
    let ctx = canvasOverlay.getContext("2d");

    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(signX, signY, signatureWidth, signatureHeight);
    ctx.fillStyle = color;
    ctx.setLineDash([6]);
    ctx.strokeStyle = color;
    ctx.strokeRect(signX, signY, signatureWidth, signatureHeight);

    ctx.fillText(text, signX + 20, signY + signatureHeight / 2);
  };

  const getPosition = (evt) => {
    const signatureSelectorDiv = document.querySelector("#kpmg-sign-selector");
    let canvas = signatureSelectorDiv.querySelectorAll("canvas")[0];
    let mousePosition = getMousePos(canvas, evt);
    if (mousePosition) {
      let x = mousePosition.x;
      let y = mousePosition.y;

      let xPDF = Math.round(
        (A4SIZE.DPI_72.WIDTH * mousePosition.x) / canvas.width
      );
      let yPDF = Math.round(
        (A4SIZE.DPI_72.HEIGHT * mousePosition.y) / canvas.height
      );

      if (canvas.width > canvasWidth || canvas.height > canvasHeight) {
        x = xPDF;
        y = yPDF;
      }

      if (enableDraw) {
        clearOverlayCanvas();
        drawOnOverlayCanvas(x, y, "red", textPlaceholder);
      }

      drawOnOverlayCanvas(xPDF, yPDF, "green", "PDF");
      console.log("Canvas:" + x + ", " + y);
      console.log("Pdf:" + xPDF + ", " + yPDF);

      let newSignatureMap = signatureMap;
      newSignatureMap[currentPage] = {
        xCanvas: x,
        yCanvas: y,
        xPDF: xPDF,
        yPDF: yPDF
      };
      updateSignatureMap(newSignatureMap);
    }
  };

  const getMousePos = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    let mouseX = (evt.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
    let mouseY = (evt.clientY - rect.top) * scaleY; // been adjusted to be relative to element

    if (mouseX > canvas.width || mouseY > canvas.height) {
      //Cursor is out of canvas
    } else {
      return {
        x: Math.round(mouseX),
        y: Math.round(mouseY)
      };
    }
  };

  return (
    <div
      id="kpmg-sign-selector"
      onClick={enableSelect ? getPosition : () => {}}
    >
      {props.children}
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        id="sc-canvas-overlay"
        style={{ position: "absolute", top: "0", left: "0" }}
      />
      <button style={{ postition: "absolute", bottom: "0" }}>
        Aggiungi firma
      </button>
    </div>
  );
};

SignatureSelector.propTypes = {
  enableSelect: PropTypes.bool,
  enableDraw: PropTypes.bool,
  signatureWidth: PropTypes.number.isRequired,
  signatureHeight: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  signatureMap: PropTypes.object.isRequired,
  updateSignatureMap: PropTypes.func.isRequired,
  textPlaceholder: PropTypes.string
};

SignatureSelector.defaultProps = {
  enableSelect: true,
  enableDraw: true,
  signatureWidth: 200,
  signatureHeight: 100,
  textPlaceholder: "Signature will be here!"
};

export default SignatureSelector;
