/**
 * Excel Export Handler
 * Handles all Excel export functionality for Finanz-Analyse
 */

function exportExcel() {
  try {
    // Sammle alle Daten aus dem Formular
    const formData = collectAllFormData();
    
    // Erstelle ein neues Workbook
    const wb = XLSX.utils.book_new();
    
    // Blatt 1: Persönliche Daten
    const personalData = [
      ['PERSÖNLICHE DATEN'],
      [''],
      ['Person A'],
      ['Titel', formData.a_titel || ''],
      ['Name', formData.a_name || ''],
      ['Geburtsdatum', formData.a_geburt || ''],
      ['Geburtsort', formData.a_geburtsort || ''],
      ['Staatsangehörigkeit', formData.a_staat || ''],
      ['Familienstand', formData.a_familienstand || ''],
      ['Raucher', formData.a_raucher || ''],
      ['Beruf', formData.a_beruf || ''],
      ['Arbeitgeber', formData.a_arbeitgeber || ''],
      ['E-Mail privat', formData.a_email_p || ''],
      ['E-Mail geschäftlich', formData.a_email_g || ''],
      ['Telefon privat', formData.a_tel_p || ''],
      ['Telefon geschäftlich', formData.a_tel_g || ''],
      ['Handy', formData.a_handy || ''],
      ['Straße', formData.a_strasse || ''],
      ['PLZ', formData.a_plz || ''],
      ['Ort', formData.a_ort || '']
    ];
    
    // Überprüfe auf Person B
    if (formData.b_name) {
      personalData.push(['']);
      personalData.push(['Person B']);
      personalData.push(['Titel', formData.b_titel || '']);
      personalData.push(['Name', formData.b_name || '']);
      personalData.push(['Geburtsdatum', formData.b_geburt || '']);
      personalData.push(['Geburtsort', formData.b_geburtsort || '']);
      personalData.push(['Staatsangehörigkeit', formData.b_staat || '']);
      personalData.push(['Familienstand', formData.b_familienstand || '']);
      personalData.push(['Raucher', formData.b_raucher || '']);
      personalData.push(['Beruf', formData.b_beruf || '']);
      personalData.push(['Arbeitgeber', formData.b_arbeitgeber || '']);
      personalData.push(['E-Mail privat', formData.b_email_p || '']);
      personalData.push(['E-Mail geschäftlich', formData.b_email_g || '']);
      personalData.push(['Telefon privat', formData.b_tel_p || '']);
      personalData.push(['Telefon geschäftlich', formData.b_tel_g || '']);
      personalData.push(['Handy', formData.b_handy || '']);
      personalData.push(['Straße', formData.b_strasse || '']);
      personalData.push(['PLZ', formData.b_plz || '']);
      personalData.push(['Ort', formData.b_ort || '']);
    }
    
    const wsPersonal = XLSX.utils.aoa_to_sheet(personalData);
    wsPersonal['!cols'] = [{wch: 25}, {wch: 35}];
    XLSX.utils.book_append_sheet(wb, wsPersonal, 'Persönliche Daten');
    
    // Blatt 2: Ziele
    if (formData.goals && formData.goals.length > 0) {
      const goalsData = [
        ['WÜNSCHE & ZIELE'],
        [''],
        ['Ziel', 'Priorität', 'Horizont (Jahre)', 'Betrag']
      ];
      formData.goals.forEach(goal => {
        goalsData.push([goal.name || '', goal.priority || '', goal.horizon || '', goal.amount || '']);
      });
      const wsGoals = XLSX.utils.aoa_to_sheet(goalsData);
      wsGoals['!cols'] = [{wch: 25}, {wch: 15}, {wch: 18}, {wch: 12}];
      XLSX.utils.book_append_sheet(wb, wsGoals, 'Ziele');
    }
    
    // Blatt 3: Einnahmen & Ausgaben
    const incomeExpenseData = [
      ['EINNAHMEN & AUSGABEN'],
      [''],
      ['EINNAHMEN', 'Monatlich (€)', 'Jährlich (€)'],
      ['Grundeinkommen Person A', formData.ein_grundeinkommen_a || '', formatCurrency(formData.ein_grundeinkommen_a * 12)],
      ['Zusatzeinkommen Person A', formData.ein_zusatz_a || '', formatCurrency(formData.ein_zusatz_a * 12)],
      ['Grundeinkommen Person B', formData.ein_grundeinkommen_b || '', formatCurrency(formData.ein_grundeinkommen_b * 12)],
      ['Zusatzeinkommen Person B', formData.ein_zusatz_b || '', formatCurrency(formData.ein_zusatz_b * 12)],
      ['Sonstige Einnahmen', formData.ein_sonstig || '', formatCurrency(formData.ein_sonstig * 12)],
      [''],
      ['AUSGABEN', 'Monatlich (€)', 'Jährlich (€)'],
      ['Miete / Nebenkosten', formData.aus_miete || '', formatCurrency(formData.aus_miete * 12)],
      ['Versicherungen', formData.aus_versicherung || '', formatCurrency(formData.aus_versicherung * 12)],
      ['Lebensmittel', formData.aus_lebensmittel || '', formatCurrency(formData.aus_lebensmittel * 12)],
      ['Mobilität', formData.aus_mobilitaet || '', formatCurrency(formData.aus_mobilitaet * 12)],
      ['Kinderbetreuung / Bildung', formData.aus_kinder || '', formatCurrency(formData.aus_kinder * 12)],
      ['Freizeit & Kultur', formData.aus_freizeit || '', formatCurrency(formData.aus_freizeit * 12)],
      ['Gesundheit & Körperpflege', formData.aus_gesundheit || '', formatCurrency(formData.aus_gesundheit * 12)],
      ['Kleidung', formData.aus_kleidung || '', formatCurrency(formData.aus_kleidung * 12)],
      ['Kommunikation', formData.aus_kommunikation || '', formatCurrency(formData.aus_kommunikation * 12)],
      ['Haushalt', formData.aus_haushalt || '', formatCurrency(formData.aus_haushalt * 12)],
      ['Sonstige Ausgaben', formData.aus_sonstig || '', formatCurrency(formData.aus_sonstig * 12)]
    ];
    
    const wsIncomeExpense = XLSX.utils.aoa_to_sheet(incomeExpenseData);
    wsIncomeExpense['!cols'] = [{wch: 30}, {wch: 15}, {wch: 15}];
    XLSX.utils.book_append_sheet(wb, wsIncomeExpense, 'Einnahmen & Ausgaben');
    
    // Blatt 4: Sparwunsch
    const savingsData = [
      ['SPARWUNSCH'],
      [''],
      ['Kategorie', 'Anteil (%)', 'Betrag (€ monatlich)'],
      ['Schutzengel (Notgroschen)', formData.spar_schutzengel_pct || '', formData.spar_schutzengel_amt || ''],
      ['Wohnen (Eigenheim)', formData.spar_wohnen_pct || '', formData.spar_wohnen_amt || ''],
      ['Sparen (Vermögensaufbau)', formData.spar_vermogen_pct || '', formData.spar_vermogen_amt || ''],
      ['Konsum (Lebensstil)', formData.spar_konsum_pct || '', formData.spar_konsum_amt || '']
    ];
    
    const wsSavings = XLSX.utils.aoa_to_sheet(savingsData);
    wsSavings['!cols'] = [{wch: 30}, {wch: 15}, {wch: 20}];
    XLSX.utils.book_append_sheet(wb, wsSavings, 'Sparwunsch');
    
    // Blatt 5: Vermögensaufbau
    if (formData.assets && formData.assets.length > 0) {
      const assetsData = [
        ['VERMÖGENSAUFBAU'],
        [''],
        ['Beschreibung', 'Betrag (€)', 'Zinssatz (%)', 'Laufzeit (Jahre)']
      ];
      formData.assets.forEach(asset => {
        assetsData.push([
          asset.description || '',
          asset.amount || '',
          asset.rate || '',
          asset.duration || ''
        ]);
      });
      const wsAssets = XLSX.utils.aoa_to_sheet(assetsData);
      wsAssets['!cols'] = [{wch: 30}, {wch: 15}, {wch: 15}, {wch: 15}];
      XLSX.utils.book_append_sheet(wb, wsAssets, 'Vermögensaufbau');
    }
    
    // Blatt 6: Absicherung
    const protectionData = [
      ['GESUNDHEIT & ABSICHERUNG'],
      [''],
      ['Krankenversicherung Person A', formData.abs_kranken_a || ''],
      ['Krankenversicherung Person B', formData.abs_kranken_b || ''],
      [''],
      ['BERUFSUNFÄHIGKEIT'],
      ['Person A', formData.abs_bu_a || ''],
      ['Person B', formData.abs_bu_b || ''],
      [''],
      ['ALTERSVERSORGUNG'],
      ['Gesetzliche Rente Person A', formData.alt_gesetzlich_a || ''],
      ['Betriebliche Versorgung Person A', formData.alt_betrieblich_a || ''],
      ['Private Altersversorgung Person A', formData.alt_privat_a || ''],
      ['Gesetzliche Rente Person B', formData.alt_gesetzlich_b || ''],
      ['Betriebliche Versorgung Person B', formData.alt_betrieblich_b || ''],
      ['Private Altersversorgung Person B', formData.alt_privat_b || '']
    ];
    
    const wsProtection = XLSX.utils.aoa_to_sheet(protectionData);
    wsProtection['!cols'] = [{wch: 35}, {wch: 40}];
    XLSX.utils.book_append_sheet(wb, wsProtection, 'Absicherung');
    
    // Speichere das Workbook
    const fileName = `Finanz-Analyse_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showAutosaveBadge('📊 Excel erfolgreich exportiert');
  } catch (error) {
    console.error('Fehler beim Excel-Export:', error);
    alert('Fehler beim Excel-Export: ' + error.message);
  }
}

/**
 * Sammelt alle Formulardaten
 */
function collectAllFormData() {
  const data = {};
  
  // Sammle alle Input-Elemente
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.id) {
      if (input.type === 'radio' || input.type === 'checkbox') {
        if (input.checked) {
          data[input.name || input.id] = input.value;
        }
      } else {
        data[input.id] = input.value;
      }
    }
  });
  
  // Sammle Goals
  const goalItems = document.querySelectorAll('[data-goal-id]');
  data.goals = [];
  goalItems.forEach(item => {
    const goal = {
      name: item.querySelector('[data-field="name"]')?.value || '',
      priority: item.querySelector('[data-field="priority"]')?.value || '',
      horizon: item.querySelector('[data-field="horizon"]')?.value || '',
      amount: item.querySelector('[data-field="amount"]')?.value || ''
    };
    if (goal.name) data.goals.push(goal);
  });
  
  // Sammle Assets
  const assetRows = document.querySelectorAll('[data-asset-id]');
  data.assets = [];
  assetRows.forEach(row => {
    const asset = {
      description: row.querySelector('[data-field="description"]')?.value || '',
      amount: row.querySelector('[data-field="amount"]')?.value || '',
      rate: row.querySelector('[data-field="rate"]')?.value || '',
      duration: row.querySelector('[data-field="duration"]')?.value || ''
    };
    if (asset.description) data.assets.push(asset);
  });
  
  return data;
}

/**
 * Formatiert Zahlen als Währung
 */
function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Zeigt das Autosave-Badge an
 */
function showAutosaveBadge(message = '💾 Automatisch gespeichert') {
  const badge = document.getElementById('autosaveBadge');
  if (badge) {
    badge.textContent = message;
    badge.classList.add('visible');
    setTimeout(() => {
      badge.classList.remove('visible');
    }, 3000);
  }
}
