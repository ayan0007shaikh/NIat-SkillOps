'use client'

import { useState, useEffect } from 'react'
import { Play, Code2 } from 'lucide-react'

export default function PlaygroundPage() {
  const [mode, setMode] = useState<'web' | 'python'>('web')
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  
  // Web state
  const [html, setHtml] = useState('<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>Your code goes here</p>\n  </body>\n</html>')
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  padding: 20px;\n}')
  const [js, setJs] = useState('console.log("Playground ready!");')
  
  // Python state
  const [python, setPython] = useState('def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")')
  
  const [output, setOutput] = useState('')

  const runCode = () => {
    if (mode === 'web') {
      const combined = `
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `
      setOutput(combined)
    } else {
      // Basic mock output for Python for UI demo purposes
      let outputText = "Running Python script...\n"
      if (python.includes('greet("World")')) {
        outputText += "Hello, World!\n"
      } else {
        outputText += "Execution complete.\n"
      }
      
      const pythonOutput = `
        <html>
          <body style="background-color: #1e1e2e; color: #a6accd; font-family: monospace; padding: 20px;">
            <pre>${outputText}</pre>
          </body>
        </html>
      `
      setOutput(pythonOutput)
    }
  }

  // Initial load
  useEffect(() => {
    runCode()
  }, [mode])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
      
      {/* Playground Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-200 p-1 rounded-lg">
            <button 
              onClick={() => { setMode('web'); setActiveTab('html') }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${mode === 'web' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Web
            </button>
            <button 
              onClick={() => setMode('python')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${mode === 'python' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Python
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">Environment Ready</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Editor Pane */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-[#1e1e2e]">
          {/* Tabs */}
          <div className="flex h-10 bg-[#181825]">
            {mode === 'web' ? (
              <>
                <button 
                  onClick={() => setActiveTab('html')}
                  className={`flex items-center gap-2 px-4 text-xs font-semibold ${activeTab === 'html' ? 'bg-[#1e1e2e] text-white border-t-2 border-[#f38ba8]' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <span className="text-[#f38ba8]">5</span> HTML
                </button>
                <button 
                  onClick={() => setActiveTab('css')}
                  className={`flex items-center gap-2 px-4 text-xs font-semibold ${activeTab === 'css' ? 'bg-[#1e1e2e] text-white border-t-2 border-[#89b4fa]' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <span className="text-[#89b4fa]">3</span> CSS
                </button>
                <button 
                  onClick={() => setActiveTab('js')}
                  className={`flex items-center gap-2 px-4 text-xs font-semibold ${activeTab === 'js' ? 'bg-[#1e1e2e] text-white border-t-2 border-[#f9e2af]' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <span className="text-[#f9e2af]">JS</span> JAVASCRIPT
                </button>
              </>
            ) : (
              <button className="flex items-center gap-2 px-4 text-xs font-semibold bg-[#1e1e2e] text-white border-t-2 border-[#89dceb]">
                <Code2 className="w-4 h-4 text-[#89dceb]" /> main.py
              </button>
            )}
          </div>

          {/* Text Area */}
          <div className="flex-1 relative">
            {mode === 'web' ? (
              <textarea
                value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                onChange={(e) => {
                  if (activeTab === 'html') setHtml(e.target.value)
                  if (activeTab === 'css') setCss(e.target.value)
                  if (activeTab === 'js') setJs(e.target.value)
                }}
                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                spellCheck="false"
              />
            ) : (
              <textarea
                value={python}
                onChange={(e) => setPython(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
                spellCheck="false"
              />
            )}
          </div>

          {/* Footer Action */}
          <div className="h-12 bg-[#181825] flex items-center justify-end px-4 border-t border-black/20">
             <button 
               onClick={runCode}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
             >
               <Play className="w-4 h-4 fill-current" /> Run Code
             </button>
          </div>
        </div>

        {/* Output Pane */}
        <div className="w-1/2 bg-white flex flex-col">
          <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4">
             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output / Console</span>
          </div>
          <iframe 
            srcDoc={output}
            className="w-full flex-1 border-none bg-white"
            title="output"
            sandbox="allow-scripts"
          />
        </div>

      </div>
    </div>
  )
}
