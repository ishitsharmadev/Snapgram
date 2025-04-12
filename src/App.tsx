import './globals.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className='flex h-screen'>
      <Outlet/>
      <Toaster/>
    </div>
  )
}

export default App
