# Churchill Variant Bots (UK, USA, USSR)

Drei unabhängige Node.js-Programme, die die Formellogik der Excel-Datei
`Churchill_Variant_Bot.xlsx` (Blätter „AI interface“ und „variables“)
nachbilden. Jedes Programm ist eigenständig lauffähig, hat keine
Abhängigkeiten und bildet die vier Phasen eines Konferenz-Zugs ab:

| Phase | Ergebnis |
|---|---|
| **Agenda** | Wahl der Agenda-Karte (1–7), Top-10-Prioritäten für die Issue-Auswahl |
| **Meeting** | Issue-Advancement (Staff-Karte bzw. Leader-Anweisung), Prioritäten für Staff-Einsatz, Top-7-Advancement-Prioritäten, Reaktion (Debatte) auf das Advancement der beiden anderen Mächte |
| **Decision** | max. Anzahl zu finanzierender Pol/Mil-Issues, Theater für Produktion / D.O., Theater-Leadership-Bonus (Europa / Pazifik) |
| **War** | Top-7-Prioritäten für Clandestine Networks, Top-3 für Political Alignment |

| Programm | Nation | Leader |
|---|---|---|
| `uk-bot.js` | UK | Churchill |
| `usa-bot.js` | USA | Roosevelt |
| `ussr-bot.js` | USSR | Stalin |

## Aufruf

```sh
node bots/uk-bot.js                                   # alle Phasen, Standard-Setup
node bots/usa-bot.js --state bots/example-state.json  # Setup aus JSON-Datei
node bots/ussr-bot.js --phase meeting --conference 2 --ussr-vp 3
node bots/uk-bot.js --seed 42 --json                  # reproduzierbar, JSON-Ausgabe
node bots/uk-bot.js --help
```

Optionen:

- `--phase all|agenda|meeting|decision|war` – nur eine Phase auswerten
- `--seed N` – Zufallsgenerator festlegen (entspricht einem festen `RAND()`-Durchlauf)
- `--json` – Ergebnis als JSON statt Text
- `--state FILE` – Turn-Setup als JSON (Kommandozeilen-Flags überschreiben die Datei)

## Turn-Setup

Entspricht den Eingabefeldern „Turn setup“ der Excel-Datei (`y` = `true`):

| JSON-Feld | Flag | Excel-Zelle |
|---|---|---|
| `bolero` | `--bolero` | Bolero space occupied (E3) |
| `normandy` | `--normandy` | Normandy occupied (E4) |
| `centralItaly` | `--central-italy` | Central Italy occupied (E5) |
| `germanyDefeated` | `--germany-defeated` | german defeated (E6) |
| `japanDefeated` | `--japan-defeated` | japan defeated (E7) |
| `vp.uk`, `vp.us`, `vp.ussr` | `--uk-vp N` usw. | UK/US/USSR VP (E8–E10) |
| `usEurLeadership` | `--us-eur-leadership` | US Eur leadership (E11) |
| `ukPacLeadership` | `--uk-pac-leadership` | UK Pac leadership (E12) |
| `trinity` | `--trinity` | Trinity (E13) |
| `conference` | `--conference N` | conference # (E14) |
| `cardsInHand` | `--cards N` | Cards in hand (F30) |
| `rooseveltChurchill` (nur USA) | `--roosevelt-churchill self-determination\|neutral\|colonialism` | globaler Issue-Status Roosevelt–Churchill (J77/L77/N77) |
| `ussrPacificFlag` (nur USSR) | `--ussr-pacific-flag` | unbeschriftete Zelle T25 |
| `ussrABombFlag` (nur USSR) | `--ussr-abomb-flag` | unbeschriftete Zelle T26 |

Siehe `example-state.json`.

## Abweichungen von der Excel-Datei

- Die Issue-Auswahl von UK und USSR rankt in der Tabelle die Zeilen 3–17 nur
  untereinander (`RANK(H3,H$3:H$17)`), die Zeilen 18–20 aber über 3–20. Das
  kann doppelte Ränge erzeugen. Die Programme ranken alle 18 Issues gemeinsam,
  wie es bei der US-Spalte der Fall ist.
- Optionen mit Gewicht 0 (in der Tabelle unmöglich bzw. Rang 100) werden nicht
  ausgegeben. Gibt es weniger mögliche Optionen als Listenplätze, ist die Liste
  kürzer statt `#N/A` zu zeigen; ohne mögliches Theater erscheint `none`.

## Tests

```sh
node --test bots/test/bots.test.js
```
