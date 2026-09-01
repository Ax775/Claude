# App Store-indiening — stap voor stap

> Alles wat je nodig hebt staat klaar in `~/Desktop/paced-appstore/`:
> `App.ipa` (Xaven-gesigneerd, mét safe-area-fix) en `screenshots-6.9inch/`
> (4× 1320×2868). Reken op ~45 min actief werk + wachttijd.
>
> Volgorde is bewust: build eerst uploaden (verwerking duurt ~10 min en loopt
> op de achtergrond door terwijl jij de formulieren invult).

---

## Stap 1 · Build uploaden met Transporter (~10 min)

1. Open **Transporter** (gratis, Mac App Store). Nog niet geïnstalleerd?
   Installeer 'm eerst — het is de eenvoudigste route.
2. Log in met je Apple-ID (dezelfde als je Xaven-developeraccount).
3. Sleep **`~/Desktop/paced-appstore/App.ipa`** in het venster.
4. Klik **Deliver**.
5. Wacht op "Delivery Successful". Daarna doet Apple nog ~5–15 min
   serververwerking voordat de build in App Store Connect verschijnt.

**Mogelijke meldingen:**
- *"Missing compliance"* → normaal; los je op in stap 5.
- *ITMS-90xxx-fout* → plak 'm bij mij, dan fix ik de build.

> Je kunt meteen door naar stap 2; de upload loopt door.

---

## Stap 2 · App Information invullen (~10 min)

App Store Connect → jouw app → linkerkolom **App Information**.

| Veld | Waarde |
|---|---|
| Name | `Paced - Cyclus & Welzijn` (staat al goed) |
| Subtitle | `Rustig cyclus-inzicht` |
| Privacy Policy URL | `https://paced.nl/?legal=privacy` |
| Category — Primary | **Health & Fitness** |
| Category — Secondary | **Lifestyle** |
| Content Rights | Aanvinken: bevat geen third-party content |

**Age Rating** → klik *Edit* en beantwoord alles met **None/No**, behalve:
- *Medical/Treatment Information* → **Infrequent/Mild**

Resultaat moet **12+** zijn. Dit is de bewuste keuze uit je MDR-dossier:
de app geeft algemene informatie, geen diagnose of behandeling.

---

## Stap 3 · Pricing and Availability (~2 min)

Linkerkolom → **Pricing and Availability**:
- **Price**: `Free` (Nederland → alle landen)
- **Availability**: alle landen laten aanstaan
- Geen pre-orders, geen Educational Discount

---

## Stap 4 · App Privacy invullen (~15 min — de meest precieze stap)

Linkerkolom → **App Privacy** → *Get Started*.

⚠️ **Antwoord "Yes" op "Does this app collect data?"** — ook al blijft
vrijwel alles lokaal. Reden: de optionele partner-koppeling stuurt data naar
Supabase, en Apple kijkt naar wat de app *kan*, niet wat één gebruiker doet.
Onjuist "No" antwoorden is een grond voor verwijdering ná publicatie.

**Vink deze vier data-types aan** (allemaal: purpose *App Functionality*,
*Linked to user* = **Yes**, *Used for tracking* = **No**):

| Categorie | Type |
|---|---|
| Contact Info | Email Address |
| Health & Fitness | Health and Fitness |
| User Content | Other User Content |
| Identifiers | User ID |

**Alle overige categorieën: No** — geen Location, geen Financial Info, geen
Usage Data, geen Diagnostics, geen Device ID, geen Purchases, geen Browsing
of Search History.

Bij de toelichtingsvelden: kopieer de Engelse teksten uit
[app-store-privacy.md](app-store-privacy.md) (secties "Privacy Practices").
Die zijn zo geschreven dat ze exact matchen met je in-app privacyverklaring —
Apple vergelijkt die twee.

---

## Stap 5 · Versie 1.0 vullen (~10 min)

Linkerkolom onder *iOS App* → **1.0 Prepare for Submission**.

**5a · Screenshots**
1. Klik rechtsboven **"View All Sizes in Media Manager"**.
2. Kies de **6.9" iPhone**-slot (niet de 6.5" die standaard openstaat —
   jouw bestanden zijn 1320×2868 en horen in 6.9").
3. Sleep alle vier bestanden uit `screenshots-6.9inch/` in deze volgorde:
   `01-vandaag` → `02-voeding` → `03-logboek` → `04-inzichten`.
   De eerste drie zijn wat mensen zien vóór ze doorklikken.
4. Apple schaalt automatisch naar kleinere toestellen; andere slots hoef je
   niet te vullen.

**5b · Teksten** — copy-paste uit [app-store-metadata.md](app-store-metadata.md):
- *Promotional Text* (170 tekens, later aanpasbaar zonder review)
- *Description* (de lange NL-tekst)
- *Keywords* → `cyclus,menstruatie,vruchtbaar,ovulatie,voeding,calorie,zwanger,welzijn,gezond,vrouw,fase,tracker`
  (géén spaties na de komma's — die tellen mee als tekens)
- *Support URL* → `https://paced.nl/support`
- *Marketing URL* → `https://paced.nl`
- *Copyright* → `2026 Xaven BV`

**5c · Engelse localisatie (optioneel maar aanbevolen)**
Rechtsboven in het taalmenu → *Add Language* → **English (U.K.)** → plak de
EN-teksten uit hetzelfde document. Verdubbelt je vindbaarheid.

**5d · Build koppelen**
Scroll naar **Build** → klik **+** → kies de zojuist geüploade build.
(Zie je 'm nog niet? Apple is nog aan het verwerken — wacht 5 min en ververs.)

**5e · Export Compliance**
Vraag: *"Does your app use encryption?"* → **Yes** (HTTPS)
Vervolgvraag: *"Does it qualify for exemption?"* → **Yes**
(Standaard HTTPS valt onder de ECCN 5D992.c-uitzondering — staat zo in je
metadata-doc.)

**5f · App Review Information**
- Contactgegevens: je naam, telefoonnummer, e-mail.
- **Sign-in required: NEE** — de app werkt zonder account. Dit is belangrijk:
  de reviewer moet niets hoeven aanmaken.
- **Notes** — plak dit; het voorkomt de twee meest waarschijnlijke vragen:

```
Paced is a calm menstrual-cycle and wellbeing tracker. All health data is
stored locally on the device — no account is required to use the app, so no
demo credentials are needed. Simply open the app and complete the short
onboarding.

Regarding guideline 3.1.1: this version contains no in-app purchases or
external payment links. All features are free.

Regarding health claims: Paced is a wellness and awareness tool, not a
medical device. It provides general, descriptive information about cycle
phases and does not diagnose, treat, or predict any medical condition. A
disclaimer to that effect is shown in the app under Settings, and in the
onboarding consent screen.

The optional partner-linking feature (Settings → Partner) shares only the
current cycle phase with a partner the user explicitly invites, and can be
disconnected at any time.
```

---

## Stap 6 · Eerst testen via TestFlight (~15 min, sterk aangeraden)

Vóór je indient: tabblad **TestFlight** → je build → jezelf als *Internal
Tester* toevoegen → TestFlight-app op je iPhone → installeren.

Loop dit door op echt glas:
- [ ] Onboarding: naam, cyclusdatum, consent-scherm
- [ ] Kop staat vrij van de statusbalk (dit was de bug van vandaag)
- [ ] Een dag loggen → app sluiten → heropenen → data staat er nog
- [ ] Instellingen: taal wisselen, donkere modus, export
- [ ] Feedback-knop opent je mail-app
- [ ] Vliegtuigmodus → app blijft werken

---

## Stap 7 · Indienen

Rechtsboven **Add for Review** → **Submit**.

- **Release-optie**: kies *"Manually release this version"*, dan bepaal jij
  het moment van livegang (handig om samen te laten vallen met je Product
  Hunt-/Reddit-launch).
- Reviewtijd: meestal **24–72 uur**.

---

## Als Apple afwijst

Niet schrikken — bij een eerste inzending is dat eerder regel dan
uitzondering, en het is een dialoog, geen eindstation. De twee meest
waarschijnlijke punten:

| Guideline | Wat ze zeggen | Aanpak |
|---|---|---|
| **4.2 Minimum Functionality** | "lijkt een website in een wrapper" | Wijs op offline gebruik, lokale opslag, Apple Health-export. Plan B: HealthKit-integratie in 1.1 |
| **1.4.1 / 5.1.x Health** | vragen over medische claims | Verwijs naar de disclaimer + `docs/mdr-positioning.md` |

Plak hun bericht bij mij, dan formuleer ik het antwoord of bouw ik de
gevraagde aanpassing.

---

## Na goedkeuring

- [ ] App live zetten (bij *manual release*)
- [ ] App Store-link toevoegen aan paced.nl en aan je launch-copy
- [ ] Link opnemen in je Product Hunt-/Reddit-posts
