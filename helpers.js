/**
 * helpers.js
 * Pomocné (utility) funkce pro PicoRecorder Hub.
 */

/**
 * Escapuje HTML znaky pro ochranu proti XSS útokům.
 * @param {string} str - Vstupní řetězec od uživatele
 * @returns {string} - Bezpečný řetězec pro vložení do DOM
 */
export function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Zobrazí zprávu ve formuláři (úspěch nebo chyba).
 * @param {HTMLElement} el - Element pro zprávu
 * @param {string} text - Text zprávy
 * @param {'success'|'error'} type - Typ zprávy
 */
export function showFormMessage(el, text, type) {
    el.textContent = text;
    el.className = `form-message ${type}`;
    el.classList.remove('hidden');

    // Zpráva zmizí po 4 sekundách
    setTimeout(() => {
        el.classList.add('hidden');
    }, 4000);
}

/**
 * Zkontroluje, zda je URL adresa platná.
 * @param {string} url - URL k validaci
 * @returns {boolean}
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Vytvoří DOM element karty odkazu.
 * @param {object} data - Data odkazu z Firestore
 * @returns {HTMLAnchorElement}
 */
export function createLinkCard(data) {
    const linkCard = document.createElement('a');
    linkCard.href = escapeHtml(data.url);
    linkCard.target = '_blank';
    linkCard.rel = 'noopener noreferrer'; // bezpečnostní atribut pro target="_blank"
    linkCard.className = 'hub-link-card';

    linkCard.innerHTML = `
        <div class="link-icon-bg">🔗</div>
        <div class="link-details">
            <span class="link-name">${escapeHtml(data.title)}</span>
            ${data.description
                ? `<span class="link-desc">${escapeHtml(data.description)}</span>`
                : ''}
        </div>
        <span class="link-arrow">➔</span>
    `;

    return linkCard;
}
