// ═══════════════════════════════════════════════════════════════════
// FINANZANALYSE — EXCEL EXPORT (vollständig, alle Felder + Formeln)
// SheetJS (xlsx) muss eingebunden sein:
// <script src="https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"></script>
// ═══════════════════════════════════════════════════════════════════

function exportExcel() {

  // ── HILFSFUNKTIONEN ─────────────────────────────────────────────
  function gv(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    if (el.type === 'checkbox' || el.type === 'radio') return el.checked ? 'Ja' : 'Nein';
    return el.value || '';
  }
  function gn(id) {
    const v = parseFloat(gv(id).replace(/[^\d,.-]/g,'').replace(',','.'));
    return isNaN(v) ? 0 : v;
  }
  function gt(id) { // Get inner text of display spans
    const el = document.getElementById(id);
    return el ? (el.textContent || el.value || '').trim() : '';
  }
  const NAVY = "0F172A", GOLD = "C9A84C", WHITE = "FFFFFF";
  const GRUEN_L = "D1FAE5", ROT_L = "FEE2E2", GRAU_L = "F8FAFC", GRAU_M = "E2E8F0";
  const BLUE_L = "DBEAFE";

  // Einfaches Style-Objekt (SheetJS free: nur numberFormat wird genutzt)
  const EURO = '#,##0.00\\ "€"';
  const EURO0 = '#,##0\\ "€"';
  const PCT  = '0.0%';
  const DATUM = 'DD.MM.YYYY';

  // ── WORKBOOK ERSTELLEN ───────────────────────────────────────────
  const wb = XLSX.utils.book_new();

  // ════════════════════════════════════════════════════════════════
  // SHEET 1: PERSÖNLICHE DATEN
  // ════════════════════════════════════════════════════════════════
  const pData = [
    ["PERSÖNLICHE FINANZ-ANALYSE", "", "", ""],
    ["Tommy Möller · Controller & Finanzberater · Erkner", "", "", ""],
    ["Erstellt am:", new Date().toLocaleDateString('de-DE'), "", ""],
    [],
    ["── PERSON A ──", "", "── PERSON B ──", ""],
    ["Name:",                gv('a_name'),          "Name:",              gv('b_name')],
    ["Titel:",               gv('a_titel'),          "Titel:",             gv('b_titel')],
    ["Geburtsdatum:",        gv('a_geburt'),         "Geburtsdatum:",      gv('b_geburt')],
    ["Geburtsort:",          gv('a_geburtsort'),     "Geburtsort:",        gv('b_geburtsort')],
    ["Staatsangehörigkeit:", gv('a_staat'),          "Staatsangehörigkeit:",gv('b_staat')],
    ["Familienstand:",       gv('a_familienstand'),  "", ""],
    ["Beruf:",               gv('a_beruf'),          "Beruf:",             gv('b_beruf')],
    ["Arbeitgeber:",         gv('a_arbeitgeber'),    "Arbeitgeber:",       gv('b_arbeitgeber')],
    ["Steuer-ID:",           gv('a_steuer'),         "", ""],
    [],
    ["── KONTAKT PERSON A ──","","── KONTAKT PERSON B ──",""],
    ["Straße:",              gv('a_strasse'),        "", ""],
    ["PLZ / Ort:",           gv('a_plz'),            "", ""],
    ["Telefon privat:",      gv('a_tel_p'),          "Telefon privat:",    gv('b_handy')],
    ["E-Mail privat:",       gv('a_email_p'),        "E-Mail privat:",     gv('b_email_p')],
    [],
    ["── BANKVERBINDUNG ──","","",""],
    ["IBAN Person A:",       gv('a_iban'),           "IBAN Person B:",     gv('b_iban')],
    ["BIC Person A:",        gv('a_bic'),            "BIC Person B:",      gv('b_bic')],
    [],
    ["── KINDER ──","","",""],
    ["Kind 1:", gv('kind1'), "Kind 3:", gv('kind3')],
    ["Kind 2:", gv('kind2'), "Kind 4:", gv('kind4')],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(pData);
  ws1['!cols'] = [{wch:28},{wch:24},{wch:28},{wch:24}];
  XLSX.utils.book_append_sheet(wb, ws1, "Persönliche Daten");

  // ════════════════════════════════════════════════════════════════
  // SHEET 2: EINNAHMEN & AUSGABEN
  // ════════════════════════════════════════════════════════════════

  // Werte auslesen
  const einANetto  = gn('ein_a_netto'),  einAMonate = gn('ein_a_monate') || 12;
  const einBNetto  = gn('ein_b_netto'),  einBMonate = gn('ein_b_monate') || 12;
  const kg = gn('kindergeld'), nb = gn('neben'), so = gn('sonst_ein');

  // Ausgaben
  const woMiete=gn('wo_miete'), woNeben=gn('wo_neben'), woStrom=gn('wo_strom'),
        woGas=gn('wo_gas'), woRundf=gn('wo_rundfunk'), woTel=gn('wo_tel'),
        woMuell=gn('wo_muell'), woGrund=gn('wo_grundsteuer'), woGarage=gn('wo_garage');

  const sgKv=gn('sg_kv'), sgBu=gn('sg_bu'), sgHaft=gn('sg_haftpflicht'),
        sgHaus=gn('sg_hausrat'), sgWohn=gn('sg_wohngebaeude'), sgKfz=gn('sg_kfz'),
        sgRisk=gn('sg_risiko'), sgUnf=gn('sg_unfall'), sgPfl=gn('sg_pflege'),
        sgRs=gn('sg_rechtsschutz'), sgGlas=gn('sg_glas'), sgSon=gn('sg_sonst');

  const spTages=gn('sp_tages'), spSpar=gn('sp_sparbuch'), spGiro=gn('sp_giro'),
        spFonds=gn('sp_fonds'), spRiest=gn('sp_riester'), spBav=gn('sp_bav'),
        spPrv=gn('sp_prv'), spPlv=gn('sp_plv'), spBasp=gn('sp_bausparen');

  const lkErn=gn('lk_ernaehrung'), lkHand=gn('lk_handy'), lkKleid=gn('lk_kleidung'),
        lkMob=gn('lk_mobil'), lkVerg=gn('lk_vergn'), lkUrl=gn('lk_urlaub'),
        lkGes=gn('lk_gesundheit'), lkHaust=gn('lk_haustiere'), lkKita=gn('lk_kita'),
        lkBeit=gn('lk_beitraege'), lkStr=gn('lk_streaming'), lkLeas=gn('lk_leasing'),
        lkKred=gn('lk_kredit'), lkGesch=gn('lk_geschenke'), lkSon=gn('lk_sonst');

  // Alle Zeilen mit exakten Zellreferenzen für Formeln
  const eData = [
    ["EINNAHMEN & AUSGABEN", "", "", "", ""],
    [],
    ["EINNAHMEN", "Monatsnetto (€)", "Monate", "Netto gesamt (€/Jahr)", ""],
    ["Person A",          einANetto,  einAMonate, {f:`B4*C4`},          ""],
    ["Person B",          einBNetto,  einBMonate, {f:`B5*C5`},          ""],
    ["Kindergeld (mtl.)", kg,         12,         {f:`B6*C6`},          ""],
    ["Nebeneinkünfte",    nb,         12,         {f:`B7*C7`},          ""],
    ["Sonstige Einnahmen",so,         12,         {f:`B8*C8`},          ""],
    [],
    ["Gesamteinnahmen p.a. (Summe)", "",  "",     {f:`SUM(D4:D8)`},     ""],
    ["Monatliches Haushaltsnetto",   "",  "",     {f:`D10/12`},         ""],
    [],
    ["AUSGABEN (monatlich)", "Ist (€/Monat)", "Soll (€/Monat)", "Abweichung (€)", "p.a. (€)"],
    [],
    ["── WOHNEN & NEBENKOSTEN ──","","","",""],
    ["Miete / Kreditrate",          woMiete,  "", {f:`C16-B16`}, {f:`B16*12`}],
    ["Nebenkosten allgemein",        woNeben,  "", {f:`C17-B17`}, {f:`B17*12`}],
    ["Strom",                        woStrom,  "", {f:`C18-B18`}, {f:`B18*12`}],
    ["Gas / Heizung",                woGas,    "", {f:`C19-B19`}, {f:`B19*12`}],
    ["Rundfunk / GEZ",               woRundf,  "", {f:`C20-B20`}, {f:`B20*12`}],
    ["Telefon / Internet",           woTel,    "", {f:`C21-B21`}, {f:`B21*12`}],
    ["Müll / Abfallentsorgung",      woMuell,  "", {f:`C22-B22`}, {f:`B22*12`}],
    ["Grundsteuer (mtl. Anteil)",    woGrund,  "", {f:`C23-B23`}, {f:`B23*12`}],
    ["Garage / Stellplatz",          woGarage, "", {f:`C24-B24`}, {f:`B24*12`}],
    ["SUMME WOHNEN",  {f:`SUM(B16:B24)`}, {f:`D11*0.3`}, {f:`C25-B25`}, {f:`B25*12`}],
    [],
    ["── ABSICHERUNG / VERSICHERUNGEN ──","","","",""],
    ["Krankenversicherung",          sgKv,   "", {f:`C28-B28`}, {f:`B28*12`}],
    ["Berufsunfähigkeit (BU)",       sgBu,   "", {f:`C29-B29`}, {f:`B29*12`}],
    ["Haftpflichtversicherung",      sgHaft, "", {f:`C30-B30`}, {f:`B30*12`}],
    ["Hausratversicherung",          sgHaus, "", {f:`C31-B31`}, {f:`B31*12`}],
    ["Wohngebäudeversicherung",      sgWohn, "", {f:`C32-B32`}, {f:`B32*12`}],
    ["KFZ-Versicherung",             sgKfz,  "", {f:`C33-B33`}, {f:`B33*12`}],
    ["Risikolebensversicherung",     sgRisk, "", {f:`C34-B34`}, {f:`B34*12`}],
    ["Unfallversicherung",           sgUnf,  "", {f:`C35-B35`}, {f:`B35*12`}],
    ["Pflegeversicherung",           sgPfl,  "", {f:`C36-B36`}, {f:`B36*12`}],
    ["Rechtsschutz",                 sgRs,   "", {f:`C37-B37`}, {f:`B37*12`}],
    ["Glasversicherung",             sgGlas, "", {f:`C38-B38`}, {f:`B38*12`}],
    ["Sonstige Versicherungen",      sgSon,  "", {f:`C39-B39`}, {f:`B39*12`}],
    ["SUMME ABSICHERUNG", {f:`SUM(B28:B39)`},{f:`D11*0.1`},{f:`C40-B40`},{f:`B40*12`}],
    [],
    ["── SPAREN & VORSORGE ──","","","",""],
    ["Tagesgeld",              spTages, "", {f:`C43-B43`}, {f:`B43*12`}],
    ["Sparbuch / Festgeld",    spSpar,  "", {f:`C44-B44`}, {f:`B44*12`}],
    ["Girokonto-Rücklage",     spGiro,  "", {f:`C45-B45`}, {f:`B45*12`}],
    ["Fonds / ETF",            spFonds, "", {f:`C46-B46`}, {f:`B46*12`}],
    ["Riester-Rente",          spRiest, "", {f:`C47-B47`}, {f:`B47*12`}],
    ["Betriebliche AV (bAV)",  spBav,   "", {f:`C48-B48`}, {f:`B48*12`}],
    ["Private Rentenversich.", spPrv,   "", {f:`C49-B49`}, {f:`B49*12`}],
    ["Private Lebensversich.", spPlv,   "", {f:`C50-B50`}, {f:`B50*12`}],
    ["Bausparen",              spBasp,  "", {f:`C51-B51`}, {f:`B51*12`}],
    ["SUMME SPAREN", {f:`SUM(B43:B51)`},{f:`D11*0.3`},{f:`C52-B52`},{f:`B52*12`}],
    [],
    ["── KONSUM & LEBENSHALTUNG ──","","","",""],
    ["Ernährung / Lebensmittel",   lkErn,   "", {f:`C55-B55`}, {f:`B55*12`}],
    ["Mobilfunk / Handy",          lkHand,  "", {f:`C56-B56`}, {f:`B56*12`}],
    ["Kleidung",                   lkKleid, "", {f:`C57-B57`}, {f:`B57*12`}],
    ["Mobilität (Tanken, ÖPNV)",   lkMob,   "", {f:`C58-B58`}, {f:`B58*12`}],
    ["Freizeit / Unterhaltung",    lkVerg,  "", {f:`C59-B59`}, {f:`B59*12`}],
    ["Urlaub / Reisen",            lkUrl,   "", {f:`C60-B60`}, {f:`B60*12`}],
    ["Gesundheit / Arzt",          lkGes,   "", {f:`C61-B61`}, {f:`B61*12`}],
    ["Haustiere",                  lkHaust, "", {f:`C62-B62`}, {f:`B62*12`}],
    ["Kita / Schule",              lkKita,  "", {f:`C63-B63`}, {f:`B63*12`}],
    ["Verein / Mitgliedschaft",    lkBeit,  "", {f:`C64-B64`}, {f:`B64*12`}],
    ["Streaming / Abo",            lkStr,   "", {f:`C65-B65`}, {f:`B65*12`}],
    ["Leasing",                    lkLeas,  "", {f:`C66-B66`}, {f:`B66*12`}],
    ["Ratenkredite",               lkKred,  "", {f:`C67-B67`}, {f:`B67*12`}],
    ["Geschenke",                  lkGesch, "", {f:`C68-B68`}, {f:`B68*12`}],
    ["Sonstiges",                  lkSon,   "", {f:`C69-B69`}, {f:`B69*12`}],
    ["SUMME KONSUM", {f:`SUM(B55:B69)`},{f:`D11*0.3`},{f:`C70-B70`},{f:`B70*12`}],
    [],
    [],
    ["GESAMTÜBERSICHT (monatlich)","Ist (€)","Soll (€)","Abweichung",""],
    ["Gesamtausgaben",  {f:`B25+B40+B52+B70`},{f:`C25+C40+C52+C70`},{f:`C73-B73`},""],
    ["Freies Einkommen",{f:`D11-B73`},         "",                   "",            ""],
    ["Sparquote",       {f:`IFERROR(B52/D11,0)`},"",                 "",            ""],
    [],
    ["Hinweis: Soll-Werte basieren auf der 10/30/30/30-Regel (Absicherung/Wohnen/Sparen/Konsum)",
     "","","",""],
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(eData);
  ws2['!cols'] = [{wch:30},{wch:16},{wch:16},{wch:16},{wch:14}];
  // Zahlenformate setzen
  const euroRows = [
    'B4','B5','B6','B7','B8','D4','D5','D6','D7','D8','D10','D11',
    'B16','B17','B18','B19','B20','B21','B22','B23','B24','B25',
    'D16','D17','D18','D19','D20','D21','D22','D23','D24','D25',
    'E16','E17','E18','E19','E20','E21','E22','E23','E24','E25',
    'B28','B29','B30','B31','B32','B33','B34','B35','B36','B37','B38','B39','B40',
    'D28','D29','D30','D31','D32','D33','D34','D35','D36','D37','D38','D39','D40',
    'E28','E29','E30','E31','E32','E33','E34','E35','E36','E37','E38','E39','E40',
    'B43','B44','B45','B46','B47','B48','B49','B50','B51','B52',
    'B55','B56','B57','B58','B59','B60','B61','B62','B63','B64','B65','B66','B67','B68','B69','B70',
    'B73','B74','C73','D73',
  ];
  euroRows.forEach(ref => {
    if (!ws2[ref]) ws2[ref] = { t: 'n', v: 0 };
    ws2[ref].z = EURO0;
  });
  if (ws2['B75']) ws2['B75'].z = PCT;
  XLSX.utils.book_append_sheet(wb, ws2, "Einnahmen & Ausgaben");

  // ════════════════════════════════════════════════════════════════
  // SHEET 3: SPARWÜNSCHE & ZIELE
  // ════════════════════════════════════════════════════════════════
  const swData = [
    ["SPARWÜNSCHE & ZIELE", "", "", "", ""],
    [],
    ["Ziel", "Kapitalbedarf (€)", "Mtl. Sparbetrag (€)", "Zeithorizont", ""],
    [gv('sw_ziel1') || "Ziel 1", gn('sw_kapital1'), gn('sw_mtl1'), gv('sw_zeit1'), ""],
    [gv('sw_ziel2') || "Ziel 2", gn('sw_kapital2'), gn('sw_mtl2'), gv('sw_zeit2'), ""],
    [gv('sw_ziel3') || "Ziel 3", gn('sw_kapital3'), gn('sw_mtl3'), gv('sw_zeit3'), ""],
    [],
    ["Kurzfristige Ziele (< 3 J.)", gn('sw_kurz'),   "", "", ""],
    ["Mittelfristige Ziele (3–7 J)",gn('sw_mittel'), "", "", ""],
    ["Langfristige Ziele (> 7 J.)", gn('sw_lang'),   "", "", ""],
    [],
    ["Gesamtwunsch (€/Monat)",      {f:`C4+C5+C6`},  "", "", ""],
    ["Schutzengel-Anteil (€/Monat)",gn('sw_schutzengel'), "", "", ""],
    ["Überschuss / Defizit",        gn('sw_ueberschuss'),  "", "", ""],
    [],
    ["Weitere Wünsche & Anmerkungen:","","","",""],
    [gv('weitere_ziele'), "", "", "", ""],
    ["Wunsch A:", gv('wunsch_a'), "", "", ""],
    ["Wunsch B:", gv('wunsch_b'), "", "", ""],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(swData);
  ws3['!cols'] = [{wch:30},{wch:20},{wch:20},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb, ws3, "Sparwünsche & Ziele");

  // ════════════════════════════════════════════════════════════════
  // SHEET 4: ALTERSVORSORGE
  // ════════════════════════════════════════════════════════════════
  const avData = [
    ["ALTERSVORSORGE & RENTE", "", "", ""],
    [],
    ["── GESETZLICHE RENTENERWARTUNG ──", "", "", ""],
    ["",                          "Person A",            "Person B",           ""],
    ["Erwartete Altersrente (€/Monat)", gn('rente_a_alt'), gn('rente_b_alt'), ""],
    ["Erwartete EM-Rente (€/Monat)",    gn('rente_a_em'),  gn('rente_b_em'),  ""],
    [],
    ["── RIESTER-RENTE ──", "", "", ""],
    ["",                    "Person A",              "Person B",         ""],
    ["Monatl. Beitrag (€)", gn('av_riester_a_beit'), gn('av_riester_b_beit'), ""],
    ["Aktuelles Guthaben (€)",gn('av_riester_a_gut'), gn('av_riester_b_gut'), ""],
    ["Vertragssumme (€)",   gn('av_riester_a_sum'),  gn('av_riester_b_sum'), ""],
    [],
    ["── LEBENSVERSICHERUNG & WEITERE ──", "", "", ""],
    ["LV Person A (€/Monat)",      gn('av_lv_a_beit'),    "", ""],
    ["LV Person B (€/Monat)",      gn('av_lv_b_beit'),    "", ""],
    ["bAV (€/Monat)",              gn('av_bav_beit'),     "", ""],
    ["Basisrente Person A (€/Monat)", gn('av_basis_a_beit'),"",""],
    ["Basisrente Person B (€/Monat)", gn('av_basis_b_beit'),"",""],
    [],
    ["SUMME VORSORGE-BEITRÄGE (€/Monat)", {f:`B10+B11+B15+B16+B17+B18+B19`}, "", ""],
    ["SUMME VORSORGE-BEITRÄGE (€/Jahr)",  {f:`B21*12`}, "", ""],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(avData);
  ws4['!cols'] = [{wch:34},{wch:18},{wch:18},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws4, "Altersvorsorge");

  // ════════════════════════════════════════════════════════════════
  // SHEET 5: ZUSAMMENFASSUNG & KENNZAHLEN
  // ════════════════════════════════════════════════════════════════

  // Werte aus Sheet 2 direkt berechnen (eigene Berechnung für Übersicht)
  const sumWohnen = woMiete+woNeben+woStrom+woGas+woRundf+woTel+woMuell+woGrund+woGarage;
  const sumSchutz = sgKv+sgBu+sgHaft+sgHaus+sgWohn+sgKfz+sgRisk+sgUnf+sgPfl+sgRs+sgGlas+sgSon;
  const sumSparen = spTages+spSpar+spGiro+spFonds+spRiest+spBav+spPrv+spPlv+spBasp;
  const sumKonsum = lkErn+lkHand+lkKleid+lkMob+lkVerg+lkUrl+lkGes+lkHaust+lkKita+lkBeit+lkStr+lkLeas+lkKred+lkGesch+lkSon;
  const einJahr   = (einANetto*einAMonate)+(einBNetto*einBMonate)+(kg*12)+(nb*12)+(so*12);
  const einMonat  = einJahr/12;
  const gesamtAus = sumWohnen+sumSchutz+sumSparen+sumKonsum;
  const freiEink  = einMonat - gesamtAus;
  const sparquote = einMonat > 0 ? sumSparen/einMonat : 0;

  const zsData = [
    ["ZUSAMMENFASSUNG & FINANZKENNZAHLEN", "", ""],
    ["Tommy Möller · Finanzberatung & Controlling", "", ""],
    ["Erstellt am:", new Date().toLocaleDateString('de-DE'), ""],
    ["Erstellt für:", gv('a_name') + (gv('b_name') ? ' & ' + gv('b_name') : ''), ""],
    [],
    ["── EINNAHMEN ──────────────────────────────────────────","",""],
    ["Jahresnettoeinkommen (gesamt)", einJahr,  "€/Jahr"],
    ["Monatliches Haushaltsnetto",    einMonat, "€/Monat"],
    [],
    ["── AUSGABEN (monatlich) ────────────────────────────────","",""],
    ["Wohnen & Nebenkosten",  sumWohnen,  "€/Monat"],
    ["Absicherung",           sumSchutz,  "€/Monat"],
    ["Sparen & Vorsorge",     sumSparen,  "€/Monat"],
    ["Konsum & Lebenshaltung",sumKonsum,  "€/Monat"],
    ["Gesamtausgaben",        gesamtAus,  "€/Monat"],
    [],
    ["── KENNZAHLEN ─────────────────────────────────────────","",""],
    ["Freies Einkommen (nach allen Ausgaben)", freiEink,   "€/Monat"],
    ["Sparquote",                               sparquote,  "% des Nettoeinkommens"],
    ["Ausgabenquote",  einMonat>0?gesamtAus/einMonat:0, "% des Nettoeinkommens"],
    ["Wohnkostenquote",einMonat>0?sumWohnen/einMonat:0, "% des Nettoeinkommens"],
    [],
    ["── BUDGET-VERGLEICH (10/30/30/30-Regel) ───────────────","",""],
    ["",                     "IST (€)",    "SOLL (€)"],
    ["Absicherung (10 %)",   sumSchutz,    einMonat*0.10],
    ["Wohnen (30 %)",        sumWohnen,    einMonat*0.30],
    ["Sparen (30 %)",        sumSparen,    einMonat*0.30],
    ["Konsum (30 %)",        sumKonsum,    einMonat*0.30],
    [],
    ["── WEITERE HINWEISE ───────────────────────────────────","",""],
    ["Notizen Termin:", gv('notizen_termin'), ""],
    [],
    ["Diese Zusammenfassung dient der allgemeinen Orientierung.",
     "Für eine verbindliche Empfehlung wenden Sie sich an Tommy Möller.", ""],
  ];

  const ws5 = XLSX.utils.aoa_to_sheet(zsData);
  ws5['!cols'] = [{wch:40},{wch:18},{wch:28}];

  // Zahlformate in Zusammenfassung
  ['B7','B8','B11','B12','B13','B14','B15','B18','B25','B26','B27','B28','C25','C26','C27','C28']
    .forEach(ref => { if(ws5[ref]) ws5[ref].z = EURO0; });
  ['B19','B20','B21'].forEach(ref => { if(ws5[ref]) ws5[ref].z = PCT; });

  XLSX.utils.book_append_sheet(wb, ws5, "Zusammenfassung");

  // ── DATEINAME & DOWNLOAD ────────────────────────────────────────
  const name = gv('a_name').replace(/\s+/g,'_') || 'Kunde';
  const datum = new Date().toISOString().slice(0,10);
  const fileName = `Finanzanalyse_${name}_${datum}.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  // Feedback an Benutzer
  showExportNotification('✅ Excel erfolgreich exportiert: ' + fileName);
}

/**
 * Zeigt eine Exportbestätigung an
 */
function showExportNotification(message) {
  const badge = document.getElementById('autosaveBadge');
  if (badge) {
    badge.textContent = message;
    badge.classList.add('visible');
    setTimeout(() => {
      badge.classList.remove('visible');
    }, 3000);
  }
}
