import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [diff, setDiff] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const fileARef = useRef(null);
  const fileBRef = useRef(null);

  const resultRef = useRef(null);

  const handleFileUpload = (e, setText, setFile) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        setFile(file);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file");
    }
  };

  const removeFile = (setText, setFile, inputRef) => {
    setText("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!textA && !textB) {
      alert("Please provide at least some content in documents.");
      return;
    }

    setLoading(true);
    setDiff("");
    setSummary("");

    try {
      const response = await axios.post("http://localhost:5000/api/diff-summary", {
        textA,
        textB,
      });
      setDiff(response.data.diff);
      setSummary(response.data.summary);
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(false);
  };

  // Auto-scroll when diff or summary appears
  useEffect(() => {
    if ((diff || summary) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [diff, summary]);

  // ✅ Download summary
  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "linear-gradient(135deg, #1a73e8, #4285f4, #34a853)",
          borderRadius: "20px",
          padding: "30px 20px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          marginBottom: "50px",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          📄 Document Diff Checker 🤖
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          style={{ fontSize: "1.2rem", fontWeight: "500" }}
        >
          Paste text or upload <strong>.txt</strong> files to compare and get an AI-powered professional summary.
        </motion.p>
      </motion.div>

      {/* Documents */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {/* Document A */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            flex: "1 1 400px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "12px",
              fontSize: "18px",
            }}
          >
            Document A
          </div>

          <textarea
            placeholder="Paste Document A here..."
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            style={{
              width: "100%",
              height: "180px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
              fontSize: "15px",
              color: "#111",
              backgroundColor: "#f9f9f9",
              marginBottom: "12px",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <label
              htmlFor="fileA"
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#1a73e8",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              {fileA ? "Change File" : "Upload .txt"}
            </label>
            <input
              id="fileA"
              ref={fileARef}
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e, setTextA, setFileA)}
              style={{ display: "none" }}
            />

            {fileA && (
              <button
                onClick={() => removeFile(setTextA, setFileA, fileARef)}
                style={{
                  padding: "10px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Remove
              </button>
            )}
          </div>
        </motion.div>

        {/* Document B */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            flex: "1 1 400px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "12px",
              fontSize: "18px",
            }}
          >
            Document B
          </div>

          <textarea
            placeholder="Paste Document B here..."
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            style={{
              width: "100%",
              height: "180px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
              fontSize: "15px",
              color: "#111",
              backgroundColor: "#f9f9f9",
              marginBottom: "12px",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <label
              htmlFor="fileB"
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#1a73e8",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              {fileB ? "Change File" : "Upload .txt"}
            </label>
            <input
              id="fileB"
              ref={fileBRef}
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e, setTextB, setFileB)}
              style={{ display: "none" }}
            />

            {fileB && (
              <button
                onClick={() => removeFile(setTextB, setFileB, fileBRef)}
                style={{
                  padding: "10px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Remove
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Compare Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: "30px",
          padding: "16px 40px",
          fontSize: "18px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#1a73e8",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {loading ? "Processing..." : "Compare & Summarize"}
      </motion.button>

      {/* SCROLL TARGET */}
      <div ref={resultRef} style={{ width: "100%" }}></div>

      {/* Diff with colored lines */}
      {diff && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: "40px",
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "1000px",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontSize: "16px",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#333", fontSize: "20px" }}>🔍 Diff</h3>
          <div>
            {diff.split("\n").map((line, index) => {
              let color = "#000"; // default
              if (line.startsWith("+")) color = "#28a745";
              else if (line.startsWith("-")) color = "#dc3545";
              return (
                <div key={index} style={{ color }}>
                  {line}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            marginTop: "30px",
            backgroundColor: "#eaf7ff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "1000px",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#1a73e8", fontSize: "20px" }}>🤖 AI Summary</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", fontSize: "16px" }}>
            {summary}
          </pre>

          {/* ✅ Download Summary Button */}
          <button
            onClick={downloadSummary}
            style={{
              marginTop: "15px",
              padding: "10px 25px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#34a853",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            💾 Download Summary
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default App;
