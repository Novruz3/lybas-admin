import './assets/styles/App.css';
import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Routes from './routes/Routes';

export const AppContext = createContext();

function App() {
  const [lang, setLang] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'tm');
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    localStorage.setItem('lang', lng);
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  useEffect(() => {
    const localLang = localStorage.getItem('lang');
    if (!localLang) {
      localStorage.setItem('lang', lang);
      changeLanguage(lang);
    } else {
      setLang(localLang);
    }
  }, [lang]);

  return (
    <AppContext.Provider
      value={{
        t: t,
        changeLanguage: changeLanguage,
        lang: lang
      }}
    >
      <div className="app">
        <Routes />
      </div>
    </AppContext.Provider>
  );
}

export default App;
