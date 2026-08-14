# Trinkgeld einrichten

Die Funktion ist fertig eingebaut, aber **abgeschaltet**, solange kein
Zahlungsweg hinterlegt ist. Ohne Eintrag gibt es keinen Knopf, keinen
Menüpunkt und keine Seite `/unterstuetzen` – sie liefert dann eine 404.

Es steht bewusst keine Zahlungsadresse im Quelltext. Alles kommt aus
Umgebungsvariablen bei Vercel.

## Schritt 1: Einen Anbieter auswählen

Du brauchst nur einen. Mehrere gehen auch – dann erscheinen mehrere Knöpfe.

| Anbieter | Gebühren (Stand der Recherche prüfen) | Besonderheit |
|---|---|---|
| **PayPal.me** | Bei „Freunde & Familie“ innerhalb der EU meist kostenlos, sonst Gebühr je Zahlung | Am schnellsten eingerichtet, wenn du schon PayPal hast. Betrag lässt sich vorbelegen. |
| **Ko-fi** | Grundversion ohne Provision, Zahlungsgebühren fallen trotzdem an | Zahlende brauchen **kein Ko-fi-Konto**. Ob sie ganz ohne Anmeldung mit Karte zahlen können, hängt davon ab, was du bei Ko-fi als Auszahlung verbindest – siehe unten. Sehr verbreitet für genau diesen Zweck. |
| **Buy Me a Coffee** | Prozentuale Gebühr | Wie Ko-fi, andere Optik. |
| **Stripe Payment Link** | Gebühr je Zahlung | Wirkt am professionellsten, braucht aber ein Stripe-Konto mit Identitätsprüfung. |

Prüfe die aktuellen Gebühren und Bedingungen selbst auf der Seite des
Anbieters, bevor du dich entscheidest – ich gebe hier bewusst keine Zahlen an,
die morgen veraltet sein können.

### Ko-fi: Stripe oder PayPal verbinden

Bei Ko-fi verbindest du unter *Settings → Payments* einen Auszahlungsweg. Die
Wahl entscheidet darüber, wer dir überhaupt etwas schicken kann:

- **Stripe verbunden:** Zahlende geben ihre Kartendaten direkt auf der
  Ko-fi-Seite ein. Kein Konto, keine Anmeldung, kein Umweg. Du brauchst dafür
  einmalig eine Identitätsprüfung, danach geht das Geld aufs Bankkonto.
- **Nur PayPal verbunden:** Zahlende landen bei PayPal. Wer dort ein Konto
  hat, zahlt in zwei Klicks. Wer keines hat, ist auf PayPals Gastzahlung
  angewiesen – die ist nicht überall und nicht immer verfügbar.

Beides gleichzeitig geht auch; dann hat der Zahlende die Wahl. Wenn dir wichtig
ist, dass niemand an einer Anmeldung scheitert, nimm Stripe.

**Hinweis für dich als Schweizer:** TWINT hat keinen allgemein nutzbaren
Zahlungslink für Websites. Wenn du TWINT anbieten willst, geht das über
einen der Anbieter mit Schweizer Abdeckung oder über einen QR-Code, den du
selbst auf die Seite stellst. Sag Bescheid, dann bauen wir das ein.

## Schritt 2: Werte bei Vercel eintragen

1. <https://vercel.com> öffnen, Projekt anklicken
2. **Settings → Environment Variables**
3. Für jeden Anbieter, den du nutzen willst, eine Variable anlegen:

| Variable | Was hineingehört | Beispiel |
|---|---|---|
| `NEXT_PUBLIC_PAYPAL_ME` | Nur der Benutzername, **ohne @** | `AlvinRamdedovic` |
| `NEXT_PUBLIC_KOFI` | Nur der Benutzername | `rechnerliste` |
| `NEXT_PUBLIC_BUYMEACOFFEE` | Nur der Benutzername | `rechnerliste` |
| `NEXT_PUBLIC_STRIPE_LINK` | Die vollständige Adresse | `https://buy.stripe.com/abc123` |
| `NEXT_PUBLIC_SUPPORT_PURPOSE` | Ein Satz, wofür das Geld ist | siehe unten |

Bei „Environment“ alle drei Haken setzen (Production, Preview, Development).

4. **Deployments → … → Redeploy.** Umgebungsvariablen wirken erst nach einem
   neuen Deployment.

Häufigster Fehler: das **@** aus dem Profil mitkopieren. `@MaxMuster` wird in
der Adresse zu `%40MaxMuster`, und PayPal zeigt „Sorry. It looks like nothing
was found at this location.“ Der Code schneidet ein führendes @ und eine
versehentlich eingefügte ganze Adresse inzwischen selbst ab – trag den Namen
trotzdem sauber ein.

## Kryptowährungen

Zusätzlich oder stattdessen kannst du Wallet-Adressen anzeigen lassen. Trag
jeweils **nur die Adresse** ein, sonst nichts:

| Variable | Währung | Netzwerk |
|---|---|---|
| `NEXT_PUBLIC_CRYPTO_BTC` | Bitcoin | Bitcoin |
| `NEXT_PUBLIC_CRYPTO_ETH` | Ethereum | Ethereum (ERC-20) |
| `NEXT_PUBLIC_CRYPTO_SOL` | Solana | Solana |
| `NEXT_PUBLIC_CRYPTO_USDT_TRC20` | Tether | TRON (TRC-20) |

Auf der Seite steht „Kryptowährung“ als eine Zahlungsart neben PayPal und den
übrigen. Ein Klick öffnet ein Fenster mit der Auswahl der Währung, und erst im
zweiten Schritt erscheint die Adresse – im Klartext, mit Kopierknopf und, bei
Bitcoin und Ethereum, mit einem Link, der die Wallet-App öffnet. Kein Widget,
kein Dienst dazwischen, keine Datenübertragung.

**Die Adresse wird auf ihr Format geprüft.** Passt sie nicht zur jeweiligen
Kette, erscheint sie gar nicht erst. Der Grund ist hart: Eine Krypto-Zahlung
an eine falsche Adresse ist endgültig verloren, und niemand kann sie
zurückholen. Lieber gar kein Knopf als ein Knopf, der Geld vernichtet.

Diese Prüfung erkennt allerdings **nur offensichtliche Fehler** – zu kurz,
falsches Netzwerk, mitkopierter Text. Einen Tippfehler mitten in einer sonst
gültigen Adresse erkennt sie nicht. Deshalb gilt:

1. Adresse immer aus der Wallet **kopieren**, nie abtippen.
2. Nach dem Deployment die Adresse auf der Seite mit der in deiner Wallet
   vergleichen – am besten die ersten und die letzten sechs Zeichen.
3. **Eine Testzahlung mit einem Kleinstbetrag an dich selbst machen**, bevor
   du die Seite bewirbst. Kommt sie an, stimmt die Adresse.

Ein zusätzlicher Hinweis: Krypto-Zuwendungen sind steuerlich nicht dasselbe
wie ein Euro-Betrag auf dem Konto. Kursgewinne zwischen Zufluss und Verkauf
können relevant sein. Auch das gehört zur Steuerberatung, nicht hierher.

### Adresse eingetragen, aber sie erscheint nicht

Dann hat die Formatprüfung sie verworfen. Im **Build-Protokoll bei Vercel**
(Deployments → das Deployment anklicken → Building) steht dann eine Zeile:

```
[support] Die Adresse in NEXT_PUBLIC_CRYPTO_BTC passt nicht zum Format von …
```

Häufigste Ursachen: beim Kopieren abgeschnitten, Adresse einer anderen Kette
in der falschen Variablen, oder versehentlich Text mitkopiert.

## Schritt 3: Prüfen

- `https://rechnerliste.de/unterstuetzen` aufrufen – die Seite muss da sein
- Auf jeden Knopf klicken und schauen, ob wirklich **dein** Konto erscheint
- Eine Testzahlung über 1 € an dich selbst ist die einzige Prüfung, die zählt

## Der Satz über die Verwendung

`NEXT_PUBLIC_SUPPORT_PURPOSE` erscheint wörtlich auf der Seite unter „Wofür das
Geld verwendet wird“. Zwei Regeln dazu:

1. **Er muss stimmen.** Wenn dort steht, das Geld sei für die Schule, dann muss
   es für die Schule verwendet werden. Wer beim Sammeln von Geld etwas anderes
   angibt, als er damit tut, täuscht seine Besucher – und je nach Umfang ist
   das nicht nur eine Frage des Anstands.
2. **Bleib konkret und unaufgeregt.** „Ich finanziere damit meine Ausbildung
   und den Betrieb der Website“ ist besser als eine Geschichte, die Mitleid
   erzeugen soll.

Lässt du die Variable leer, steht auf der Seite nur, dass Trinkgelder dem
Betrieb und der Weiterentwicklung zugutekommen. Das stimmt immer.

## Was du rechtlich und steuerlich klären solltest

Ich bin kein Anwalt und keine Steuerberatung. Diese Punkte solltest du prüfen,
bevor du die Funktion einschaltest:

- **Es ist keine Spende im steuerlichen Sinn.** Hinter der Website steht eine
  Privatperson, kein gemeinnütziger Verein. Zahlende können nichts absetzen,
  und du kannst keine Spendenbescheinigung ausstellen. Genau das steht so auch
  auf der Seite – bitte nimm diesen Hinweis nicht heraus.
- **Einnahmen sind Einnahmen.** Trinkgelder aus dem Betrieb einer Website
  können steuerlich relevant sein, zusammen mit den Werbeeinnahmen. Ab welcher
  Höhe das für dich in der Schweiz eine Rolle spielt – Einkommenssteuer,
  Selbständigkeit, allenfalls Mehrwertsteuerpflicht –, gehört zu einer
  Steuerberatung, nicht in eine Konfigurationsdatei.
- **Kein Crowdfunding-Versprechen.** Sobald du ein Ziel nennst („5.000 € für
  X“) oder eine Gegenleistung in Aussicht stellst, wird aus dem Trinkgeld
  schnell etwas anderes. Die eingebaute Fassung verspricht bewusst nichts.
- **AdSense** hat mit Spendenlinks kein Problem. Achte nur darauf, dass der
  Trinkgeld-Knopf nicht wie eine Anzeige aussieht oder neben einer Anzeige
  steht, damit niemand ihn verwechselt.

## Ausschalten

Variablen bei Vercel löschen (oder leeren) und neu deployen. Danach ist die
Funktion vollständig verschwunden, ohne dass am Code etwas geändert werden
muss.
