import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Navbar.css";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M7 9l5 5 5-5" />
    </svg>
  );
}

function Navbar({
  title,
  items,
  onSelect,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const navbarRef = useRef(null);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      closeOnOutsideClick
    );

    document.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        closeOnOutsideClick
      );

      document.removeEventListener(
        "keydown",
        closeOnEscape
      );
    };
  }, []);

  function selectItem(item) {
    if (item.disabled) {
      return;
    }

    onSelect(item.id);
    setIsOpen(false);
  }

  return (
    <nav
      ref={navbarRef}
      className="course-navbar"
      aria-label="ניווט בלומדה"
    >
      <button
        type="button"
        className="course-navbar__trigger"
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen(
            (previousValue) =>
              !previousValue
          )
        }
      >
        <span className="course-navbar__title">
          {title}
        </span>

        <span className="course-navbar__arrow">
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <div className="course-navbar__menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[
                "course-navbar__item",
                `course-navbar__item--${item.status}`,
              ].join(" ")}
              disabled={item.disabled}
              onClick={() =>
                selectItem(item)
              }
            >
              <span className="course-navbar__status">
                {item.status ===
                  "completed" && "✓"}

                {item.status ===
                  "current" && "•"}

                {item.status ===
                  "next" && "←"}

                {item.status ===
                  "locked" && "🔒"}
              </span>

              <span>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;