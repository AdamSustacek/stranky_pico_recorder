/**
 * main.js
 * Hlavní vstupní bod aplikace PicoRecorder Hub.
 * Inicializuje Firebase, naslouchá odkazům v Firestore
 * a obsluhuje formulář pro přidání nového odkazu.
 *
 * POZNÁMKA: Tento soubor musí být načten jako type="module" v index.html,
 * protože používá ES import/export syntaxi (vyžadováno Firebase SDK v9+).
 */

// ─── Firebase SDK importy (z CDN, ES moduly) ─────────────────────────────────
import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics }     from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ─── Lokální importy ──────────────────────────────────────────────────────────
import { firebaseConfig }               from "./config.js";
import { createLinkCard, showFormMessage, isValidUrl } from "./helpers.js";

// ─── Inicializace Firebase ────────────────────────────────────────────────────
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);

// ─── Reference na UI elementy ─────────────────────────────────────────────────
const toggleFormBtn  = document.getElementById('toggleFormBtn');
const cancelFormBtn  = document.getElementById('cancelFormBtn');
const submitFormBtn  = document.getElementById('submitFormBtn');
const addLinkForm    = document.getElementById('addLinkForm');
const linksContainer = document.getElementById('linksContainer');
const formMessage    = document.getElementById('formMessage');

const inputTitle = document.getElementById('linkTitle');
const inputUrl   = document.getElementById('linkUrl');
const inputDesc  = document.getElementById('linkDesc');

// ─── Zobrazení / skrytí formuláře ────────────────────────────────────────────
toggleFormBtn.addEventListener('click', () => {
    addLinkForm.classList.toggle('hidden');

    // Aktualizuj text tlačítka podle stavu formuláře
    if (addLinkForm.classList.contains('hidden')) {
        toggleFormBtn.textContent = '+ Přidat stránku';
    } else {
        toggleFormBtn.textContent = '✕ Zavřít';
        inputTitle.focus(); // přesuň kurzor do prvního pole
    }
});

cancelFormBtn.addEventListener('click', () => {
    addLinkForm.classList.add('hidden');
    toggleFormBtn.textContent = '+ Přidat stránku';
    clearForm();
});

// ─── Odeslání formuláře ───────────────────────────────────────────────────────
submitFormBtn.addEventListener('click', async () => {
    const title       = inputTitle.value.trim();
    const url         = inputUrl.value.trim();
    const description = inputDesc.value.trim();

    // Validace vstupů
    if (!title) {
        showFormMessage(formMessage, '⚠️ Zadej prosím název stránky.', 'error');
        inputTitle.focus();
        return;
    }
    if (!url || !isValidUrl(url)) {
        showFormMessage(formMessage, '⚠️ Zadej platnou URL adresu (např. https://github.com).', 'error');
        inputUrl.focus();
        return;
    }

    // Zakáž tlačítko během ukládání
    submitFormBtn.disabled = true;
    submitFormBtn.textContent = 'Ukládám...';

    try {
        // Uložení do Firestore
        await addDoc(collection(db, "links"), {
            title:       title,
            url:         url,
            description: description,
            createdAt:   new Date()
        });

        showFormMessage(formMessage, '✅ Odkaz byl úspěšně uložen!', 'success');
        clearForm();

        // Po 1.5 s zavři formulář
        setTimeout(() => {
            addLinkForm.classList.add('hidden');
            toggleFormBtn.textContent = '+ Přidat stránku';
        }, 1500);

    } catch (error) {
        console.error("Chyba při ukládání do Firebase:", error);
        showFormMessage(
            formMessage,
            '❌ Nepodařilo se uložit odkaz. Zkontroluj Firestore pravidla v Firebase konzoli.',
            'error'
        );
    } finally {
        // Vždy obnov tlačítko
        submitFormBtn.disabled = false;
        submitFormBtn.textContent = 'Uložit do Firebase';
    }
});

// ─── Real-time posluchač Firestore ───────────────────────────────────────────
const linksRef = collection(db, "links");
const q        = query(linksRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    linksContainer.innerHTML = '';

    if (snapshot.empty) {
        linksContainer.innerHTML = '<p class="empty-text">Zatím nebyly přidány žádné odkazy. Klikni na „+ Přidat stránku".</p>';
        return;
    }

    snapshot.forEach((doc) => {
        const card = createLinkCard(doc.data());
        linksContainer.appendChild(card);
    });

}, (error) => {
    // Zpracování chyby při načítání (např. špatná Firestore pravidla)
    console.error("Chyba při načítání z Firestore:", error);
    linksContainer.innerHTML = '<p class="empty-text">❌ Nepodařilo se načíst data. Zkontroluj Firestore pravidla.</p>';
});

// ─── Pomocná funkce pro vymazání formuláře ───────────────────────────────────
function clearForm() {
    inputTitle.value = '';
    inputUrl.value   = '';
    inputDesc.value  = '';
}
