import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-500 to-indigo-800 flex flex-col items-center justify-center'>
      <h1 className='text-4xl text-white mb-8 font-bold font-audiowide'>TechDetech App</h1>
      <div className='bg-purple-700 rounded-lg p-8 shadow-lg neon-border'>
        <button
          onClick={() => setCount((count) => count + 1)}
          className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded'
        >
          count is {count}
        </button>
        <p className='mt-4 text-purple-200'>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
