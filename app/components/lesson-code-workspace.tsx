"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  clearLessonCodeDraft,
  loadLessonCodeDraft,
  saveLessonCodeDraft,
} from "@/lib/lesson-code-workspace";

const PYODIDE_VERSION = "314.0.4";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

type PyodideRuntime = {
  loadPackagesFromImports: (code: string) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (message: string) => void }) => void;
  setStderr: (options: { batched: (message: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>;
  }
}

let runtimePromise: Promise<PyodideRuntime> | null = null;

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadPythonRuntime() {
  if (runtimePromise) return runtimePromise;

  runtimePromise = new Promise<PyodideRuntime>((resolve, reject) => {
    const startRuntime = () => {
      if (!window.loadPyodide) {
        reject(new Error("The Python engine did not load. Check your connection and try again."));
        return;
      }

      window.loadPyodide({ indexURL: PYODIDE_INDEX_URL }).then(resolve, reject);
    };

    if (window.loadPyodide) {
      startRuntime();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-academy-python]");
    if (existingScript) {
      existingScript.addEventListener("load", startRuntime, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("The Python engine could not be downloaded.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.dataset.academyPython = "true";
    script.addEventListener("load", startRuntime, { once: true });
    script.addEventListener("error", () => reject(new Error("The Python engine could not be downloaded.")), { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    runtimePromise = null;
    throw error;
  });

  return runtimePromise;
}

function readablePythonError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/No module named|ModuleNotFoundError/i.test(message)) {
    return `${message}\n\nThis package is not available in the browser workspace. Use the lesson notebook for the complete geospatial environment.`;
  }
  if (/No such file or directory/i.test(message)) {
    return `${message}\n\nThis example expects a lesson data file. Download the linked lesson resource and continue in the full notebook.`;
  }
  return message;
}

type LessonCodeWorkspaceProps = {
  lessonId: string;
  starterCode: string;
};

export default function LessonCodeWorkspace({ lessonId, starterCode }: LessonCodeWorkspaceProps) {
  const editorId = useId();
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run the code to see its output here.");
  const [runState, setRunState] = useState<"idle" | "loading" | "running" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("Loading your saved draft");
  const readyToSave = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = loadLessonCodeDraft(browserStorage(), lessonId, starterCode);
      setCode(loaded.code);
      setSaveMessage(
        loaded.status === "saved"
          ? "Saved draft restored from this browser"
          : loaded.status === "recovered"
            ? "Saved draft was unreadable, so the lesson example was restored"
            : "Drafts are saved only in this browser",
      );
      readyToSave.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [lessonId, starterCode]);

  useEffect(() => {
    if (!readyToSave.current) return;
    const timer = window.setTimeout(() => {
      const saved = saveLessonCodeDraft(browserStorage(), lessonId, code);
      setSaveMessage(saved ? "Draft saved in this browser" : "Draft cannot be saved in this browser");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [code, lessonId]);

  async function runCode() {
    setRunState("loading");
    setOutput("Loading Python in your browser. The first run can take a moment.");

    try {
      const runtime = await loadPythonRuntime();
      setRunState("running");
      setOutput("Preparing the packages used by this example.");
      await runtime.loadPackagesFromImports(code);

      const standardOutput: string[] = [];
      const errorOutput: string[] = [];
      runtime.setStdout({ batched: (message) => standardOutput.push(message) });
      runtime.setStderr({ batched: (message) => errorOutput.push(message) });

      const result = await runtime.runPythonAsync(code);
      const resultText = result === undefined || result === null ? "" : String(result);
      const combined = [...standardOutput, ...errorOutput, ...(resultText ? [resultText] : [])].join("\n");
      setOutput(combined || "Code finished successfully without printed output.");
      setRunState("success");
    } catch (error) {
      setOutput(readablePythonError(error));
      setRunState("error");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setSaveMessage("Code copied");
    } catch {
      setSaveMessage("Select the code and copy it manually");
    }
  }

  function resetCode() {
    if (!window.confirm("Restore the original lesson example? Your edited draft for this lesson will be replaced.")) return;
    clearLessonCodeDraft(browserStorage(), lessonId);
    setCode(starterCode);
    setOutput("The original lesson example has been restored.");
    setRunState("idle");
    setSaveMessage("Original lesson example restored");
  }

  return (
    <section className="lesson-code-workspace" aria-labelledby={`${editorId}-title`}>
      <div className="lesson-code-heading">
        <div>
          <span>Practice workspace</span>
          <h3 id={`${editorId}-title`}>Run the lesson code here</h3>
          <p>The example is already entered. Change it when the lesson asks you to experiment, then select Run Python.</p>
        </div>
        <span className="lesson-code-runtime">Python runs privately on this device</span>
      </div>

      <label className="lesson-code-editor-label" htmlFor={editorId}>
        Python code
        <span>{saveMessage}</span>
      </label>
      <textarea
        id={editorId}
        className="lesson-code-editor"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        rows={Math.min(18, Math.max(8, code.split("\n").length + 1))}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />

      <div className="lesson-code-controls">
        <button type="button" className="lesson-code-run" onClick={runCode} disabled={runState === "loading" || runState === "running"}>
          {runState === "loading" ? "Loading Python" : runState === "running" ? "Running" : "Run Python"}
        </button>
        <button type="button" onClick={copyCode}>Copy code</button>
        <button type="button" onClick={resetCode}>Restore example</button>
      </div>

      <div className={`lesson-code-output lesson-code-output-${runState}`} aria-live="polite" aria-atomic="true">
        <span>Output</span>
        <pre>{output}</pre>
      </div>

      <p className="lesson-code-help">
        Standard Python and supported scientific packages run here without an account. Examples that depend on lesson files can still be developed here, then completed in the downloadable notebook with those files.
      </p>
    </section>
  );
}
