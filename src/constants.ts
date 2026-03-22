/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Evidence } from "./types";

export const INITIAL_EVIDENCE: Evidence[] = [
  { 
    id: "e_pm", 
    title: "Post-Mortem Request", 
    description: "Official request form for the autopsy of Aruna Bhanjara. Found dead on Feb 1st at Hebbal Lake. Needs to be sent to Columbia Asia Hebbal for processing. (Hint: The hospital's pincode is required for secure transmission. Check the local area code for Hebbal, Bangalore).", 
    location: "Columbia Asia", 
    type: "document", 
    unlocked: true,
    requiresPincode: "560024"
  },
  { 
    id: "e_alibi", 
    title: "Jatin's Initial Statement", 
    description: "He looks terrified, his hands stained with cobalt blue paint. 'I... I was just painting,' he stammers. 'I was working on the landscape for the gallery. I didn't even realize she hadn't come home. The hours... they just bleed into each other when I'm at the canvas. I thought she was just working an extra shift at the call center...'", 
    location: "RT Nagar Apartment", 
    type: "statement", 
    unlocked: true 
  },
  { 
    id: "e_lottery", 
    title: "Lottery Result Sheet", 
    description: "11th Jan Sunday results. Karnataka State Lottery. Ticket #88219: 1st Prize - 4.2 Crores.", 
    location: "Apartment", 
    type: "document", 
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cibil",
    title: "CIBIL Report",
    description: "Credit score: 420. Multiple defaults on personal loans and credit cards. Aruna was drowning in debt despite her hard work.",
    location: "Apartment Drawer",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_paints",
    title: "Paint Supplies",
    description: "A collection of high-end cobalt blue and titanium white paint tubes. All empty. Jatin's obsession was expensive.",
    location: "Studio Corner",
    type: "object",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_resignation",
    title: "Resignation Letter",
    description: "Official email printout. Aruna resigned from Manyata Call Center on Jan 6th, citing 'personal reasons'. This was 5 days BEFORE the lottery win.",
    location: "Laptop Bag",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cab_invoices",
    title: "Cab Invoices",
    description: "Invoices show she used to work 4 hours daily. Recently, this dropped to just 2 hours a day. She was pulling back.",
    location: "Glove Box",
    type: "document",
    unlocked: false,
    parentClueId: "e_house_search"
  },
  {
    id: "e_cab_log",
    title: "City-Cab Trip Record",
    description: "Date: Jan 5\nPickup: Whitefield Tech Park Gate 3\nDrop: Koramangala Dental Clinic\nDuration: 34 min\nDriver ID: 4471\nPassenger name: S. Nath\n\nPassenger rating: 4.1 — No notes.",
    location: "City-Cab Database",
    type: "digital",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_anish_profile",
    title: "Anish Ambedkar Profile",
    description: "Name: Anish Ambedkar\nTitle: Chairman, Amber Group of Companies\nEst. net worth: ₹480Cr (Forbes India, 2023)\n\nSEBI preliminary query filed 2019 — matter lapsed, no charges.",
    location: "Corporate Database",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_lottery_audit",
    title: "Lottery Audit Extract",
    description: "Ticket batch: #88214, #88217, #88219 — all prefix 8821\nPurchasing entity: Shree Vedanta Distributors\nGST: 29AADVS8821B1Z3\n\nFlagged: bulk purchase by non-retail entity. Under review.",
    location: "Lottery Board",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_shell_reg",
    title: "MCA Registration: Shree Vedanta",
    description: `MINISTRY OF CORPORATE AFFAIRS - CERTIFICATE OF INCORPORATION
---------------------------------------------------------
Company Name: SHREE VEDANTA DISTRIBUTORS PVT LTD
Registration Number: 088214
Date of Incorporation: 2023-05-12
Registered Office: 42/A, Industrial Suburb, Mangaluru, KA
Director(s): 
1. Gopal Krishna (Age: 71) - Nominee Director
2. [REDACTED] - Beneficial Owner
GSTIN: 29AADVS8821B1Z3
---------------------------------------------------------
Status: ACTIVE`,
    location: "MCA Database",
    type: "document",
    unlocked: false,
    phase: 2
  },
  {
    id: "e_amber_filing",
    title: "ROC Filing: Amber Group",
    description: `REGISTRAR OF COMPANIES - FORM PAS-3 (RETURN OF ALLOTMENT)
---------------------------------------------------------
Reporting Entity: AMBER GROUP HOLDINGS
Subject: Acquisition of SHREE VEDANTA DISTRIBUTORS
---------------------------------------------------------
Board Resolution Date: 2023-12-28
Acquisition Effective: 2024-02-12
Transaction Value: 4.20 Crores
Authorised Signatory: Anish Ambedkar (Chairman)
---------------------------------------------------------
Note: The board resolution was passed 14 days PRIOR to the lottery draw.`,
    location: "ROC Database",
    type: "document",
    unlocked: false,
    phase: 2
  }
];
