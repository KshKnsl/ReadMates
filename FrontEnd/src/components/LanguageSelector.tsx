import React, { useEffect, useState } from 'react';
import { Languages  } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,fr,es,de,zh-CN,ja,ar',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const langSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (langSelect) {
        langSelect.addEventListener('change', (e) => {
          setCurrentLanguage((e.target as HTMLSelectElement).value);
        });
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex items-center relative ${className}`}>
      <Languages className="w-5 h-5 text-amber-700" /> {currentLanguage.toUpperCase()}
      <div id="google_translate_element" className="absolute top-0 left-0 w-full h-full opacity-0"></div>
    </div>
  );
};

export default LanguageSelector;

