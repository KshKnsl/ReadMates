// import { useState } from 'react'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import Home from './Pages/Home'
import Articles from './Pages/Articles'
import CreateArticle from './components/CreateArticle'
import Article from './components/Article'
import Rewards from './Pages/Rewards'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import NotFound from './Pages/NotFound'
import { ThemeProvider } from './context/Theme'
import { useEffect, useState } from 'react'
import DiscussionForum from './Pages/DiscussionForum'
import NewPost from './Pages/NewPost'
import ThreadDetail from './components/ThreadDetail'
// import Call from './Pages/Call'

function App() {
  const [themeMode, setThemeMode] = useState('light')
  const darkTheme = ()=>
  {
    setThemeMode('dark')
  }
  const lightTheme = ()=>
  {
    setThemeMode('light')
  }
  useEffect(() => {
    document.querySelector('html')?.classList.remove('dark','light')
    document.querySelector('html')?.classList.add(themeMode)
  }
  , [themeMode])

  return (
    <ThemeProvider value={{themeMode, darkTheme, lightTheme}}>
    <div className='h-full w-full'>
      <Navbar/>
      <div className='h-full w-full mx-auto'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:q" element={<Articles />} />
        <Route path="/article/:id" element={<Article/>} />
        <Route path="/create" element={<CreateArticle />} />
        <Route path="/create/:sessionID" element={<CreateArticle />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile/" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />        
        <Route path="/forum" element={<DiscussionForum />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
        <Route path="/new-thread" element={<NewPost />} />
        {/* <Route path="/call" element={<Call />} /> */}
      </Routes>
      </div>
    </div>
    </ThemeProvider>
  )
}

export default App
