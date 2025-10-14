// src/components/Tabs.jsx
import React, { useEffect, useId, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Reusable Tabs component with a11y and keyboard navigation
 * - props.tabs: [{ key, icon, label, content }]
 * - storageKey: optional localStorage key to persist active tab
 */
const Tabs = ({ tabs, storageKey }) => {
  const defaultKey = tabs?.[0]?.key;
  const [activeKey, setActiveKey] = useState(() => {
    if (!storageKey) return defaultKey;
    try {
      return localStorage.getItem(storageKey) || defaultKey;
    } catch {
      return defaultKey;
    }
  });

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, activeKey);
    } catch {}
  }, [activeKey, storageKey]);

  const tablistId = useId();

  const onKeyDown = useCallback(
    (e) => {
      const idx = tabs.findIndex((t) => t.key === activeKey);
      if (idx < 0) return;
      // Arrow navigation
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const next = tabs[(idx + 1) % tabs.length];
        setActiveKey(next.key);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        setActiveKey(prev.key);
        e.preventDefault();
      } else if (e.key === "Home") {
        setActiveKey(tabs[0].key);
        e.preventDefault();
      } else if (e.key === "End") {
        setActiveKey(tabs[tabs.length - 1].key);
        e.preventDefault();
      }
    },
    [activeKey, tabs],
  );

  const activeTab = useMemo(
    () => tabs.find((t) => t.key === activeKey) || tabs[0],
    [activeKey, tabs],
  );

  return (
    <div className="tabs-card card shadow-sm">
      <div className="card-header bg-white border-0">
        <ul
          className="nav nav-tabs card-header-tabs justify-content-center flex-wrap"
          role="tablist"
          aria-orientation="horizontal"
          id={tablistId}
          onKeyDown={onKeyDown}
          style={{ gap: 8 }}
        >
          {tabs.map(({ key, icon, label }) => {
            const isActive = key === activeKey;
            return (
              <li className="nav-item" key={key}>
                <button
                  type="button"
                  className={`nav-link d-flex align-items-center gap-2 ${
                    isActive ? "active" : ""
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${key}`}
                  id={`tab-${key}`}
                  onClick={() => setActiveKey(key)}
                  // Better hit area on mobile
                  style={{ whiteSpace: "nowrap" }}
                >
                  {icon ? (
                    <span className="material-icons" aria-hidden="true">
                      {icon}
                    </span>
                  ) : null}
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card-body">
        <div
          role="tabpanel"
          id={`panel-${activeTab.key}`}
          aria-labelledby={`tab-${activeTab.key}`}
        >
          {activeTab.content}
        </div>
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      icon: PropTypes.string, // material icon name
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  storageKey: PropTypes.string,
};

export default Tabs;
