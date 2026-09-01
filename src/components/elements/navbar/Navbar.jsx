import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Navbar.css";


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}


function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}


function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}


function StatusIcon({
  status,
}) {
  if (status === "completed") {
    return <HistoryIcon />;
  }

  if (status === "current") {
    return <ChevronIcon />;
  }

  if (status === "next") {
    return <HistoryIcon />;
  }

  return <LockIcon />;
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

    function handleOutside(event) {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    }


    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }


    document.addEventListener(
      "pointerdown",
      handleOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };

  }, []);


  function handleSelect(item) {
    if (item.disabled) {
      return;
    }

    onSelect(item.id);

    setIsOpen(false);
  }


  return (
    <nav
      ref={navbarRef}
      className={[
        "course-navbar",
        isOpen
          ? "course-navbar--open"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="ניווט בלומדה"
    >

      <button
        type="button"
        className="course-navbar__trigger"
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen(
            (previous) => !previous
          )
        }
      >

        <span className="course-navbar__search">
          <SearchIcon />
        </span>

        <span className="course-navbar__title">
          {title}
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
                handleSelect(item)
              }
            >

              <span className="course-navbar__status">
                <StatusIcon
                  status={item.status}
                />
              </span>

              <span className="course-navbar__label">
                {item.label}
              </span>

              <span
                className="course-navbar__spacer"
                aria-hidden="true"
              />

            </button>
          ))}

        </div>
      )}

    </nav>
  );
}

export default Navbar;