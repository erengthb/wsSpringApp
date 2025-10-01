import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const sanitizeSearchInput = (input) => {
  return input.replace(/\s+/g, " ").trim(); // Fazla boşlukları teke indirip baş-son boşlukları sil
};

const SearchBar = ({
  onSearch,
  placeholder = "Search for a product", // i18n key olarak default
  initialValue = "",
  debounceDelay = 400,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialValue);
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true); // ✅ ilk render kontrolü

  useEffect(() => {
    // ✅ İlk render'da arama tetiklenmesin
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const sanitized = sanitizeSearchInput(inputValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(sanitized);
    }, debounceDelay);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue, debounceDelay, onSearch]);

  const handleChange = (e) => {
    const raw = e.target.value;

    // Başta boşlukla başlamasını engelle
    if (raw.length === 1 && raw === " ") return;

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
