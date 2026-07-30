# Discover / Recommend — Content Permutations

All items in `seeds/library/discover-recommend/` carry **Intent = 1 (Discover / Recommend)**.  
The other two intents (Educate/Govern, Simulate/Transact) live in separate library folders.

Block types present: **HeroBlockv2**, **CardBlock**, **Paragraph**

---

## Hero Blocks (HeroBlockv2)

Heroes carry only **Intent + Geo** — no Persona or Service filter.  
Any query with `Intent=1` will match the hero for the matching Geo.

| Geo             | Display Name                          |
|-----------------|---------------------------------------|
| Canada          | Canadian Institutional Markets        |
| Europe          | European Institutional Solutions      |
| United States   | US Institutional Solutions            |
| Global          | Global Institutional Solutions        |

---

## Paragraph (Article) Blocks

| Display Name                                         | Persona            | Service(s)                      | Geo           |
|------------------------------------------------------|--------------------|---------------------------------|---------------|
| ESG Mutual Fund Administration – Canada              | Asset Manager      | Fund Administration, ESG        | Canada        |
| UK Pension Fund FX Cash Drag – Europe                | Pension Fund       | Foreign Exchange                | Europe        |
| US Corporate Treasury Entering Canada                | Corporate Sponsor  | Treasury Services               | United States |
| ETF Servicing – Canada                               | Asset Manager      | ETF Services                    | Canada        |
| Alternative Investment Servicing – Global            | Asset Manager      | Alternative Investments         | Global        |
| Securities Lending Program Design – Canada           | Pension Fund       | Securities Lending              | Canada        |
| Global Custody Options – United States               | Insurance Provider | Global Custody                  | United States |
| Cross-Border Fund Administration – Europe            | Asset Manager      | Fund Administration             | Europe        |
| Canadian Sub-Custody for Foreign Institutions        | Foreign Institution| Global Custody                  | Canada        |
| Recordkeeping Models for Multinational Sponsors      | Corporate Sponsor  | Recordkeeping                   | Global        |

---

## Card Blocks

### Asset Manager (Persona 1)

| Service                | Canada | Europe | US | Global |
|------------------------|:------:|:------:|:--:|:------:|
| Fund Administration    | ✓      | ✓      |    |        |
| ETF Services           | ✓      |        |    |        |
| Alternative Investments|        |        |    | ✓      |
| Securities Lending     | ✓      |        |    |        |
| Global Custody         |        |        |    | ✓      |
| ESG                    | ✓      |        |    |        |
| Regulatory             | ✓      |        |    |        |
| Tax                    | ✓      | ✓      |    |        |
| Onboarding             | ✓      |        |    |        |
| Compliance             | ✓      |        |    |        |

### Pension Fund (Persona 2)

| Service                | Canada | Europe | US | Global |
|------------------------|:------:|:------:|:--:|:------:|
| Foreign Exchange       | ✓      | ✓      |    |        |
| Treasury Services      | ✓      |        |    |        |
| Alternative Investments| ✓      |        |    |        |
| Securities Lending     | ✓      |        |    |        |
| Global Custody         | ✓      |        |    |        |
| Recordkeeping          | ✓      |        |    |        |
| ESG                    | ✓      |        |    |        |
| Regulatory             | ✓      |        |    |        |
| Tax                    | ✓      |        |    |        |
| Compliance             | ✓      |        |    |        |

### Corporate Sponsor (Persona 3)

| Service                | Canada | Europe | US | Global |
|------------------------|:------:|:------:|:--:|:------:|
| Treasury Services      | ✓      |        | ✓  |        |
| Recordkeeping          |        |        |    | ✓      |

### Foreign Institution (Persona 4)

| Service                | Canada | Europe | US | Global |
|------------------------|:------:|:------:|:--:|:------:|
| Foreign Exchange       | ✓      |        |    |        |
| Global Custody         | ✓      | ✓      | ✓  |        |
| Regulatory             | ✓      |        |    |        |
| Onboarding             | ✓      |        |    |        |
| Compliance             | ✓      |        |    |        |

### Insurance Provider (Persona 5)

| Service                | Canada | Europe | US | Global |
|------------------------|:------:|:------:|:--:|:------:|
| Fund Administration    | ✓      |        |    |        |
| Global Custody         |        |        | ✓  |        |

---

## Assembly Wizard — Recommended Combos

These combinations will produce a **full page** (hero + article + cards) in the wizard at `/assemble`.  
The hero matches on Geo only; article and cards match on Persona + Service + Geo.

| Persona            | Service              | Geo           | Hero | Article | Cards |
|--------------------|----------------------|---------------|:----:|:-------:|:-----:|
| Asset Manager      | Fund Administration  | Canada        | ✓    | ✓ (ESG + Fund Admin para) | ✓ |
| Asset Manager      | Fund Administration  | Europe        | ✓    | ✓       | ✓     |
| Asset Manager      | ETF Services         | Canada        | ✓    | ✓       | ✓     |
| Asset Manager      | Alternative Investments | Global     | ✓    | ✓       | ✓     |
| Asset Manager      | Securities Lending   | Canada        | ✓    | —       | ✓     |
| Asset Manager      | Global Custody       | Global        | ✓    | —       | ✓     |
| Asset Manager      | Tax                  | Canada        | ✓    | —       | ✓     |
| Asset Manager      | Tax                  | Europe        | ✓    | —       | ✓     |
| Asset Manager      | Compliance           | Canada        | ✓    | —       | ✓     |
| Pension Fund       | Foreign Exchange     | Canada        | ✓    | —       | ✓     |
| Pension Fund       | Foreign Exchange     | Europe        | ✓    | ✓       | ✓     |
| Pension Fund       | Securities Lending   | Canada        | ✓    | ✓       | ✓     |
| Pension Fund       | Global Custody       | Canada        | ✓    | —       | ✓     |
| Pension Fund       | Alternative Investments | Canada    | ✓    | —       | ✓     |
| Pension Fund       | Compliance           | Canada        | ✓    | —       | ✓     |
| Corporate Sponsor  | Treasury Services    | United States | ✓    | ✓       | ✓     |
| Corporate Sponsor  | Recordkeeping        | Global        | ✓    | ✓       | ✓     |
| Foreign Institution| Global Custody       | Canada        | ✓    | ✓       | ✓     |
| Foreign Institution| Global Custody       | Europe        | ✓    | —       | ✓     |
| Foreign Institution| Global Custody       | United States | ✓    | —       | ✓     |
| Foreign Institution| Compliance           | Canada        | ✓    | —       | ✓     |
| Foreign Institution| Onboarding           | Canada        | ✓    | —       | ✓     |
| Insurance Provider | Global Custody       | United States | ✓    | ✓       | ✓     |
| Insurance Provider | Fund Administration  | Canada        | ✓    | —       | ✓     |

> **Note:** "—" in Article means no Paragraph block exists for that exact combo; the wizard will still assemble a hero + cards page. The `fetchByTaxonomy` query filters Paragraph and CardBlock independently, so a missing article doesn't block assembly.

---

## Gap Summary

Services with **no Paragraph** coverage in this library:
`Foreign Exchange (Canada)`, `Treasury Services (Canada)`, `Securities Lending (Canada)`,
`Global Custody (Canada/Europe/US)`, `Recordkeeping (Canada)`, `ESG`, `Regulatory`,
`Tax`, `Onboarding`, `Compliance`

Personas with the **deepest card coverage**: Asset Manager (10 services) · Pension Fund (10 services)  
Personas with the **lightest coverage**: Corporate Sponsor (2 services) · Insurance Provider (2 services)

Geos with **no Paragraph coverage**: Europe (only Fund Admin + FX) · US (only Treasury + Custody)  
Only **Canada** and **Global** have broad Paragraph coverage.
