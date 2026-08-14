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
| **Ko-fi** | Grundversion ohne Provision, Zahlungsgebühren fallen trotzdem an | Zahlende brauchen kein Konto. Sehr verbreitet für genau diesen Zweck. |
| **Buy Me a Coffee** | Prozentuale Gebühr | Wie Ko-fi, andere Optik. |
| **Stripe Payment Link** | Gebühr je Zahlung | Wirkt am professionellsten, braucht aber ein Stripe-Konto mit Identitätsprüfung. |

Prüfe die aktuellen Gebühren und Bedingungen selbst auf der Seite des
Anbieters, bevor du dich entscheidest – ich gebe hier bewusst keine Zahlen an,
die morgen veraltet sein können.

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
