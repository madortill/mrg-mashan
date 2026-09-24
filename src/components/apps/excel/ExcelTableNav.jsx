import { useState, useRef, useEffect } from "react";
import "./ExcelTableNav.css";

const ExcelTableNav = ({ label, tables, currentKey, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // אין טעם בחץ/תפריט אם עדיין אין יותר מטבלה אחת זמינה לניווט
  if (!tables || tables.length <= 1) {
    return <span className="excel-table-nav__label">{label}</span>;
  }

  return (
    <div className="excel-table-nav" ref={rootRef}>
      <button
        type="button"
        className="excel-table-nav__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="excel-table-nav__label">{label}</span>
        <span className={`excel-table-nav__arrow ${isOpen ? "is-open" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <ul className="excel-table-nav__menu">
          {tables.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                className={`excel-table-nav__item ${t.key === currentKey ? "is-active" : ""}`}
                onClick={() => {
                  onSelect(t.key);
                  setIsOpen(false);
                }}
              >
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExcelTableNav;