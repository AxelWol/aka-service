# AKA-Service für Landing-Pages — Fachliche Anforderungsdokumentation

## nach Arc42-Template · Version 1.0 · 15.04.2026

Axel Wolters, axelwol@microsoft.com

---

## Inhaltsverzeichnis

- [AKA-Service für Landing-Pages — Fachliche Anforderungsdokumentation](#aka-service-für-landing-pages--fachliche-anforderungsdokumentation)
  - [nach Arc42-Template · Version 1.0 · 15.04.2026](#nach-arc42-template--version-10--15042026)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
- [1. Einführung und Ziele](#1-einführung-und-ziele)
  - [1.1 Aufgabenstellung](#11-aufgabenstellung)
    - [Beispiel](#beispiel)
  - [1.2 Qualitätsziele](#12-qualitätsziele)
  - [1.3 Stakeholder](#13-stakeholder)
- [2. Randbedingungen](#2-randbedingungen)
  - [2.1 Technische Randbedingungen](#21-technische-randbedingungen)
  - [2.2 Organisatorische Randbedingungen](#22-organisatorische-randbedingungen)
- [3. Kontextabgrenzung](#3-kontextabgrenzung)
  - [3.1 Fachlicher Kontext](#31-fachlicher-kontext)
    - [Externe Schnittstellen](#externe-schnittstellen)
  - [3.2 Technischer Kontext](#32-technischer-kontext)
- [4. Lösungsstrategie](#4-lösungsstrategie)
  - [4.1 Zentrale Entwurfsentscheidungen](#41-zentrale-entwurfsentscheidungen)
  - [4.2 Auswertungsalgorithmus (Übersicht)](#42-auswertungsalgorithmus-übersicht)
- [5. Bausteinsicht](#5-bausteinsicht)
  - [5.1 Datenmodell](#51-datenmodell)
    - [RoutingConfiguration (Wurzelobjekt)](#routingconfiguration-wurzelobjekt)
    - [Metadata](#metadata)
    - [RoutingGroup (Weiterleitungsgruppe)](#routinggroup-weiterleitungsgruppe)
    - [Routing (Weiterleitungsregel)](#routing-weiterleitungsregel)
  - [5.2 Komponentenübersicht](#52-komponentenübersicht)
- [6. Fachliche Anforderungen — Weiterleitungsregeln](#6-fachliche-anforderungen--weiterleitungsregeln)
  - [6.1 Variante 1: Einfache Weiterleitung (ohne Parameter)](#61-variante-1-einfache-weiterleitung-ohne-parameter)
    - [Regeldefinition](#regeldefinition)
    - [Beispiel](#beispiel-1)
    - [Verhalten](#verhalten)
  - [6.2 Variante 2: Pfad + Gruppenabhängigkeit + Routing-Abhängigkeit (Zweistufig)](#62-variante-2-pfad--gruppenabhängigkeit--routing-abhängigkeit-zweistufig)
    - [Regeldefinition](#regeldefinition-1)
    - [Beispiele](#beispiele)
    - [Auswertungsschritte](#auswertungsschritte)
    - [Besonderheit: Mehrere Parameter-Werte zum gleichen Ziel](#besonderheit-mehrere-parameter-werte-zum-gleichen-ziel)
  - [6.3 Variante 3: Pfad + nur Routing-Abhängigkeit (ohne Gruppenabhängigkeit)](#63-variante-3-pfad--nur-routing-abhängigkeit-ohne-gruppenabhängigkeit)
    - [Regeldefinition](#regeldefinition-2)
    - [Beispiele](#beispiele-1)
    - [Unterschied zu Variante 2](#unterschied-zu-variante-2)
  - [6.4 Variante 4: Gemischtes Routing (mit und ohne Abhängigkeit in einer Gruppe)](#64-variante-4-gemischtes-routing-mit-und-ohne-abhängigkeit-in-einer-gruppe)
    - [Regeldefinition](#regeldefinition-3)
    - [Beispiele](#beispiele-2)
    - [Auswertungsreihenfolge](#auswertungsreihenfolge)
  - [6.5 Variante 5: Sterbefallbeurkundung (Reales Beispiel mit Fallback)](#65-variante-5-sterbefallbeurkundung-reales-beispiel-mit-fallback)
    - [Regeldefinition](#regeldefinition-4)
    - [Beispiele](#beispiele-3)
  - [6.6 Fallback-Mechanismus (Detail)](#66-fallback-mechanismus-detail)
    - [Regel für Fallback-Erkennung](#regel-für-fallback-erkennung)
    - [Fallback-Auswertung](#fallback-auswertung)
    - [Wichtig](#wichtig)
  - [6.7 Case-Insensitive Pfadvergleich](#67-case-insensitive-pfadvergleich)
    - [Beispiele](#beispiele-4)
  - [6.8 Sonderfälle und Fehlerverhalten](#68-sonderfälle-und-fehlerverhalten)
    - [Root-Pfad-Verhalten](#root-pfad-verhalten)
    - [Fehlerfälle](#fehlerfälle)
    - [URL-Parameter-Verarbeitung](#url-parameter-verarbeitung)
  - [6.9 Validierungsregeln für die Konfiguration](#69-validierungsregeln-für-die-konfiguration)
- [7. Laufzeitsicht](#7-laufzeitsicht)
  - [7.1 Weiterleitungs-Szenario (Normalfall)](#71-weiterleitungs-szenario-normalfall)
  - [7.2 Konfigurationsänderung durch Administrator:in](#72-konfigurationsänderung-durch-administratorin)
- [8. Admin-Oberfläche](#8-admin-oberfläche)
  - [8.1 Funktionsübersicht](#81-funktionsübersicht)
    - [8.1.1 Dashboard](#811-dashboard)
    - [8.1.2 Regelverwaltung](#812-regelverwaltung)
    - [8.1.3 Test-Werkzeug](#813-test-werkzeug)
    - [8.1.4 Systemeinstellungen](#814-systemeinstellungen)
  - [8.2 RBAC (Rollenbasierte Zugriffskontrolle)](#82-rbac-rollenbasierte-zugriffskontrolle)
    - [Rollen](#rollen)
    - [Berechtigungsmatrix](#berechtigungsmatrix)
    - [Authentifizierung](#authentifizierung)
- [9. Querschnittliche Konzepte](#9-querschnittliche-konzepte)
  - [9.1 Logging und Monitoring](#91-logging-und-monitoring)
    - [Beispiel-Log-Einträge](#beispiel-log-einträge)
  - [9.2 Caching-Strategie](#92-caching-strategie)
  - [9.3 Fehlerbehandlung](#93-fehlerbehandlung)
- [10. Nicht-Funktionale Anforderungen](#10-nicht-funktionale-anforderungen)
  - [10.1 Performance](#101-performance)
  - [10.2 Verfügbarkeit und Zuverlässigkeit](#102-verfügbarkeit-und-zuverlässigkeit)
  - [10.3 Sicherheit](#103-sicherheit)
  - [10.4 Skalierbarkeit](#104-skalierbarkeit)
  - [10.5 Betrieb und Wartung](#105-betrieb-und-wartung)
  - [10.6 Kompatibilität](#106-kompatibilität)
- [11. Risiken und technische Schulden](#11-risiken-und-technische-schulden)
- [12. Glossar](#12-glossar)
- [Anhang A: JSON Schema für Routing-Konfiguration](#anhang-a-json-schema-für-routing-konfiguration)
  - [Validierungshinweise](#validierungshinweise)

---

# 1. Einführung und Ziele

## 1.1 Aufgabenstellung

Der AKA-Service ist ein konfigurierbarer URL-Weiterleitungsdienst für den öffentlichen Sektor. Er ermöglicht es, komplexe Ziel-URLs hinter kurzen, merkbaren URLs zu verbergen und Bürger:innen basierend auf URL-Pfad und Query-Parametern an die zuständige Stelle weiterzuleiten.

**Kernproblem:** Bürger:innen erhalten über verschiedene Kanäle (Portale, QR-Codes, Druckmaterialien) Links zu Verwaltungsdienstleistungen. Die tatsächlichen Ziel-URLs sind lang, komplex und ändern sich regelmäßig. Ein zentraler Weiterleitungsdienst entkoppelt die veröffentlichten URLs von den Ziel-Systemen.

### Beispiel

Eine Person möchte eine Eheschließung im Bezirk Mitte anmelden und erhält folgenden Link:

```
https://aka.mein-service.net/Eheschliessung?leika=99059001104000&oeid=2289
```

Der AKA-Service analysiert Pfad und Parameter und leitet weiter an:

```
https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung
```

## 1.2 Qualitätsziele

| Priorität | Qualitätsziel | Beschreibung |
|-----------|--------------|--------------|
| 1 | Performance | Weiterleitungen müssen in < 100ms erfolgen (ohne Netzwerklatenz zum Zielsystem) |
| 2 | Verfügbarkeit | Der Dienst muss 99,9% Verfügbarkeit gewährleisten |
| 3 | Administrierbarkeit | Regeln müssen ohne Deployment über eine Admin-Oberfläche pflegbar sein |
| 4 | Korrektheit | Jeder Aufruf muss deterministisch zum korrekten Ziel weiterleiten |
| 5 | Sicherheit | Administrativer Zugang muss durch RBAC geschützt sein |

## 1.3 Stakeholder

| Rolle | Erwartung |
|-------|-----------|
| Bürger:innen (Endnutzer:innen) | Sofortige, unsichtbare Weiterleitung zum richtigen Dienst |
| Fachredakteur:innen | Einfache Pflege der Weiterleitungsregeln über eine Oberfläche |
| Administrator:innen | Systemüberwachung, Benutzerverwaltung, Konfiguration |
| Betrieb | Monitoring, Logging, Hochverfügbarkeit |
| Entwickler:innen | Klare API, testbare Regeln, nachvollziehbare Architektur |

---

# 2. Randbedingungen

## 2.1 Technische Randbedingungen

| Randbedingung | Erläuterung |
|---------------|-------------|
| Technologieunabhängigkeit | Die fachlichen Anforderungen sind unabhängig von der Implementierungstechnologie. Mögliche Zielplattformen umfassen Container (Docker/Kubernetes), Azure Static Web Apps, Azure App Services oder andere Hosting-Modelle |
| Persistenz | Die Konfigurationsdaten können in JSON-Dateien, SQL-Datenbanken (z.B. SQL Server) oder Key-Value-Stores (z.B. Redis) gespeichert werden |
| Caching | Für schnelle Weiterleitungen kann ein In-Memory-Cache (z.B. Redis) vorgelagert werden |
| HTTPS | Alle Kommunikation muss über HTTPS erfolgen |

## 2.2 Organisatorische Randbedingungen

| Randbedingung | Erläuterung |
|---------------|-------------|
| Fachdomäne | Verwaltungsdienstleistungen der Freien und Hansestadt Hamburg |
| Leika-Nummern | Dienste werden über Leistungskatalog-Nummern (Leika) identifiziert |
| OE-IDs | Organisationseinheiten werden über OE-IDs (oeid) identifiziert |
| Mandantenfähigkeit | Das System muss perspektivisch mehrere Mandanten unterstützen können |

---

# 3. Kontextabgrenzung

## 3.1 Fachlicher Kontext

```
┌─────────────┐     Kurz-URL + Parameter      ┌──────────────┐     HTTP 302 Redirect     ┌──────────────────┐
│ Bürger:in   │ ────────────────────────────► │  AKA-Service │ ────────────────────────► │  Ziel-System     │
│  (Browser)  │                               │              │                           │  (Fachportal)    │
└─────────────┘                               └──────────────┘                           └──────────────────┘
                                                     ▲
                                                     │ Pflege / Monitoring
                                                     │
                                            ┌────────┬───────┐
                                            │Administrator:in│
                                            │   (Admin-UI)   │
                                            └────────────────┘
```

### Externe Schnittstellen

| Schnittstelle | Beschreibung |
|---------------|-------------|
| Eingehende URL | `https://{host}/{Pfad}?{Parameter}` — Der Aufruf durch Bürger:innen |
| Ziel-URL | Vollqualifizierte URL des Ziel-Fachportals (z.B. ekom21, efa.hh.niedersachsen.de) |
| Admin-UI | Webbasierte Administrationsoberfläche zur Regelpflege |
| Monitoring | Status-Endpunkte und Logging zur Überwachung |

## 3.2 Technischer Kontext

```
┌───────────┐  HTTPS   ┌────────────────┐          ┌──────────────┐
│  Browser  │ ───────► │  Load Balancer │ ───────► │  AKA-Service │
└───────────┘          └────────────────┘          │  (Container) │
                                                   └──────┬───────┘
                                                          │
                                          ┌───────────────┼───────────────┐
                                          ▼               ▼               ▼
                                   ┌─────────────┐ ┌───────────┐ ┌──────────────┐
                                   │  Redis      │ │ SQL Server│ │ Identity     │
                                   │  (Cache)    │ │ (Regeln)  │ │ Provider     │
                                   └─────────────┘ └───────────┘ └──────────────┘
```

---

# 4. Lösungsstrategie

## 4.1 Zentrale Entwurfsentscheidungen

| Entscheidung | Begründung |
|-------------|-----------|
| Regelbasierte Weiterleitung | Flexible Konfiguration statt hartkodierter Routen |
| Zweistufige Auswertung | Erst Gruppenebene (Pfad + optionale Parameter), dann Routing-Ebene (weitere Parameter) |
| Fallback-Mechanismus | Innerhalb einer Gruppe kann ein Standard-Routing definiert werden |
| Case-insensitive Pfadvergleich | Benutzerfreundlichkeit bei manueller URL-Eingabe |
| Admin-UI mit RBAC | Fachredakteur:innen pflegen Regeln, Administrator:innen verwalten das System |

## 4.2 Auswertungsalgorithmus (Übersicht)

```
Eingehende URL
     │
     ▼
 Pfad extrahieren (z.B. "Eheschliessung")
     │
     ▼
 Query-Parameter parsen (z.B. {leika: "99059001104000", oeid: "2289"})
     │
     ▼
 Routing-Gruppen durchsuchen (case-insensitive Pfadvergleich)
     │
     ├── Keine Gruppe gefunden → Fehler
     │
     ▼
 Gruppenabhängigkeit prüfen (dependsOnKey/dependsOnValue auf Gruppenebene)
     │
     ├── Abhängigkeit nicht erfüllt → Nächste Gruppe prüfen
     │
     ▼
 Routings innerhalb der Gruppe durchsuchen
     │
     ├── Routing mit passender Abhängigkeit gefunden → Weiterleitung
     │
     ├── Kein passendes Routing, aber Fallback vorhanden → Fallback-Weiterleitung
     │
     └── Kein passendes Routing, kein Fallback → Fehler
```

---

# 5. Bausteinsicht

## 5.1 Datenmodell

### RoutingConfiguration (Wurzelobjekt)

Die gesamte Weiterleitungskonfiguration besteht aus einer versionierten Sammlung von Routing-Gruppen.

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `version` | string | Ja | Versionskennung der Konfiguration (Semver) |
| `metadata` | Metadata | Nein | Erstellungs- und Änderungsinformationen |
| `routingGroups` | RoutingGroup[] | Ja | Liste der Weiterleitungsgruppen (mind. 1) |

### Metadata

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `created` | string (ISO 8601) | Ja | Erstellungszeitpunkt |
| `lastModified` | string (ISO 8601) | Ja | Letzter Änderungszeitpunkt |
| `author` | string | Nein | Name der Person, die die letzte Änderung vorgenommen hat |

### RoutingGroup (Weiterleitungsgruppe)

Eine Gruppe fasst thematisch zusammengehörende Weiterleitungsregeln zusammen und wird über den URL-Pfad adressiert.

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `name` | string | Ja | Pfadsegment in der URL (z.B. `Eheschliessung`). Muss innerhalb der Konfiguration eindeutig sein (case-insensitive) |
| `description` | string | Ja | Fachliche Beschreibung der Gruppe |
| `dependsOnKey` | string | Nein | Name des URL-Parameters, der auf Gruppenebene geprüft wird |
| `dependsOnValue` | string | Nein | Erwarteter Wert des Parameters auf Gruppenebene |
| `routings` | Routing[] | Ja | Liste der Weiterleitungsregeln (mind. 1) |

### Routing (Weiterleitungsregel)

Eine einzelne Weiterleitungsregel innerhalb einer Gruppe.

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `name` | string | Ja | Bezeichner für Logging und Anzeige |
| `dependsOnKey` | string | Nein | Name des URL-Parameters für diese Regel |
| `dependsOnValue` | string | Nein | Erwarteter Wert des Parameters |
| `redirectTarget` | string | Ja | Vollständige Ziel-URL (muss eine gültige URL sein) |

## 5.2 Komponentenübersicht

```
┌────────────────────────────────────────────────────────────────┐
│                        AKA-Service                             │
│                                                                │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │  Redirect-       │   │  Admin-          │                   │
│  │  Endpunkt        │   │  Oberfläche      │                   │
│  │  (öffentlich)    │   │  (geschützt)     │                   │
│  └────────┬─────────┘   └────────┬─────────┘                   │
│           │                      │                             │
│           ▼                      ▼                             │
│  ┌──────────────────────────────────────────┐                  │
│  │         Routing-Engine                   │                  │
│  │  (Regelauswertung & Weiterleitung)       │                  │
│  └────────────────────┬─────────────────────┘                  │
│                       │                                        │
│           ┌───────────┼───────────┐                            │
│           ▼           ▼           ▼                            │
│  ┌─────────────┐ ┌─────────┐ ┌──────────┐                      │
│  │ Konfig-     │ │ Cache   │ │ Logging  │                      │
│  │ Service     │ │ Service │ │ Service  │                      │
│  └─────────────┘ └─────────┘ └──────────┘                      │
│                                                                │
│  ┌──────────────────────────────────────────┐                  │
│  │   RBAC / Authentifizierung               │                  │
│  └──────────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

---

# 6. Fachliche Anforderungen — Weiterleitungsregeln

Dieses Kapitel beschreibt alle Varianten der Weiterleitungslogik detailliert und mit konkreten Beispielen aus dem aktuellen Projekt.

## 6.1 Variante 1: Einfache Weiterleitung (ohne Parameter)

Die einfachste Regel: Ein URL-Pfad wird direkt auf eine Ziel-URL abgebildet. Es werden keine Query-Parameter ausgewertet.

### Regeldefinition

```json
{
  "name": "SimpleRedirect",
  "description": "Einfache Weiterleitung ohne Parameterprüfung",
  "routings": [
    {
      "name": "DirectRedirect",
      "redirectTarget": "https://example.com/simple"
    }
  ]
}
```

### Beispiel

| Eingehende URL | Ziel-URL |
|---------------|----------|
| `https://aka.mein-service.net/SimpleRedirect` | `https://example.com/simple` |
| `https://aka.mein-service.net/SimpleRedirect?beliebig=wert` | `https://example.com/simple` |
| `https://aka.mein-service.net/simpleredirect` | `https://example.com/simple` *(case-insensitive)* |

### Verhalten

- Die Gruppe hat keine `dependsOnKey`/`dependsOnValue` → keine Gruppenprüfung
- Es gibt nur ein Routing ohne Abhängigkeiten → wird immer verwendet
- Eventuell vorhandene Query-Parameter werden ignoriert

---

## 6.2 Variante 2: Pfad + Gruppenabhängigkeit + Routing-Abhängigkeit (Zweistufig)

Die mächtigste Variante: Sowohl auf Gruppenebene als auch auf Routing-Ebene werden Parameter geprüft. Dies ermöglicht eine fein granulare Zuordnung.

### Regeldefinition

```json
{
  "name": "Eheschliessung",
  "description": "Anmeldung zur Eheschließung",
  "dependsOnKey": "leika",
  "dependsOnValue": "99059001104000",
  "routings": [
    {
      "name": "1",
      "dependsOnKey": "oeid",
      "dependsOnValue": "2289",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "2",
      "dependsOnKey": "oeid",
      "dependsOnValue": "8455",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000002&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "Bergedorf-1",
      "dependsOnKey": "oeid",
      "dependsOnValue": "7997",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000006&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "Bergedorf-2",
      "dependsOnKey": "oeid",
      "dependsOnValue": "7996",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000006&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "Fallback",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung"
    }
  ]
}
```

### Beispiele

| Eingehende URL | Prüfung | Ziel-URL |
|---------------|---------|----------|
| `/Eheschliessung?leika=99059001104000&oeid=2289` | Gruppe ✓ (leika stimmt), Routing "1" ✓ (oeid=2289) | `…?oe=00.00.EHE.02000001…` |
| `/Eheschliessung?leika=99059001104000&oeid=8455` | Gruppe ✓, Routing "2" ✓ (oeid=8455) | `…?oe=00.00.EHE.02000002…` |
| `/Eheschliessung?leika=99059001104000&oeid=7997` | Gruppe ✓, Routing "Bergedorf-1" ✓ (oeid=7997) | `…?oe=00.00.EHE.02000006…` |
| `/Eheschliessung?leika=99059001104000&oeid=7996` | Gruppe ✓, Routing "Bergedorf-2" ✓ (oeid=7996) | `…?oe=00.00.EHE.02000006…` |
| `/Eheschliessung?leika=99059001104000&oeid=9999` | Gruppe ✓, kein Routing passt → **Fallback** | `…?oe=00.00.EHE.02000001…` |
| `/Eheschliessung?leika=FALSCH&oeid=2289` | Gruppe ✗ (leika stimmt nicht) → **Fehler** | — |
| `/Eheschliessung` | Gruppe ✗ (leika fehlt) → **Fehler** | — |

### Auswertungsschritte

1. **Pfad:** `Eheschliessung` → Gruppe "Eheschliessung" gefunden (case-insensitive)
2. **Gruppenprüfung:** Parameter `leika` vorhanden und Wert = `99059001104000`? → Ja
3. **Routing-Suche:** Parameter `oeid` vorhanden? Wert = `2289`? → Routing "1" gefunden
4. **Weiterleitung:** HTTP 302 an `redirectTarget`

### Besonderheit: Mehrere Parameter-Werte zum gleichen Ziel

Im obigen Beispiel leiten `oeid=7997` (Bergedorf-1) und `oeid=7996` (Bergedorf-2) zum identischen Ziel weiter. Dies ermöglicht es, mehrere Organisationseinheiten demselben Fachportal zuzuordnen.

---

## 6.3 Variante 3: Pfad + nur Routing-Abhängigkeit (ohne Gruppenabhängigkeit)

Die Gruppe hat keine eigene Parameterprüfung. Die Auswertung erfolgt nur auf der Routing-Ebene anhand eines einzelnen Parameters.

### Regeldefinition

```json
{
  "name": "EheschliessungOhneLeika",
  "description": "Anmeldung zur Eheschließung ohne Leika-Prüfung",
  "routings": [
    {
      "name": "1",
      "dependsOnKey": "oeid",
      "dependsOnValue": "2289",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "2",
      "dependsOnKey": "oeid",
      "dependsOnValue": "8455",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000002&mode=cc&cc_key=AnmeldungEheschliessung"
    },
    {
      "name": "Fallback",
      "redirectTarget": "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung"
    }
  ]
}
```

### Beispiele

| Eingehende URL | Prüfung | Ziel-URL |
|---------------|---------|----------|
| `/EheschliessungOhneLeika?oeid=2289` | Gruppe ✓ (keine Abhängigkeit), Routing "1" ✓ | `…?oe=00.00.EHE.02000001…` |
| `/EheschliessungOhneLeika?oeid=8455` | Gruppe ✓, Routing "2" ✓ | `…?oe=00.00.EHE.02000002…` |
| `/EheschliessungOhneLeika?oeid=9999` | Gruppe ✓, kein Routing passt → **Fallback** | `…?oe=00.00.EHE.02000001…` |
| `/EheschliessungOhneLeika` | Gruppe ✓, kein oeid → **Fallback** | `…?oe=00.00.EHE.02000001…` |
| `/EheschliessungOhneLeika?leika=xyz&oeid=2289` | Gruppe ✓, Routing "1" ✓ (leika wird ignoriert) | `…?oe=00.00.EHE.02000001…` |

### Unterschied zu Variante 2

Der Leika-Parameter wird nicht auf Gruppenebene geprüft. Die Gruppe wird allein über den URL-Pfad aktiviert. Nicht benötigte Query-Parameter werden ignoriert.

---

## 6.4 Variante 4: Gemischtes Routing (mit und ohne Abhängigkeit in einer Gruppe)

Innerhalb einer Gruppe können Routings mit spezifischen Parameterabhängigkeiten neben parameterlosen Routings existieren.

### Regeldefinition

```json
{
  "name": "AllServices",
  "description": "Generisches Routing für verschiedene Dienste",
  "routings": [
    {
      "name": "LeikaSpecific",
      "dependsOnKey": "leika",
      "dependsOnValue": "99059001104000",
      "redirectTarget": "https://example.com/services/leika/99059001104000--AAA"
    },
    {
      "name": "DefaultService",
      "redirectTarget": "https://example.com/services/default"
    }
  ]
}
```

### Beispiele

| Eingehende URL | Prüfung | Ziel-URL |
|---------------|---------|----------|
| `/AllServices?leika=99059001104000` | Routing "LeikaSpecific" ✓ | `…/leika/99059001104000--AAA` |
| `/AllServices?leika=ANDERER_WERT` | Routing "LeikaSpecific" ✗, "DefaultService" hat keine Abhängigkeit → **Fallback** | `…/services/default` |
| `/AllServices` | Kein Parameter → "DefaultService" als Fallback | `…/services/default` |

### Auswertungsreihenfolge

Routings werden in der **definierten Reihenfolge** durchlaufen. Das erste Routing, dessen Abhängigkeiten erfüllt sind, gewinnt. Ein Routing ohne Abhängigkeiten wird nur als **Fallback** verwendet, wenn es das einzige Routing in der Gruppe ist oder kein spezifisches Routing passt.

---

## 6.5 Variante 5: Sterbefallbeurkundung (Reales Beispiel mit Fallback)

Ein vollständiges Beispiel aus der Produktion mit sieben Bezirken und einem Fallback.

### Regeldefinition

```json
{
  "name": "Sterbefallbeurkundungen",
  "description": "Routing for Leika 99101011261000 - Sterbefallbeurkundungen",
  "dependsOnKey": "leika",
  "dependsOnValue": "99101011261000",
  "routings": [
    { "name": "Hamburg-Mitte",  "dependsOnKey": "oeid", "dependsOnValue": "2290",  "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/76?c=bc" },
    { "name": "Harburg",       "dependsOnKey": "oeid", "dependsOnValue": "2373",  "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/57?c=bc" },
    { "name": "Bergedorf",     "dependsOnKey": "oeid", "dependsOnValue": "7996",  "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/77?c=bc" },
    { "name": "Hamburg-Nord",   "dependsOnKey": "oeid", "dependsOnValue": "13066", "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/78?c=bc" },
    { "name": "Eimsbüttel",    "dependsOnKey": "oeid", "dependsOnValue": "22609", "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/79?c=bc" },
    { "name": "Altona",        "dependsOnKey": "oeid", "dependsOnValue": "8456",  "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/81?c=bc" },
    { "name": "Wandsbek",      "dependsOnKey": "oeid", "dependsOnValue": "2501",  "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/80?c=bc" },
    { "name": "Fallback",      "redirectTarget": "https://efa.hh.niedersachsen.de/govos/go/a/77?c=bc" }
  ]
}
```

### Beispiele

| Eingehende URL | Ergebnis |
|---------------|----------|
| `/Sterbefallbeurkundungen?leika=99101011261000&oeid=2290` | → `…/a/76?c=bc` (Hamburg-Mitte) |
| `/Sterbefallbeurkundungen?leika=99101011261000&oeid=2373` | → `…/a/57?c=bc` (Harburg) |
| `/Sterbefallbeurkundungen?leika=99101011261000&oeid=22609` | → `…/a/79?c=bc` (Eimsbüttel) |
| `/Sterbefallbeurkundungen?leika=99101011261000&oeid=UNBEKANNT` | → `…/a/77?c=bc` (Fallback = Bergedorf) |
| `/Sterbefallbeurkundungen?leika=FALSCH&oeid=2290` | → **Fehler** (Leika stimmt nicht) |

---

## 6.6 Fallback-Mechanismus (Detail)

Der Fallback-Mechanismus greift auf **Routing-Ebene**, wenn kein spezifisches Routing passt.

### Regel für Fallback-Erkennung

Ein Routing gilt als **Fallback**, wenn:

1. Es **kein** `dependsOnKey` und kein `dependsOnValue` hat
2. Es das **einzige Routing ohne Abhängigkeiten** in der Gruppe ist

### Fallback-Auswertung

```
Routings in definierter Reihenfolge durchlaufen:
  │
  ├── Routing hat dependsOnKey/Value?
  │     ├── Ja → Parameter prüfen → Passt? → Weiterleitung
  │     │                         → Passt nicht? → Nächstes Routing
  │     └── Nein → Als Fallback-Kandidat merken, weiter suchen
  │
  └── Alle Routings geprüft, kein Treffer?
        ├── Fallback vorhanden? → Fallback-Weiterleitung
        └── Kein Fallback? → Fehler
```

### Wichtig

- Der Fallback wird nur verwendet, wenn **kein** spezifisches Routing passt
- Es sollte **maximal ein** Fallback pro Gruppe definiert werden
- Der Fallback wird typischerweise als **letztes** Routing in der Liste definiert
- Ein Fallback greift nur, wenn die **Gruppe selbst** bereits qualifiziert ist (Gruppenabhängigkeit erfüllt oder nicht vorhanden)

---

## 6.7 Case-Insensitive Pfadvergleich

Gruppennamen werden **case-insensitive** mit dem URL-Pfad verglichen. Dies erhöht die Benutzerfreundlichkeit bei manuell eingegebenen URLs.

### Beispiele

Alle folgenden URLs führen zur selben Gruppe `Eheschliessung`:

| URL-Pfad | Gefundene Gruppe |
|----------|-----------------|
| `/Eheschliessung?…` | Eheschliessung ✓ |
| `/eheschliessung?…` | Eheschliessung ✓ |
| `/EHESCHLIESSUNG?…` | Eheschliessung ✓ |
| `/EheSchliessung?…` | Eheschliessung ✓ |

---

## 6.8 Sonderfälle und Fehlerverhalten

### Root-Pfad-Verhalten

| Szenario | Verhalten |
|----------|-----------|
| `https://aka.mein-service.net/` | Weiterleitung zur Admin-/Status-Oberfläche |
| `https://aka.mein-service.net/?leika=123` | Versuch einer Weiterleitung (Pfad = leer) |

### Fehlerfälle

| Szenario | Verhalten |
|----------|-----------|
| Unbekannter Pfad (z.B. `/NichtVorhanden`) | Fehler: "No matching routing group found" |
| Gruppe gefunden, kein Routing passt, kein Fallback | Fehler: "No matching routing found" |
| Konfiguration nicht geladen | Fehler: "No routing configuration loaded" |
| Ungültige Ziel-URL in Konfiguration | Validierungsfehler beim Laden |

### URL-Parameter-Verarbeitung

| Szenario | Verhalten |
|----------|-----------|
| URL-kodierte Parameter (`name=John%20Doe`) | Werden automatisch dekodiert |
| Parameter ohne Wert (`?flag1&flag2=value`) | `flag1` wird als leerer String behandelt |
| Gleichheitszeichen im Wert (`?eq=a=b+c`) | Nur das erste `=` trennt Key und Value |
| Mehrfache Parameter mit gleichem Key | Letzter Wert gewinnt (Standardverhalten) |

---

## 6.9 Validierungsregeln für die Konfiguration

Die Konfiguration wird beim Laden vollständig validiert. Ungültige Konfigurationen werden abgelehnt.

| Regel | Fehlermeldung |
|-------|--------------|
| Konfiguration muss vorhanden sein | "Configuration is null or undefined" |
| `version` ist Pflichtfeld | "Configuration version is required" |
| `routingGroups` muss ein Array sein | "routingGroups must be an array" |
| Mindestens eine Gruppe erforderlich | "At least one routing group is required" |
| Gruppennamen müssen eindeutig sein (case-insensitive) | "Duplicate routing group names found" |
| Jede Gruppe braucht einen Namen | "Routing group name is required and must be a string" |
| Jede Gruppe braucht mind. ein Routing | "Routing group '…' must have at least one routing" |
| Jedes Routing braucht einen Namen | "Routing name is required in group '…'" |
| Jedes Routing braucht ein gültiges `redirectTarget` | "Invalid redirect target URL '…'" |

---

# 7. Laufzeitsicht

## 7.1 Weiterleitungs-Szenario (Normalfall)

```
Bürger:in             AKA-Service              Cache              Datenbank
  │                      │                      │                    │
  │  GET /Eheschlies-    │                      │                    │
  │  sung?leika=...&     │                      │                    │
  │  oeid=2289           │                      │                    │
  │─────────────────────►│                      │                    │
  │                      │  Regeln aus Cache?   │                    │
  │                      │─────────────────────►│                    │
  │                      │  Cache Hit           │                    │
  │                      │◄─────────────────────│                    │
  │                      │                      │                    │
  │                      │  Pfad extrahieren    │                    │
  │                      │  Parameter parsen    │                    │
  │                      │  Gruppe matchen      │                    │
  │                      │  Routing auswerten   │                    │
  │                      │                      │                    │
  │  HTTP 302            │                      │                    │
  │  Location: https://  │                      │                    │
  │  portal-civ-efa...   │                      │                    │
  │◄─────────────────────│                      │                    │
  │                      │                      │                    │
```

## 7.2 Konfigurationsänderung durch Administrator:in

```
Admin                 Admin-UI              AKA-Service           Datenbank         Cache
  │                      │                      │                    │                │
  │  Regel bearbeiten    │                      │                    │                │
  │─────────────────────►│                      │                    │                │
  │                      │  PUT /api/routings   │                    │                │
  │                      │─────────────────────►│                    │                │
  │                      │                      │  Validierung       │                │
  │                      │                      │  Speichern         │                │
  │                      │                      │───────────────────►│                │
  │                      │                      │  OK                │                │
  │                      │                      │◄───────────────────│                │
  │                      │                      │  Cache invalidieren│                │
  │                      │                      │────────────────────────────────────►│
  │                      │                      │                    │                │
  │                      │  200 OK              │                    │                │
  │                      │◄─────────────────────│                    │                │
  │  Erfolg anzeigen     │                      │                    │                │
  │◄─────────────────────│                      │                    │                │
```

---

# 8. Admin-Oberfläche

## 8.1 Funktionsübersicht

Die Admin-Oberfläche bietet vier Hauptbereiche:

### 8.1.1 Dashboard

- **Systemstatus:** Service-Gesundheit, Verfügbarkeit, aktive Konfigurationsversion
- **Statistiken:** Anzahl Routing-Gruppen, Anzahl Routings, Anzahl Weiterleitungen (heute/gesamt)
- **Letzte Aktivitäten:** Kürzlich durchgeführte Weiterleitungen mit Quell- und Ziel-URL
- **Konfigurationsinfo:** Version, letzte Änderung, Autor:in

### 8.1.2 Regelverwaltung

| Funktion | Beschreibung |
|----------|-------------|
| Gruppen anzeigen | Übersicht aller Routing-Gruppen mit Beschreibung und Anzahl Routings |
| Gruppe erstellen | Neue Routing-Gruppe mit Name, Beschreibung, optionaler Abhängigkeit anlegen |
| Gruppe bearbeiten | Bestehende Gruppe und ihre Routings ändern |
| Gruppe löschen | Gruppe mit allen Routings entfernen (mit Bestätigung) |
| Routing hinzufügen | Neues Routing innerhalb einer Gruppe anlegen |
| Routing bearbeiten | Name, Abhängigkeiten und Ziel-URL eines Routings ändern |
| Routing löschen | Einzelnes Routing entfernen |
| Reihenfolge ändern | Routings innerhalb einer Gruppe umsortieren (Drag & Drop) |
| Import/Export | Konfiguration als JSON importieren/exportieren |
| Validierung | Echtzeit-Validierung bei jeder Änderung |
| Versionshistorie | Änderungsprotokoll mit Rollback-Möglichkeit |

### 8.1.3 Test-Werkzeug

| Funktion | Beschreibung |
|----------|-------------|
| URL testen | URL eingeben und Ergebnis der Regelauswertung anzeigen (ohne echte Weiterleitung) |
| Ergebnis anzeigen | Anzeige von: gefundene Gruppe, gefundenes Routing, Ziel-URL, Auswertungspfad |
| Fehleranalyse | Bei Nicht-Treffer: Anzeige, warum keine Regel passte (welche Prüfung fehlschlug) |
| Beispiel-URLs | Vorgefertigte Test-URLs basierend auf der aktuellen Konfiguration |
| Massentest | CSV-Upload mit URLs und erwarteten Zielen zur Validierung der Konfiguration |

### 8.1.4 Systemeinstellungen

| Funktion | Beschreibung |
|----------|-------------|
| Cache-Verwaltung | Cache leeren, Cache-Statistiken anzeigen, TTL konfigurieren |
| Logging-Konfiguration | Log-Level anpassen, Log-Retention konfigurieren |
| Benutzerverwaltung | Benutzer:innen und Rollen verwalten (siehe RBAC) |
| Systeminfo | Version, Laufzeit, Ressourcenverbrauch |

## 8.2 RBAC (Rollenbasierte Zugriffskontrolle)

### Rollen

| Rolle | Beschreibung |
|-------|-------------|
| `viewer` | Kann Dashboard und Konfiguration einsehen, URLs testen, aber nichts ändern |
| `editor` | Kann Routing-Gruppen und Routings erstellen, bearbeiten und löschen |
| `admin` | Alle Editor-Rechte plus Benutzerverwaltung und Systemeinstellungen |

### Berechtigungsmatrix

| Funktion | Viewer | Editor | Admin |
|----------|--------|--------|-------|
| Dashboard anzeigen | ✓ | ✓ | ✓ |
| Konfiguration einsehen | ✓ | ✓ | ✓ |
| URLs testen | ✓ | ✓ | ✓ |
| Routing-Gruppen erstellen/bearbeiten | – | ✓ | ✓ |
| Routings erstellen/bearbeiten | – | ✓ | ✓ |
| Konfiguration importieren/exportieren | – | ✓ | ✓ |
| Cache verwalten | – | – | ✓ |
| Benutzer:innen verwalten | – | – | ✓ |
| Systemeinstellungen ändern | – | – | ✓ |
| Audit-Log einsehen | – | – | ✓ |

### Authentifizierung

- Integration mit einem Identity Provider (z.B. Microsoft Entra ID / Azure AD)
- OAuth 2.0 / OpenID Connect für sichere Anmeldung
- Session-Management mit konfigurierbarem Timeout
- Multi-Faktor-Authentifizierung (MFA) für Admin-Rolle empfohlen

---

# 9. Querschnittliche Konzepte

## 9.1 Logging und Monitoring

| Konzept | Beschreibung |
|---------|-------------|
| Strukturiertes Logging | Alle Aktionen werden mit Timestamp, Level, Nachricht und Kontext-Daten geloggt |
| Log-Prefix | Einheitlicher Prefix `[AKA-Service]` für alle Log-Einträge |
| Log-Level | `info` (normal), `warn` (Hinweis), `error` (Fehler) |
| Redirect-Logging | Jede Weiterleitung wird protokolliert: Quell-URL, Ziel-URL, gematchte Gruppe/Routing |
| Fehler-Logging | Fehlgeschlagene Weiterleitungen mit vollständigem Kontext |
| Audit-Log | Alle Konfigurationsänderungen mit Benutzer:in, Zeitstempel und Änderungsbeschreibung |

### Beispiel-Log-Einträge

```
[2025-07-17T10:30:00.000Z] INFO:  Processing redirect request {"path":"Eheschliessung","urlParams":{"leika":"99059001104000","oeid":"2289"}}
[2025-07-17T10:30:00.001Z] INFO:  Matching routing group found {"groupName":"Eheschliessung"}
[2025-07-17T10:30:00.001Z] INFO:  Matching routing found {"routingName":"1"}
[2025-07-17T10:30:00.002Z] INFO:  Redirect target found {"targetUrl":"https://portal-civ-efa.ekom21.de/…","groupName":"Eheschliessung","routingName":"1"}
```

## 9.2 Caching-Strategie

| Aspekt | Beschreibung |
|--------|-------------|
| Konfiguration cachen | Die aktuelle Konfiguration wird im Arbeitsspeicher / Redis gehalten |
| Cache-Invalidierung | Bei Konfigurationsänderungen wird der Cache sofort invalidiert |
| TTL | Konfigurierbare Time-to-Live für Cache-Einträge |
| Warm-up | Beim Start wird die Konfiguration geladen und gecacht |

## 9.3 Fehlerbehandlung

| Fehlertyp | Verhalten |
|-----------|-----------|
| Konfiguration nicht ladbar | Service startet im Fehlerzustand, Health-Check schlägt fehl |
| Konfiguration ungültig | Validierungsfehler, alte Konfiguration bleibt aktiv |
| Keine passende Regel | Benutzerfreundliche Fehlerseite mit Link zur Status-Seite |
| Ziel-System nicht erreichbar | HTTP 302 wird trotzdem gesendet (Ziel-Verfügbarkeit wird nicht geprüft) |

---

# 10. Nicht-Funktionale Anforderungen

## 10.1 Performance

| ID | Anforderung | Zielwert |
|----|------------|----------|
| NFR-P1 | Weiterleitungszeit (Regelauswertung) | < 10ms (95. Perzentil) |
| NFR-P2 | Gesamtantwortzeit (inkl. HTTP) | < 100ms (95. Perzentil) |
| NFR-P3 | Durchsatz | ≥ 1.000 Weiterleitungen/Sekunde |
| NFR-P4 | Konfiguration laden | < 500ms bei Kaltstart |
| NFR-P5 | Admin-UI Seitenaufbau | < 2s |

## 10.2 Verfügbarkeit und Zuverlässigkeit

| ID | Anforderung | Zielwert |
|----|------------|----------|
| NFR-V1 | Verfügbarkeit | ≥ 99,9% (≈ 8,7h Ausfall/Jahr) |
| NFR-V2 | Geplante Wartungsfenster | < 5 Minuten Downtime pro Deployment |
| NFR-V3 | Fehlertoleranz | Bei Konfigurationsfehlern bleibt die letzte gültige Konfiguration aktiv |
| NFR-V4 | Recovery-Zeit | < 30s nach Neustart |

## 10.3 Sicherheit

| ID | Anforderung | Beschreibung |
|----|------------|-------------|
| NFR-S1 | HTTPS | Alle Kommunikation ausschließlich über TLS 1.2+ |
| NFR-S2 | Admin-Zugang | Authentifizierung via Identity Provider (OAuth 2.0 / OIDC) |
| NFR-S3 | RBAC | Rollenbasierte Zugriffskontrolle mit mindestens 3 Rollen |
| NFR-S4 | Eingabevalidierung | Alle URL-Parameter und Konfigurationsdaten werden validiert |
| NFR-S5 | Security Headers | CORS, CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| NFR-S6 | Audit-Trail | Alle Konfigurationsänderungen werden protokolliert |
| NFR-S7 | Open Redirect Prevention | Ziel-URLs müssen gegen eine Allowlist geprüft werden |

## 10.4 Skalierbarkeit

| ID | Anforderung | Beschreibung |
|----|------------|-------------|
| NFR-SK1 | Horizontale Skalierung | Mehrere Instanzen hinter einem Load Balancer |
| NFR-SK2 | Konfigurationsgröße | ≥ 1.000 Routing-Gruppen mit jeweils ≥ 100 Routings |
| NFR-SK3 | Mandantenfähigkeit | Perspektivisch: getrennte Konfigurationen pro Mandant |

## 10.5 Betrieb und Wartung

| ID | Anforderung | Beschreibung |
|----|------------|-------------|
| NFR-B1 | Health Check | HTTP-Endpunkt für Liveness- und Readiness-Probes |
| NFR-B2 | Metriken | Prometheus-kompatible Metriken (Requests, Latenz, Fehlerrate) |
| NFR-B3 | Zero-Downtime Deployment | Neue Versionen werden ohne Unterbrechung ausgerollt |
| NFR-B4 | Konfiguration hot-reload | Regeländerungen werden ohne Neustart wirksam |
| NFR-B5 | Backup & Restore | Automatische Sicherung der Konfiguration, Wiederherstellung möglich |

## 10.6 Kompatibilität

| ID | Anforderung | Beschreibung |
|----|------------|-------------|
| NFR-K1 | Browser | Weiterleitung muss in allen modernen Browsern funktionieren |
| NFR-K2 | HTTP-Clients | Weiterleitung muss auch für nicht-Browser-Clients (curl, API-Aufrufe) funktionieren |
| NFR-K3 | Admin-UI | Moderne Browser (Chrome, Firefox, Edge, Safari — letzte 2 Versionen) |

---

# 11. Risiken und technische Schulden

| Risiko | Auswirkung | Maßnahme |
|--------|-----------|----------|
| Open Redirect | Angreifer:innen könnten den Dienst nutzen, um auf Phishing-Seiten weiterzuleiten | Ziel-URL-Validierung gegen Allowlist / Domain-Whitelist |
| Konfigurationsverlust | Alle Weiterleitungen fallen aus | Automatische Backups, Versionierung, Rollback |
| Cache-Inkonsistenz bei mehreren Instanzen | Unterschiedliche Instanzen liefern unterschiedliche Ergebnisse | Zentraler Cache (Redis), Cache-Invalidierung über Pub/Sub |
| Zu viele Regeln → Performance-Degradation | Antwortzeiten steigen | Indizierung der Gruppennamen, ggf. Lookup-Map statt linearer Suche |
| Fehlende Gruppennamen-Konflikte | Gleicher Pfad kann nicht für verschiedene Leika-Nummern genutzt werden, wenn Gruppennamen eindeutig sein müssen | Architekturentscheidung: mehrere Gruppen mit gleicher `name` erlauben, wenn `dependsOnKey`/`dependsOnValue` unterschiedlich sind |

---

# 12. Glossar

| Begriff | Beschreibung |
|---------|-------------|
| **AKA** | "Auch bekannt als" — Kurzbezeichnung für den URL-Weiterleitungsdienst |
| **Routing-Gruppe** | Logische Zusammenfassung von Weiterleitungsregeln, adressiert über einen URL-Pfad |
| **Routing** | Einzelne Weiterleitungsregel innerhalb einer Gruppe mit optionaler Parameterabhängigkeit |
| **Leika** | Leistungskatalog-Nummer — bundesweite Kennung für Verwaltungsleistungen |
| **OEID** | Organisations-Einheits-ID — Kennung für eine Organisationseinheit (z.B. Bezirksamt) |
| **dependsOnKey** | Name des URL-Query-Parameters, der für eine Bedingung geprüft wird |
| **dependsOnValue** | Erwarteter Wert des Parameters, der für die Aktivierung einer Regel erfüllt sein muss |
| **Fallback** | Ein Routing ohne Parameterabhängigkeit, das als Standard greift, wenn kein spezifisches Routing passt |
| **Redirect Target** | Die vollqualifizierte Ziel-URL, an die Benutzer:innen weitergeleitet werden |
| **RBAC** | Role-Based Access Control — Rollenbasierte Zugriffskontrolle |
| **KERN UX** | Design-System der Freien und Hansestadt Hamburg für Web-Anwendungen |

---

# Anhang A: JSON Schema für Routing-Konfiguration

Das folgende JSON Schema definiert die vollständige Struktur der Routing-Konfiguration und kann zur Validierung eingesetzt werden.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://aka.mein-service.net/schemas/routing-configuration.json",
  "title": "AKA-Service Routing-Konfiguration",
  "description": "Schema für die Weiterleitungsregeln des AKA-URL-Shortener-Service",
  "type": "object",
  "required": ["version", "routingGroups"],
  "additionalProperties": false,
  "properties": {
    "version": {
      "type": "string",
      "description": "Versionskennung der Konfiguration (Semver)",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "examples": ["1.2.4"]
    },
    "metadata": {
      "$ref": "#/$defs/Metadata"
    },
    "routingGroups": {
      "type": "array",
      "description": "Liste der Weiterleitungsgruppen",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/RoutingGroup"
      }
    }
  },
  "$defs": {
    "Metadata": {
      "type": "object",
      "description": "Metadaten zur Konfiguration",
      "required": ["created", "lastModified"],
      "additionalProperties": false,
      "properties": {
        "created": {
          "type": "string",
          "format": "date-time",
          "description": "Erstellungszeitpunkt (ISO 8601)",
          "examples": ["2025-07-12T10:00:00.000Z"]
        },
        "lastModified": {
          "type": "string",
          "format": "date-time",
          "description": "Zeitpunkt der letzten Änderung (ISO 8601)",
          "examples": ["2025-12-17T11:38:00.000Z"]
        },
        "author": {
          "type": "string",
          "description": "Name der Person, die die letzte Änderung vorgenommen hat",
          "examples": ["AKA Service Team"]
        }
      }
    },
    "RoutingGroup": {
      "type": "object",
      "description": "Eine Routing-Gruppe fasst thematisch zusammengehörende Weiterleitungsregeln zusammen und wird über den URL-Pfad adressiert",
      "required": ["name", "description", "routings"],
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1,
          "description": "Pfadsegment in der URL. Muss innerhalb der Konfiguration eindeutig sein (case-insensitive). Darf keine Schrägstriche oder Sonderzeichen enthalten",
          "pattern": "^[A-Za-z0-9_-]+$",
          "examples": ["Eheschliessung", "SimpleRedirect", "SterbefallEinrichtung"]
        },
        "description": {
          "type": "string",
          "description": "Fachliche Beschreibung der Gruppe",
          "examples": ["Anmeldung zur Eheschließung"]
        },
        "dependsOnKey": {
          "type": "string",
          "minLength": 1,
          "description": "Name des URL-Query-Parameters, der auf Gruppenebene geprüft wird. Muss zusammen mit dependsOnValue angegeben werden",
          "examples": ["leika"]
        },
        "dependsOnValue": {
          "type": "string",
          "minLength": 1,
          "description": "Erwarteter Wert des Parameters auf Gruppenebene. Muss zusammen mit dependsOnKey angegeben werden",
          "examples": ["99059001104000"]
        },
        "routings": {
          "type": "array",
          "description": "Liste der Weiterleitungsregeln innerhalb dieser Gruppe",
          "minItems": 1,
          "items": {
            "$ref": "#/$defs/Routing"
          }
        }
      },
      "dependentRequired": {
        "dependsOnKey": ["dependsOnValue"],
        "dependsOnValue": ["dependsOnKey"]
      }
    },
    "Routing": {
      "type": "object",
      "description": "Eine einzelne Weiterleitungsregel. Ohne dependsOnKey/dependsOnValue fungiert sie als Fallback innerhalb der Gruppe",
      "required": ["name", "redirectTarget"],
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1,
          "description": "Bezeichner der Regel für Logging, Anzeige und Audit",
          "examples": ["Hamburg-Mitte", "Fallback", "Bergedorf-1"]
        },
        "dependsOnKey": {
          "type": "string",
          "minLength": 1,
          "description": "Name des URL-Query-Parameters, der für diese Regel geprüft wird. Muss zusammen mit dependsOnValue angegeben werden",
          "examples": ["oeid"]
        },
        "dependsOnValue": {
          "type": "string",
          "minLength": 1,
          "description": "Erwarteter Wert des Parameters. Muss zusammen mit dependsOnKey angegeben werden",
          "examples": ["2289", "8455", "7996"]
        },
        "redirectTarget": {
          "type": "string",
          "format": "uri",
          "description": "Vollständige Ziel-URL für die Weiterleitung. Muss eine gültige absolute URL sein",
          "examples": [
            "https://portal-civ-efa.ekom21.de/civ-efa-sta.public/start.html?oe=00.00.EHE.02000001&mode=cc&cc_key=AnmeldungEheschliessung",
            "https://efa.hh.niedersachsen.de/govos/go/a/76?c=bc",
            "https://example.com/simple"
          ]
        }
      },
      "dependentRequired": {
        "dependsOnKey": ["dependsOnValue"],
        "dependsOnValue": ["dependsOnKey"]
      }
    }
  }
}
```

## Validierungshinweise

| Regel | Schema-Umsetzung |
|-------|-----------------|
| Mindestens eine Routing-Gruppe | `routingGroups.minItems: 1` |
| Mindestens ein Routing pro Gruppe | `routings.minItems: 1` |
| `dependsOnKey` und `dependsOnValue` nur paarweise | `dependentRequired` auf RoutingGroup und Routing |
| Gruppennamen ohne Sonderzeichen | `pattern: "^[A-Za-z0-9_-]+$"` |
| Ziel-URL muss gültig sein | `format: "uri"` |
| Version im Semver-Format | `pattern: "^\\d+\\.\\d+\\.\\d+$"` |
| Keine zusätzlichen Felder | `additionalProperties: false` auf allen Ebenen |

> **Hinweis:** Die Eindeutigkeit der Gruppennamen (case-insensitive) und die Validierung der Ziel-URL-Erreichbarkeit können nicht allein über JSON Schema abgebildet werden und müssen durch die Anwendungslogik sichergestellt werden.
