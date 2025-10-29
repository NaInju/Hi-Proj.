//App.jsx

import React,{ useState } from 'react'

import Header from './components/Header';
import MainVisual from './components/MainVisual';
import EnterScroll from './components/EnterScroll';
import BrandInfo from './components/BrandInfo';
import ProductInfo from './components/ProductInfo';
import Financial from './components/Financial';
import News from './components/News';
import ESG from './components/ESG';
import Footer from './components/Footer';

import './App.css'
import './styles/reset.css';
import './styles/main.css';

import useScrollReveal from "./hooks/useScrollReveal";

function App() {
  // useScrollReveal();

  return (
    <>
      <Header />
      <MainVisual />
      <EnterScroll />
      <BrandInfo />
      <ProductInfo />
      <Financial />
      <News />
      <ESG />
      <Footer />
    </>
  )
}

export default App
