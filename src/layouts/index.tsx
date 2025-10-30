import { Outlet } from 'react-router-dom'
import { Comps } from '../components'

const FullLayout = () => {
  return (
    <div className='bg-darkBg text-darkText'>

      <Outlet />
    </div>
  )
}

const ContentLayout = () => {
  return (
    <div className="min-h-screen flex bg-darkBg text-darkText">
      <div className="h-screen sticky top-0">
        <Comps.Sidebar />
      </div>
      <main className="flex-1 p-6 overflow-auto h-screen bg-zinc-950 ">
        <Outlet />
      </main>
    </div>
  )
}

export { FullLayout, ContentLayout }