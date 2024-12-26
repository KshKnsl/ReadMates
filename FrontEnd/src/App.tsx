// import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'
import Home from './Pages/Home'
import Articles from './Pages/Articles'
import CreateArticle from './components/CreateArticle'
import Article from './components/Article'
import Community from './Pages/Community'
import Rewards from './Pages/Rewards'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'

function App() {
  return (
    <div className='h-full w-full'>
      <div className='h-full w-full mx-auto'>
      <Routes>
        <Navbar/>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/article/:id" element={<Article/>} />
        <Route path="/create" element={<CreateArticle />} />
        <Route path="/create/:sessionID" element={<CreateArticle />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile/" element={<Profile/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </div>
    </div>
  )
}

export default App
