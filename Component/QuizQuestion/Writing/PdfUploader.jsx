import React, { useContext, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";
import React_Base_Api from "../../../ReactConfigApi";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

// ─── PdfUploader (OCR, no API) ────────────────────────────────────────────────
export default function PdfUploader ({onExtracted, disabled ,pdfLoading, setPdfLoading}) {
  const [pdfProgress, setPdfProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const pdfInputRef = useRef(null);
  const workerRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handlePdfUpload = async (e) => {
    try{

  setUploadedFileName("")
  const file = e.target.files[0];
  if (!file) return;
  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    setError("Please upload a PDF or image file.");
    return;
  }
 setPdfLoading(true);
 setError("")
 setPdfProgress(0)
const validationResult = await validateFileWithAI(file);
if (!validationResult?.status || !validationResult?.data) {
  setError("Failed to validate file");
  setPdfLoading(false);
  return;

}

let res;

try {
  const cleaned = validationResult.data
  .replace(/```json\s*/gi, "")
  .replace(/```/g, "")
  .trim();

 res = JSON.parse(cleaned);
} catch (e) {
   setPdfLoading(false);
  setError("Invalid validation response");
  return;
}

if (!res?.approved) {
  setError(
    res?.reason ||
    "Please upload your own handwritten work."
  );
   setPdfLoading(false);
  return;
}
onExtracted(res.text);
setUploadedFileName(file.name);
setPdfLoading(false);
setError("")
e.target.value = "";
if (pdfInputRef.current) {
  pdfInputRef.current.value = "";
}
 }catch(e){
      console.log(e)
    }
  }

//   const handlePdfUpload = async (e) => {
//   setUploadedFileName("")
//   const file = e.target.files[0];
//   if (!file) return;
//   const isPdf = file.type === "application/pdf";
//   const isImage = file.type.startsWith("image/");

//   if (!isPdf && !isImage) {
//     setError("Please upload a PDF or image file.");
//     return;
//   }
//  setPdfLoading(true);
// const validationResult = await validateFileWithAI(file);
// if (!validationResult?.status || !validationResult?.data) {
//   setError("Failed to validate file");
//   setPdfLoading(false);
//   return;

// }

// let res;

// try {
//   const cleaned = validationResult.data
//   .replace(/```json\s*/gi, "")
//   .replace(/```/g, "")
//   .trim();

//  res = JSON.parse(cleaned);
// } catch (e) {
//    setPdfLoading(false);
//   setError("Invalid validation response");
//   return;
// }

// if (!res?.approved) {
//   setError(
//     res?.reason ||
//     "Please upload your own handwritten work."
//   );
//    setPdfLoading(false);
//   return;
// }

//   setError("");
//   setDone(false);
 
//   setPdfProgress(0);
//   setStatusMsg("Loading…");

//   try {
//     // await loadLibraries();

//     // ── IMAGE: direct OCR ─────────────────────────────────────────────────
//     if (isImage) {
//       setStatusMsg("Reading image…");
//      workerRef.current = await createWorker("eng");

//       const { data: { text } } = await workerRef.current.recognize(file);

//       await workerRef.current.terminate();
//       workerRef.current = null;

//       setPdfProgress(100);
//       setStatusMsg("Done!");
//       setDone(true);

//       setTimeout(() => {
//         onExtracted(text.trim());
//         setUploadedFileName(file?.name);
//         setPdfLoading(false);
//         setStatusMsg("");
//         setTimeout(() => { setDone(false); setPdfProgress(0); }, 1500);
//       }, 400);

//       return;
//     }

//     // ── PDF: page by page ─────────────────────────────────────────────────
//     setStatusMsg("Reading PDF…");
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     const total = pdf.numPages;
//     let fullText = "";

//     workerRef.current = await createWorker("eng");

//     for (let i = 1; i <= total; i++) {
//       const page = await pdf.getPage(i);

//       const content = await page.getTextContent();
//       const layerText = content.items.map((item) => item.str).join(" ").trim();

//       if (layerText.length > 20) {
//         fullText += layerText + "\n";
//         setStatusMsg(`Reading page ${i}/${total}…`);
//         setPdfProgress(Math.round((i / total) * 100));
//       } else {
//         setStatusMsg(`page ${i}/${total}…`);
//         const viewport = page.getViewport({ scale: 2.5 });
//         const canvas = document.createElement("canvas");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

//         const { data: { text } } = await workerRef.current.recognize(canvas);
//         fullText += text + "\n";
//         setPdfProgress(Math.round((i / total) * 100));
//       }
//     }
//     await workerRef.current.terminate();
//     workerRef.current = null;

//     setPdfProgress(100);
//     setStatusMsg("Done!");
//     setDone(true);

//     setTimeout(() => {
//       onExtracted(fullText.trim());
//       setPdfLoading(false);
//       setStatusMsg("");
//       setTimeout(() => { setDone(false); setPdfProgress(0); }, 1500);
//     }, 400);

//   } catch (err) {
//     console.error("OCR failed", err);
//     if (workerRef.current) {
//       await workerRef.current.terminate().catch(() => {});
//       workerRef.current = null;
//     }
//     setError("Failed to read file. Try another.");
//     setPdfLoading(false);
//     setPdfProgress(0);
//     setStatusMsg("");
//   }

//   e.target.value = "";
// };


const validateFileWithAI = async (file) => {

   let progress = 0;

  const interval = setInterval(() => {
    progress += 2;

    if (progress <= 90) {
      setPdfProgress(progress);
    }
  }, 50);

const prompt = `
Analyze the uploaded image or PDF.

Tasks:

1. Determine whether the visible content is genuinely handwritten by a person.
2. Extract the text exactly as it appears.
3. Do NOT correct spelling.
4. Do NOT correct grammar.
5. Do NOT add missing words.
6. Do NOT remove words.
7. Do NOT summarize.
8. Preserve line breaks where possible.
9. If a word is unclear, return it exactly as seen. If unreadable, use "[unclear]".
10. Return ONLY valid JSON.

Response format:

{
"approved": true,
"reason": "Appears to be genuine handwritten text",
"text": "exact extracted text"
}

or

{
"approved": false,
"reason": "Appears to be typed, printed, AI-generated, or digitally rendered text",
"text": "exact extracted text"
}

Rules:

* The "text" field must contain only the extracted text from the image/PDF.
* Do not rewrite the content.
* Do not improve the content.
* Do not explain the content.
* Do not include markdown.
* Do not wrap the JSON in '''json.
* Return ONLY the JSON object.
  `;

try{
  const formData = new FormData();
formData.append("upload_file", file);
formData.append("prompt", prompt);  // ✅ pass the variable

  const response = await fetch(`${React_Base_Api}/app_teachers/validate_student_writing_question`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Validation failed");
  }
  setPdfProgress(100)
  return response.json();
}catch(e){
  console.error(e)
  return null
}
};

  return (
    <div style={{ marginBottom: 6 }}>
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf, image/*"   // ✅ both
        style={{ display: "none" }}
        onChange={handlePdfUpload}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {/* button */}
        <button
          onClick={() => !disabled && pdfInputRef.current?.click()}
          disabled={pdfLoading || disabled}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 20,
            border: "1.5px solid rgb(45,140,240)",
            background: pdfLoading ? "#f0f6ff" : "#fff",
            color: "rgb(45,140,240)",
            fontSize: 13, fontWeight: 500,
            cursor: pdfLoading || disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="rgb(45,140,240)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          {pdfLoading ? "Processing…" :  "Upload PDF / Image"}
        </button>

        {/* progress bar */}
        {pdfLoading && (
          <>
            <div style={{
              flex: 1, minWidth: 80,
              height: 6, borderRadius: 3,
              background: "#e8edf2", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${pdfProgress}%`,
                borderRadius: 3,
                background: "linear-gradient(90deg, rgb(45,140,240), #00bcd4)",
                transition: "width 0.35s ease",
              }} />
            </div>
            <span style={{ fontSize: 12, color: "rgb(45,140,240)", whiteSpace: "nowrap" }}>
              {pdfProgress}% · {statusMsg}
            </span>
          </>
        )}

        {/* done */}
        {done && !pdfLoading && (
          <span style={{ color: "#43a047", fontSize: 13, fontWeight: 500 }}>
            ✓ Text added
          </span>
        )}
        {
          uploadedFileName && !pdfLoading && (
            <span style={{ fontSize: 12, color: "#43a047", fontStyle: "italic" }}>
              ({uploadedFileName})
            </span>
          )
        }
      </div>

      {error && (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#e53935" }}>{error}</p>
      )}
    </div>
  );
};