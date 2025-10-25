import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const sanitizeSearchInput = (input) => {
  return input.replace(/\s+/g, " ").trim(); // Fazla boşlukları teke indirip baş-son boşlukları sil
};

const SearchBar = ({ value, onChange, placeholder = "Search for a product", debounceDelay = 400 }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value || "");
  const timeoutRef = useRef(null);

  // Eğer parent state değişirse inputValue güncellensin
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const sanitized = sanitizeSearchInput(inputValue);
      onChange(sanitized);
    }, debounceDelay);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue, debounceDelay, onChange]);

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw.length === 1 && raw === " ") return; // Başta boşluk olmasın
    setInputValue(raw);
  };

  return (
    <div className="input-group">
      <span className="input-group-text">🔍 {t("Search")}</span>
      <input
        type="text"
        className="form-control"
        placeholder={t(placeholder)}
        value={inputValue}
        onChange={handleChange}
        maxLength={120}
      />
    </div>
  );
};

export default SearchBar;
