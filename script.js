const validLanguages = new Set(["de", "en", "pl"]);
const fallbackLanguage = "de";
const storageKey = "wedding-invite-language";

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = params.get("lang");

  if (queryLanguage && validLanguages.has(queryLanguage)) {
    return queryLanguage;
  }

  try {
    const storedLanguage = window.localStorage.getItem(storageKey);

    if (storedLanguage && validLanguages.has(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    return fallbackLanguage;
  }

  return fallbackLanguage;
}

function updateUrlLanguage(language) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.history.replaceState({}, "", url);
}

function setActiveLanguage(language, { persist = true, syncUrl = true } = {}) {
  if (!validLanguages.has(language)) {
    language = fallbackLanguage;
  }

  document.documentElement.dataset.siteLang = language;
  document.documentElement.lang = language;

  const buttons = document.querySelectorAll("[data-lang-switch]");

  buttons.forEach((button) => {
    const isActive = button.dataset.langSwitch === language;
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
  }

  if (syncUrl) {
    updateUrlLanguage(language);
  }
}

function bindLanguageSwitchers() {
  const buttons = document.querySelectorAll("[data-lang-switch]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveLanguage(button.dataset.langSwitch);
    });
  });
}

function init() {
  bindLanguageSwitchers();
  setActiveLanguage(getInitialLanguage(), { persist: false, syncUrl: false });
}

init();