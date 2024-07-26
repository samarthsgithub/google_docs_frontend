import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

function DocumentEditor() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const socket = useRef(null);
    const quillRef = useRef(null);

    const generateLink = async (accessType) => {
        try {
            const response = await axios.post(
                `http://localhost:5001/documents/${id}/share`,
                { access_type: accessType },
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            setLink(response.data.link);
        } catch (error) {
            console.error('Error generating link', error);
        }
    };

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/documents/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                console.error('Error fetching document', err);
            }
        };

        fetchDocument();

        // Initializing socket connection
        socket.current = io('http://localhost:3001');
        socket.current.on('connect', () => {
            console.log('Connected to WebSocket server');
            socket.current.emit('joinDoc', id);
        });
        socket.current.on('receiveChanges', (newContent) => {
            console.log('Received Changes:', newContent);
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            setContent(newContent);
            setTimeout(() => {
                if (range) {
                    quill.setSelection(range);
                }
            }, 0);
        });
        socket.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket Server');
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };

    }, [id]);

    const saveDocument = async () => {
        console.log("inside save Document");
        try {
            await axios.put(`http://localhost:5001/documents/${id}`, { title, content }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            console.log("Document saved successfully");
        } catch (err) {
            console.error('Error saving document:', err);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (newContent, delta, source, editor) => {
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
        <>
            <div>
                <h1>Edit Document</h1>
                <h2>Title</h2>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder='Document Title'
                    style={{ width: '50%', padding: '10px', fontSize: '1.5em', marginBottom: '20px' }}
                />
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    ref={quillRef}
                />
                <button onClick={() => generateLink('view')}>Generate View Link</button>
                <button onClick={() => generateLink('edit')}>Generate Edit Link</button>
                {link && (
                    <div>
                        <p>Shareable Link: <a href={link}>{link}</a></p>
                    </div>
                )}
            </div>
            <button onClick={saveDocument}>Save</button>
        </>
    );
}

export default DocumentEditor;
