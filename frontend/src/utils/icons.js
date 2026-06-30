export function heartIcon(filled = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="${filled ? "#e63946" : "none"}" stroke="#e63946" stroke-width="2">
    <path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3C11.7 4.7 13.4 3.7 15.4 4c3.6.5 5.2 4.2 3.6 7.7C19.5 16.4 12 21 12 21z"/>
  </svg>`;
}

export function userIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
  </svg>`;
}

export function logoutIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>`;
}
