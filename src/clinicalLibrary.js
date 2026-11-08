// Content restored from the original CardioAssist HTML supplied by the project team.
// Summaries are historical/demo excerpts and must be checked against the source before clinical use.
export const GUIDELINES = [
  {
    "tag": "ESC",
    "tagColor": "pill-blue",
    "title": "2023 ESC Guidelines for Acute Coronary Syndromes",
    "meta": "European Society of Cardiology · ESC 2023",
    "body": "Covers diagnosis, risk stratification and management of ACS including STEMI, NSTEMI and unstable angina. Key concepts: dual antiplatelet therapy, early invasive strategy, and secondary prevention targets.",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/"
  },
  {
    "tag": "AHA/ACC",
    "tagColor": "pill-green",
    "title": "2022 AHA/ACC/HFSA Heart Failure Guideline",
    "meta": "American Heart Association · ACC 2022",
    "body": "Defines HF classification by ejection fraction (HFrEF, HFmrEF, HFpEF) with GDMT recommendations and updated four-pillar therapy for HFrEF.",
    "url": "https://professional.heart.org/en/science-news/2022-guideline-for-the-management-of-heart-failure"
  },
  {
    "tag": "ESC",
    "tagColor": "pill-blue",
    "title": "2021 ESC Guidelines on Cardiovascular Disease Prevention",
    "meta": "European Society of Cardiology · ESC 2021",
    "body": "LDL-C targets, risk assessment via SCORE2/SCORE2-OP, and lifestyle + pharmacological prevention strategies for primary and secondary prevention.",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cvd-prevention"
  },
  {
    "tag": "NICE",
    "tagColor": "pill-amber",
    "title": "NICE NG185 — Acute Coronary Syndromes",
    "meta": "National Institute for Health and Care Excellence",
    "body": "Evidence-based recommendations on early risk assessment, antiplatelet therapy, reperfusion strategies and cardiac rehabilitation after ACS.",
    "url": "https://www.nice.org.uk/guidance/ng185"
  },
  {
    "tag": "ESC",
    "tagColor": "pill-blue",
    "title": "2023 ESC Guidelines for Endocarditis",
    "meta": "European Society of Cardiology · ESC 2023",
    "body": "Updated diagnostic criteria, role of imaging (echo, PET-CT), antibiotic prophylaxis and surgical indications for infective endocarditis.",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/"
  }
];

export const STUDIES = [
  {
    "tag": "RCT",
    "tagColor": "pill-green",
    "title": "DAPA-HF — Dapagliflozin in Heart Failure",
    "meta": "N Engl J Med · 2019 · n=4,744",
    "body": "SGLT2 inhibitor reduced worsening HF or CV death in HFrEF, establishing SGLT2i as a pillar of HFrEF therapy regardless of diabetes status.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Dapagliflozin%20in%20Patients%20with%20Heart%20Failure%20and%20Reduced%20Ejection%20Fraction%202019%20DAPA-HF",
    "linkLabel": "Read study on PubMed"
  },
  {
    "tag": "RCT",
    "tagColor": "pill-green",
    "title": "EMPEROR-Reduced — Empagliflozin",
    "meta": "N Engl J Med · 2020 · n=3,730",
    "body": "Empagliflozin reduced composite of CV death or HF hospitalization in HFrEF, corroborating the SGLT2i class benefit.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Cardiovascular%20and%20Renal%20Outcomes%20with%20Empagliflozin%20in%20Heart%20Failure%20EMPEROR-Reduced%202020",
    "linkLabel": "Read study on PubMed"
  },
  {
    "tag": "Meta-analysis",
    "tagColor": "pill-blue",
    "title": "SGLT2 Inhibitors in HF Across EF Spectrum",
    "meta": "Lancet · 2022 · pooled RCTs",
    "body": "Consistent benefit of SGLT2 inhibitors across HFrEF, HFmrEF and HFpEF for reducing HF hospitalization; supports guideline expansion.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/36041474/",
    "linkLabel": "Read study on PubMed"
  },
  {
    "tag": "Registry",
    "tagColor": "pill-amber",
    "title": "Global ACS Outcomes Registry",
    "meta": "Eur Heart J · 2021 · n>50,000",
    "body": "Highlights disparities in reperfusion times and DAPT adherence across regions; informs quality improvement benchmarks.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Global%20ACS%20outcomes%20registry%20reperfusion%20dual%20antiplatelet%20therapy%202021",
    "linkLabel": "Search PubMed for source"
  },
  {
    "tag": "RCT",
    "tagColor": "pill-green",
    "title": "ISCHEMIA — Invasive vs Conservative",
    "meta": "N Engl J Med · 2020 · n=5,179",
    "body": "In stable CAD with moderate-severe ischemia, initial invasive strategy did not reduce CV events versus optimal medical therapy alone over median 3.2 years.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Initial%20Invasive%20or%20Conservative%20Strategy%20for%20Stable%20Coronary%20Disease%20ISCHEMIA%202020",
    "linkLabel": "Read study on PubMed"
  }
];

export const DRUG_LEAFLETS = [
  {
    "id": "metoprolol-succ",
    "name": "Metoprolol Succinate",
    "brand": "Toprol-XL (representative)",
    "cls": "Beta-blocker (β₁-selective)",
    "clsColor": "pill-blue",
    "source": "FDA Prescribing Information",
    "sourceYear": "2018",
    "indications": "Hypertension, angina pectoris, heart failure (to reduce CV mortality and HF hospitalization).",
    "dosage": "Adults: initial 25–100 mg once daily; titrate at weekly intervals.",
    "contraindications": "Severe bradycardia, 2nd/3rd degree heart block, cardiogenic shock, decompensated heart failure.",
    "warnings": "Do not abruptly discontinue (risk of angina exacerbation/MI). May mask hypoglycemia symptoms. Caution in bronchospastic disease.",
    "interactions": "CYP2D6 inhibitors increase metoprolol levels. Additive bradycardia with digoxin, clonidine, diltiazem, verapamil. NSAIDs may reduce antihypertensive effect.",
    "pregnancy": "May cause fetal harm; use only if clearly needed.",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Metoprolol%20Succinate",
    "linkLabel": "Find current product label on DailyMed"
  },
  {
    "id": "rosuvastatin",
    "name": "Rosuvastatin",
    "brand": "Crestor",
    "cls": "Statin (HMG-CoA reductase inhibitor)",
    "clsColor": "pill-green",
    "source": "FDA Prescribing Information",
    "sourceYear": "2024",
    "indications": "Primary hyperlipidemia, mixed dyslipidemia, CV risk reduction in adults without CHD but with elevated hsCRP and ≥1 risk factor.",
    "dosage": "5–40 mg once daily; Asian patients may require lower starting dose.",
    "contraindications": "Acute liver failure, decompensated cirrhosis, hypersensitivity.",
    "warnings": "Myopathy/rhabdomyolysis (dose-dependent). Immune-mediated necrotizing myopathy (rare). Monitor liver enzymes. Increases in HbA1c and fasting glucose.",
    "interactions": "Aluminum/magnesium antacids: give rosuvastatin ≥2 h before. Warfarin: monitor INR. Strong CYP3A4 inhibitors not a major concern (unlike simvastatin).",
    "pregnancy": "May cause fetal harm. Breastfeeding not recommended.",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Rosuvastatin",
    "linkLabel": "Find current product label on DailyMed"
  },
  {
    "id": "aspirin-low",
    "name": "Aspirin (low-dose)",
    "brand": "Generic (81–325 mg)",
    "cls": "Antiplatelet (COX inhibitor)",
    "clsColor": "pill-amber",
    "source": "EFDA Label (BP)",
    "sourceYear": "2023",
    "indications": "Secondary prevention of cardiovascular events; antiplatelet therapy.",
    "dosage": "81–325 mg once daily (cardioprotective dose).",
    "contraindications": "Active peptic ulcer, bleeding disorders, aspirin-exacerbated respiratory disease, pregnancy (3rd trimester).",
    "warnings": "Increased bleeding risk with anticoagulants/NSAIDs. May attenuate ACE inhibitor efficacy (at high doses ≥3 g/day). Ibuprofen may interfere with antiplatelet effect.",
    "interactions": "Anticoagulants (warfarin, heparin): ↑ bleeding risk. NSAIDs (ibuprofen): may reduce cardioprotection. Methotrexate: ↑ toxicity. ACE inhibitors: hypotensive effect may be diminished.",
    "pregnancy": "Avoid in 3rd trimester (premature closure of ductus arteriosus).",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Aspirin%20%28low-dose%29",
    "linkLabel": "Find current product label on DailyMed"
  },
  {
    "id": "benazepril",
    "name": "Benazepril",
    "brand": "Lotensin (representative)",
    "cls": "ACE inhibitor",
    "clsColor": "pill-blue",
    "source": "FDA Prescribing Information",
    "sourceYear": "1991 (initial approval)",
    "indications": "Hypertension (adults and pediatric ≥6 years with GFR >30).",
    "dosage": "Adults: 10 mg once daily (5 mg if on diuretic); titrate to 40 mg daily. Renal impairment (GFR <30): start 5 mg daily.",
    "contraindications": "History of ACEI-associated angioedema, hereditary/idiopathic angioedema, concomitant aliskiren in diabetes.",
    "warnings": "Angioedema (discontinue if occurs). Hyperkalemia (monitor K⁺). Renal function monitoring. Hepatic toxicity (rare).",
    "interactions": "Diuretics: excessive hypotension. NSAIDs: ↓ antihypertensive effect, ↑ renal impairment risk. Lithium: toxicity. Potassium supplements: hyperkalemia.",
    "pregnancy": "Contraindicated in pregnancy (fetal toxicity).",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Benazepril",
    "linkLabel": "Find current product label on DailyMed"
  },
  {
    "id": "cilazapril-hctz",
    "name": "Cilazapril + Hydrochlorothiazide",
    "brand": "Vascace Plus (EU)",
    "cls": "ACE inhibitor + thiazide diuretic",
    "clsColor": "pill-red",
    "source": "EMA SmPC (Annex III)",
    "sourceYear": "Harmonised",
    "indications": "Hypertension (combination therapy).",
    "dosage": "One tablet (5 mg cilazapril + 12.5 mg HCTZ) once daily.",
    "contraindications": "Pregnancy (2nd/3rd trimester), severe renal impairment (CrCl <30 mL/min), anuria, history of ACEI angioedema, hypersensitivity to sulfonamides.",
    "warnings": "Severe hypotension at initiation (especially with volume depletion). Monitor renal function and potassium. Angioedema risk. Hepatic cirrhosis requires cautious titration.",
    "interactions": "Potassium-sparing diuretics: hyperkalemia. NSAIDs: ↓ antihypertensive effect. Lithium: toxicity. Gold: nitritoid reactions.",
    "pregnancy": "Contraindicated. Discontinue immediately if pregnancy detected.",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Cilazapril%20%2B%20Hydrochlorothiazide",
    "linkLabel": "Find current product label on DailyMed"
  },
  {
    "id": "metoprolol-tartrate",
    "name": "Metoprolol Tartrate",
    "brand": "Lopressor",
    "cls": "Beta-blocker (β₁-selective)",
    "clsColor": "pill-blue",
    "source": "FDA Prescribing Information",
    "sourceYear": "2025",
    "indications": "Myocardial infarction (hemodynamically stable patients) to reduce CV mortality.",
    "dosage": "Start 50 mg PO every 6 h; reduce to 25 mg if intolerant. Max maintenance: 100 mg twice daily.",
    "contraindications": "Severe bradycardia, 2nd/3rd degree heart block, cardiogenic shock, SBP <100 mmHg, decompensated HF, sick sinus syndrome (unless pacemaker).",
    "warnings": "Abrupt cessation may exacerbate angina/MI. May worsen HF during up-titration. Bronchospastic disease: use lowest dose. May mask hypoglycemia/thyrotoxicosis.",
    "interactions": "Catecholamine-depleting drugs: additive effect. CYP2D6 inhibitors: ↑ metoprolol levels. Digoxin/clonidine/diltiazem/verapamil: bradycardia risk.",
    "pregnancy": "Use with caution; may cause fetal bradycardia.",
    "url": "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Metoprolol%20Tartrate",
    "linkLabel": "Find current product label on DailyMed"
  }
];
