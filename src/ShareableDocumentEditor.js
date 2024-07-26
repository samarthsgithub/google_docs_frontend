import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import {io} from 'socket.io-client';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

function ShareableDocumentEditor() {
  const { id, access_type,token } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editable,setEditable] = useState(false);
  const socket = useRef(null);
  const quillRef = useRef(null);
  
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/documents/${id}/${access_type}/${token}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setEditable(res.data.access_type==='edit');
      } catch (err) {
        console.error('Error fetching document', err);
      }
    };

    fetchDocument();

    socket.current = io('http://localhost:3001');
    socket.current.on('connect',()=>{
      console.log('connected to websocket server');
      socket.current.emit('joinDoc',id);
    });
    socket.current.on('recieveChanges',(newContent)=>{
      console.log('Recieved Changes:', newContent);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      setContent(newContent);
      setTimeout(()=>{
        if(range){
          quill.setSelection(range);
        }
      },0);
    });
    socket.current.on('disconnect',()=>{
      console.log('Disconnected from Websocket server');
    });

    return ()=>{
      if(socket.current){
       socket.current.disconnect();
      }
    }
     
  }, [id,access_type,token]);

  const saveDocument = async () => {
    if (!editable) {
        alert("You don't have permission to edit this document.");
        return;
    }
    
    try {
        await axios.put(`http://localhost:5001/documents/${id}/${token}`, { title, content });
    } catch (err) {
        console.error('Error saving document:', err);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent,delta,source,editor) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    setContent(newContent);
    console.log('Emitting changes', newContent);
    if (socket.current && source === 'user') {
      socket.current.emit('docChanges', { docId: id, changes: newContent });
    }
    setTimeout(() => {
      if (range) {
        quill.setSelection(range);
      }
    }, 0);
  };

  return (
    <div>
      <h1>{editable ? 'Edit Document' : 'View Document'}</h1>
      <h2>Title</h2>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder='Document Title'
        style={{ width: '100%', padding: '10px', fontSize: '1.5em', marginBottom: '20px' }}
        disabled={!editable}
      />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleContentChange}
        ref={quillRef}
        readOnly={!editable}
      />
      {editable && <button onClick={saveDocument}>Save</button>}
    </div>
  );
}

export default ShareableDocumentEditor;