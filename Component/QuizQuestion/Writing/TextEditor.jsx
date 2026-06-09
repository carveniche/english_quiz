
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useRef, useEffect, useContext } from 'react';
import ToolBarIcons from './ToolBarIcons';
import style from "./TextEditor.module.css"
import writing_style from "./writing.module.css"
import { Alert } from '@mui/material';
import { ValidationContext } from '../../QuizPage';
import React_Base_Api from '../../../ReactConfigApi';

export default function TextEditor({
  studentTextRef,
  showChatGptResponse,
  isShowingResponse,
  response,
  extractedText,
  pdfLoading,
  obj
}) {

  const { showSolution } = useContext(ValidationContext);
  const [content, setContent] = useState('');
  const [activeIcon, setActiveIcon] = useState(null);
  const [worldCount, setWordCount] = useState(Infinity);
  const [disabllePaste, setDisablePaste] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState({ visible: false, format: null, color: "#000" });
  const quillRef = useRef(null);
  const [pdfViewerKey, setPdfViewerKey] = useState(0); // To force re-render PdfViewer
  const [isErrorMsg, setIsErrorMsg] = useState({ type: false, msg: '' })
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [isShowMsg, setIsShowMsg] = useState(false);
 const [objData,setObjData] = useState({})



  const handleChange = (value) => {
    
    const editor = quillRef.current.getEditor();
    const text = editor.getText().trim(); // plain text without HTML
    // Count words by splitting on whitespace and filtering empty words
    const tempWordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
    const html = editor.root.innerHTML;


    if (worldCount !== Infinity) {
      if (!quillRef.current) return;
      if (tempWordCount >= worldCount) {
        editor.setText(text + " ");
        return;
      }  
    }  
    if (tempWordCount == 0) {
      setContent('');
      if (studentTextRef) {
        studentTextRef.current = "";
      }  
      return;
    }  
    if (studentTextRef) {
      const editor = quillRef.current.getEditor();
      studentTextRef.current = editor.getContents()?.ops;
    }  
    setContent(value);
  };  

  const applyFormat = (format, value = true, label) => {
    try {


      if (!quillRef.current) return;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      setActiveIcon(label);
      if (!range) editor?.focus();

      if (format === 'removeFormat') {
        if (!range) return;
        editor.removeFormat(range.index, range.length);
        setShowColorPicker({ visible: false, format: null, color: "#000" });
      } else if (format === 'list') {
        const currentFormat = editor.getFormat(range);
        if (currentFormat.list === value) {
          editor.format('list', false);
        } else {
          editor.format('list', value);
        }  
      } else if (format === 'color' || format === 'background') {
        setShowColorPicker({ visible: true, format });
        return;
      }  
      else {
        if (!range) return;
        const currentFormat = editor.getFormat(range);
        editor.format(format, !currentFormat[format]);
      }  

      editor.focus();
    } catch (err) {
      console.error("Error applying format:", err);
    }  
  };  



  const handleColorChange = (e) => {
    try {
      if (e == "clear") {
        setShowColorPicker({ visible: false, format: null, color: "#000" });
        return
      }  

      const color = e.target.value;
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.format(showColorPicker.format, color);
      }  
      setShowColorPicker({ visible: true, format: showColorPicker.format, color: color });
      editor.focus();
    } catch (err) {
      console.error("Error applying color:", err);
    }  
  };  

  useEffect(() => {
    // ✅ Get current editor content as Delta JSON
    window.getRichEditorJson = () => {
      try {
        if (!quillRef.current) {
          console.warn("Editor not ready");
          return null
        }  

        const editor = quillRef.current.getEditor();
        return editor.getContents(); // Returns Quill Delta JSON
      } catch (err) {
        console.warn("Error getting editor JSON:", err);
        return null;
      }  
    };  

   

    window.getRichEditorWordCount = (json) => {
      try {
        if (!quillRef.current) return 0;

        const editor = quillRef.current.getEditor();
        const text = editor.getText().trim(); // plain text without HTML
        // Count words by splitting on whitespace and filtering empty words
        const tempWordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
        return tempWordCount; // Returns word count
      } catch (err) {
        console.error("Error setting editor JSON:", err);
      }  
    };  

    // Insert plain text at the current cursor position
    window.insertRichEditorText = (text) => {
      try {
        if (!quillRef.current) throw new Error('Editor not ready');
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
        editor.insertText(range.index, text);
        editor.setSelection(range.index + text.length, 0);
        editor.focus();
      } catch (err) { console.error('insertRichEditorText error', err); }  
    };  


    window.setRichEditorDisablePaste = (istrue) => { setDisablePaste(istrue) }
    return () => {
      delete window.getRichEditorJson;
      delete window.setRichEditorJson;
      delete window.getRichEditorWordCount;
      delete window.setRichEditorDisablePaste;
      delete window.insertRichEditorText;
      delete window.insertRichEditorPdf;
    };  
  }, []);  






  useEffect(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();

    const handleKeydown = (e) => {
      if (disabllePaste && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        console.log("Keyboard paste blocked!");
      }  
    };  

    const handlePaste = (e) => {
      if (disabllePaste) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Paste blocked!");
      }  
    };  

    const handleDrop = (e) => {
      if (disabllePaste) {
        e.preventDefault();
        console.log("Drop blocked!");
      }  
    };  

    const handleContextMenu = (e) => {
      if (disabllePaste) {
        // Optional: prevent right-click only for paste
        e.preventDefault();
        console.log("Right-click disabled!");
      }  
    };  

    editor.root.addEventListener('keydown', handleKeydown);
    editor.root.addEventListener('paste', handlePaste);
    editor.root.addEventListener('drop', handleDrop);
    editor.root.addEventListener('contextmenu', handleContextMenu);

    return () => {
      editor.root.removeEventListener('keydown', handleKeydown);
      editor.root.removeEventListener('paste', handlePaste);
      editor.root.removeEventListener('drop', handleDrop);
      editor.root.removeEventListener('contextmenu', handleContextMenu);
    };  
  }, [disabllePaste]);  

  // 1️⃣ Upload file and get server URL






  useEffect(() => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();

    const pdfExists = delta.ops.some(op =>
      op.insert &&
      typeof op.insert === "object" &&
      op.insert.pdf
    );


  }, [content]);




  function RemoveText() {
    pdfInputRef.current?.click();
    setIsShowMsg(false);
  }

 function handleKeyDown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
    e.preventDefault();
  }
}

  useEffect(() => {
    if (obj && obj?.question_data[0]) {
      const temp = {
        student_id: obj?.student_id,
        at_form: "english_zone_web",
        english_question_id: obj?.question_data[0]?.question_id
      }
      setObjData(temp)
    }
    
    if (obj && obj?.question_data[0] && obj?.question_data[0]?.student_draft) {
      try {
        const student_draft = JSON.parse(obj?.question_data[0]?.student_draft)
        const editor = quillRef.current.getEditor();
        editor.setContents(student_draft)
      } catch (e) {
        console.error(e)
      }
    }

    if (showSolution && obj && obj?.question_data[0])
      try {
        const studentResponse = JSON.parse(obj.question_data[0]?.questionResponse)?.studentResponse
        const editor = quillRef.current.getEditor();
        editor.setContents(studentResponse)
      } catch (e) {
        console.error(e)
      }

  }, [showSolution,obj])


useEffect(() => {
  if (!extractedText || !quillRef.current) return;

  const editor = quillRef.current.getEditor();
  const currentLength = editor.getLength();

  editor.insertText(
    currentLength - 1,
    "\n" + extractedText
  );
}, [extractedText]);

useEffect(() => {
  const timer = setTimeout(() => {
    try {
      if (!quillRef.current?.getEditor) return;

      const editor = quillRef.current.getEditor();

      editor.root.setAttribute("spellcheck", "false");
      editor.root.setAttribute("autocomplete", "off");
      editor.root.setAttribute("autocorrect", "off");
      editor.root.setAttribute("autocapitalize", "off");
      editor.root.setAttribute("data-gramm", "false");
      editor.root.setAttribute("data-enable-grammarly", "false");
      editor.root.setAttribute("data-lt-active", "false");

      // QuillBot hints
      editor.root.setAttribute("data-qb-disable", "true");
      editor.root.setAttribute("data-qb-editor", "false");
    } catch (e) {
      console.error(e);
    }
  }, 200);

  return () => clearTimeout(timer);
}, []);



const handleSaveDraft = async () => {
  if (!studentTextRef.current) return;

  try {
    const formData = new FormData();

    formData.append("response", JSON.stringify(studentTextRef.current));
    formData.append("student_id", objData.student_id);
    formData.append("at_from", objData.at_form);
    formData.append("english_question_id", objData.english_question_id);

    const response = await fetch(
      `${React_Base_Api}/app_teachers/save_student_response_drafts`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.status) {
      alert("Draft saved");
    }
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className={`${style.custom__editor__container} rounded-md h-full overflow-x-auto bg-white`}>
      <div className={`${style.editor__container} `}>

        {/* <ErrorPopup open={isErrorMsg?.type} onClose={setIsErrorMsg} message={isErrorMsg?.msg} /> */}
        {!isShowingResponse && !showChatGptResponse &&
          <>
            {!pdfLoading && <button className={`${writing_style.save_draft}`} onClick={handleSaveDraft}>save (draft)</button>}
            <ToolBarIcons
              content={content}
              applyFormat={applyFormat}
              showColorPicker={showColorPicker}
              handleColorChange={handleColorChange}
              activeIcon={activeIcon} />
          </>
        }

        <ReactQuill
          className={`${style.custom_editor} `}
          id='custom_editor'
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={isShowingResponse || pdfLoading}
          // modules={{
          //   blotFormatter: {},
          //   imageResize: {
          //     parchment: Quill.import('parchment'),
          //     modules: ['Resize', 'DisplaySize'],
          //     minWidth: 150,
          //     minHeight: 150
          //   },
          //   toolbar: false,
          // }}
          modules={{

            toolbar: false,
            
          }}
          placeholder="Start typing here..."
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}



