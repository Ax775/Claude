# Feitencheck-checklist artikelen — vóór publieke launch

> **Waarom:** de 32 artikelen (16 NL + 16 EN-vertalingen) zijn guardrail-clean en
> MDR-veilig qua *vorm* (beschrijvend, disclaimer per artikel, geen diagnose/
> behandeling), maar de cyclus-inhoudelijke **beweringen** zijn nog niet door een
> mens met domeinkennis getoetst. Dit is YMYL-content → check vóór je actief
> bezoekers uitnodigt.
>
> **Hoe te gebruiken:** de EN-artikelen zijn 1-op-1 vertalingen, dus check per claim
> (hieronder), niet per bestand — keurt de claim in NL goed, dan geldt dat voor de
> EN-tegenhanger. Laat idealiter een huisarts of (cyclus-)diëtist dit afvinken.
> Vink `[x]` = akkoord, of noteer een correctie.

Legenda ernst: 🟢 breed geaccepteerd · 🟡 aannemelijk maar formulering checken · 🔴 verifieer expliciet.

---

## A. Voeding & opname

- [ ] **🟢 Menstruatie kost ijzer** — "Tijdens je menstruatie verliest je lichaam wat ijzer."
      _menstruatiefase, eten-tijdens-menstruatie._ Check: geldt bij menstruatie in het algemeen; geen claim van tekort/bloedarmoede.
- [ ] **🟢 Genoemde ijzerbronnen kloppen** — bladgroenten, linzen, bonen, pompoenpitten, volkoren granen.
      _menstruatiefase, eten-tijdens-menstruatie._ Check: alle genoemde items zijn daadwerkelijk (non-heem) ijzerbronnen.
- [ ] **🟢 Vitamine C verbetert non-heem-ijzeropname** — "citroen / paprika helpt de opname van ijzer uit plantaardige bronnen."
      _menstruatiefase, eten-tijdens-menstruatie._ Check: standaard voedingsleer; formulering blijft "helpt", geen belofte.
- [ ] **🟡 Magnesiumbronnen + framing** — "pure chocolade, pompoenpitten, noten, bladgroenten … waar sommige mensen baat bij zeggen te hebben."
      _luteale-fase, voeding-luteale-fase._ Check: bronnen kloppen; de PMS-baat is bewust gehedged ("zeggen te hebben") — akkoord met die voorzichtigheid?
- [ ] **🟡 Gefermenteerde voeding "ondersteunt de darmen"** — zuurkool, kefir, yoghurt, kimchi.
      _folliculaire-fase, voeding-folliculaire-fase._ Check: acceptabele algemene bewering, geen specifieke gezondheidsclaim?
- [ ] **🟢 Vezelbronnen** — volle granen, peulvruchten, lijnzaad, groenten "leveren vezels die je spijsvertering ondersteunen."
      _eten-rond-de-eisprong._ Check: correct en niet-overdreven.

## B. Cyclusfysiologie

- [ ] **🟢 Vier-fasen-model + volgorde** — menstruatie → folliculair → ovulatie → luteaal.
      _menstruatiecyclus-fases + alle fase-artikelen._
- [ ] **🟡 Folliculaire fase: "oestrogeen stijgt geleidelijk" na de menstruatie.**
      _folliculaire-fase, trainen-folliculaire-fase._ Check: klopt; let op dat het beschrijvend blijft, niet als wet gepresenteerd (dat doet de tekst al: "geen wet").
- [ ] **🟢 Ovulatie: "er komt een eicel vrij, rond het midden van de cyclus."**
      _eisprong-ovulatie._ Check: correct; "rond het midden" is de juiste nuance (varieert).
- [ ] **🟢 Luteale fase = tussen eisprong en volgende menstruatie.**
      _luteale-fase._
- [ ] **🔴 "Je lichaam doet meer werk / verbrandt meer in de luteale fase → extra eten is oké."**
      _luteale-fase, voeding-luteale-fase._ Check: er is bewijs voor een *bescheiden* luteale BMR-stijging, maar individueel variabel. Is de framing ("meer werk", geen getallen) verdedigbaar volgens jouw reviewer? Belangrijkste claim om te bevestigen.

## C. Vruchtbaarheid & anticonceptie (MDR-gevoelig)

- [ ] **🔴 Vruchtbaar venster + kalendermethode** — "De kalendermethode geeft een schatting, geen zekerheid — wil je een zwangerschap voorkomen, gebruik dan een betrouwbare anticonceptiemethode."
      _eisprong-ovulatie, eten-rond-de-eisprong._ Check: dit is de kritieke MDR-zin. Bevestig dat hij (a) géén betrouwbaarheids-% claimt, (b) géén anticonceptie-advies geeft, (c) expliciet naar betrouwbare anticonceptie doorverwijst. **Nooit** wijzigen naar iets dat als anticonceptiemethode leest.

## D. Energie- & stemmingspatronen per fase (subjectief, laag risico)

- [ ] **🟡 "Meer energie folliculair/ovulatie, lager menstruatie/luteaal; stemmingswisselingen luteaal."**
      _alle fase- en beweging-artikelen._ Check: overal gehedged met "veel mensen ervaren / kan / soms". Bevestig dat die voorzichtige formulering overal staat en nergens als stellige voorspelling.
- [ ] **🟢 Beweging-framing** — "beweging als plezier/verzorging, nooit als straf of compensatie; rust is net zo waardevol."
      _hele beweging-cluster._ Check: dit is toon/veiligheid, geen medische claim — akkoord.

---

## Generiek (op elke pagina aanwezig — steekproef 1×)
- [ ] Disclaimer onderaan: "geen medisch hulpmiddel / raadpleeg een arts." ✅ automatisch door de SSG; steekproef 1 artikel.
- [ ] Geen calorie-/gewichtsgetallen, geen dieetcultuur. ✅ afgedwongen door guardrails in de build; geen handmatige check nodig.

## Na goedkeuring
- Correcties? → pas het NL-bestand in `content/articles/nl/` aan (+ de EN-tegenhanger met dezelfde `translationKey`), `npm run build`, commit. Zeg het mij, dan verwerk ik de correcties.
- Alles akkoord? → dan is de content launch-klaar en vervalt de enige echte pre-launch-blocker.

> Los hiervan: de **app** zelf (nutrition.js) toont berekende dag-doelen (kcal/eiwit
> via Mifflin-St Jeor + fase-opslag). Die berekening is los getest en valt buiten
> deze content-check, maar als je reviewer toch kijkt: de luteale kcal-ophoging daar
> steunt op dezelfde aanname als claim B/🔴 hierboven.
