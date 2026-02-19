import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Avatar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-6 border-l border-blue-200/60"
        title="Mon Profil"
      >
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-base sm:text-2xl shadow-lg flex-shrink-0 ring-2 ring-blue-200">
          {currentUser?.prenom?.charAt(0)}
          {currentUser?.nom?.charAt(0)}
        </div>
        <div className="hidden sm:flex flex-col justify-center min-w-0">
          <p className="font-semibold text-blue-900 text-xs sm:text-base truncate max-w-[100px] sm:max-w-[160px]">
            {currentUser?.prenom + " " + currentUser?.nom}
          </p>
          <p className="text-xs text-blue-400 font-medium">
            {currentUser?.role}
          </p>
        </div>
      </div>
      {/* Dropdown ou actions supplémentaires à ajouter ici si besoin */}
    </div>
  );
};

export default Avatar;
