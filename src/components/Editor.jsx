import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'

const Editor = () => {
  const editorRef = useRef(null)

  useEffect(() => {
    let editorInstance
    if (editorRef.current) {
      editorInstance = Codemirror.fromTextArea(editorRef.current, {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true
      })
      editorInstance.setSize('100%', '100%')
      editorInstance.getWrapperElement().style.fontSize = "20px"
      setTimeout(() => editorInstance.refresh(), 0)
    }
    return () => {
      if (editorInstance) editorInstance.toTextArea()
    }
  }, [])

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default Editor
