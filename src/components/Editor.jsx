import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../Actions.js";

const Editor = ({ socketRef, roomId }) => {        
  const editorInstanceRef = useRef(null);

  // Initialize CodeMirror
  useEffect(() => {
    console.log("Socket inside Editor:", socketRef.current);
    editorInstanceRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );
    editorInstanceRef.current.setSize("100%", "100%");
    editorInstanceRef.current.getWrapperElement().style.fontSize = "20px";
    setTimeout(() => editorInstanceRef.current.refresh(), 0);

    editorInstanceRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      }
    });
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code !== null) {
        editorInstanceRef.current.setValue(code);
      }
    });

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
