'use client';

import React, { useState, useMemo } from 'react';

// ============================================================================
// DATA: 18 COMBINATORIAL PERMUTATIONS + 2 GOVERNANCE DRIFT FAILURE MODES
// ============================================================================
const PROFILES = {
  // -------------------------------------------------------------
  // SLOT 1: E-COMMERCE LEADERSHIP (Hero H1)
  // -------------------------------------------------------------
  'p1': {
    id: 'p1',
    index: '1 of 18',
    name: 'Marvin Oey',
    initials: 'MO',
    headline: 'VP of Global E-commerce & Omnichannel Retail',
    company: 'Unilever • London, UK',
    searchQuery: '',
    surge: '95/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Global',
    keywords: 'Digital Shelf & Out-of-Stocks',
    stage: 'Customer Expansion (VIP)',
    persona: 'Ecommerce_VP',
    industry: 'PersonalCare',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    resolutionText: 'Hero H1 + Proof P1 + Action A1',
    bannerText: 'Governed Permutation #1 (Unilever VIP E-Commerce)',
    kicker: 'For CPG E-Commerce & Omnichannel Leaders',
    title: 'Benchmark Digital Shelf Share Across 40+ European Retailers',
    highlightTerm: '40+ European Retailers',
    subtext: 'Connect daily store-level availability directly to omnichannel revenue and share of search on Amazon, Tesco, and Carrefour.',
    copy1: 'Out-of-stocks and localized search drops across European e-commerce retailers cost global personal care brands up to 8% in unrecovered omnichannel revenue.',
    copy2: 'Discover how Unilever and leading FMCG enterprise leaders benchmark digital shelf share across 40+ European retail partners, link item-level store availability directly to market share, and maintain share of search.',
    hashtags: '#DigitalShelf #Ecommerce #PersonalCare #ConsumerIntelligence #NielsenIQ',
    ctaHead: 'The 2026 European Digital Shelf Benchmark for FMCG Leaders',
    ctaUrl: 'nielseniq.com/products/digital-shelf • 4 min read',
    stats: [
      { val: '100%', label: 'Store-Level Precision' },
      { val: '200B+', label: 'Daily Online Data Points' },
      { val: '1,000+', label: 'Monitored E-Retailers' }
    ],
    cue: 'Marvin sees an ad matching his exact personal care and e-commerce KPI. When he clicks "Learn more", Graph deterministically serves Personal Care proof and his dedicated Client Director (Sarah Jenkins).'
  },
  'p2': {
    id: 'p2',
    index: '2 of 18',
    name: 'Camille Laurent',
    initials: 'CL',
    headline: 'Head of European E-Retail & Digital Shelf Execution',
    company: "L'Oréal • Paris, France",
    searchQuery: 'Digital shelf share of search Amazon Carrefour',
    surge: '88/100 SURGE',
    surgeClass: 'high',
    account: "L'Oréal Group",
    keywords: 'Share of Search & E-Availability',
    stage: 'Consideration (Prospect)',
    persona: 'Ecommerce_VP',
    industry: 'PersonalCare',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    resolutionText: 'Hero H1 + Proof P1 + Action A2',
    bannerText: "Governed Permutation #2 (L'Oréal Prospect E-Commerce)",
    kicker: 'For Beauty & Personal Care E-Retail Leaders',
    title: 'Defend Share of Search Across 40+ European Retailers',
    highlightTerm: '40+ European Retailers',
    subtext: 'Track SKU availability and search placement across Boots, Sephora, and Amazon with item-level precision.',
    copy1: 'Digital shelf volatility in beauty and skin care drives shoppers to competing brands when hero SKUs drop to page 2.',
    copy2: "See how L'Oréal brand teams monitor digital shelf health across 40+ European retail partners with NIQ's automated audit.",
    hashtags: '#BeautyRetail #DigitalShelf #Ecommerce #NielsenIQ',
    ctaHead: 'The 2026 European Beauty Digital Shelf Benchmark (PDF)',
    ctaUrl: 'nielseniq.com/research/beauty-digital-shelf • 5 min read',
    stats: [
      { val: '-18%', label: 'Out-of-Stock Drop' },
      { val: '40+', label: 'European Retailers' },
      { val: '99.4%', label: 'UPC Catalog Match' }
    ],
    cue: 'As an in-market prospect, Camille receives the identical Personal Care proof block, but receives an instant asset download instead of VIP calendar access.'
  },
  'p3': {
    id: 'p3',
    index: '3 of 18',
    name: 'Aris Thorne',
    initials: 'AT',
    headline: 'VP of Global E-Commerce — Foods & Refreshment',
    company: 'Unilever • Rotterdam, Netherlands',
    searchQuery: 'Grocery out-of-stocks Albert Heijn Tesco Carrefour',
    surge: '94/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Foods',
    keywords: 'Grocery Digital Out-of-Stocks',
    stage: 'Customer Expansion (VIP)',
    persona: 'Ecommerce_VP',
    industry: 'PackagedFoods',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    resolutionText: 'Hero H1 + Proof P2 + Action A1',
    bannerText: 'Governed Permutation #3 (Unilever Foods VIP E-Commerce)',
    kicker: 'For Packaged Foods & Grocery E-Commerce Leaders',
    title: 'Eliminate Online Grocery Out-of-Stocks Across Tesco & Carrefour',
    highlightTerm: 'Tesco & Carrefour',
    subtext: 'Connect digital basket placement to true warehouse stock levels with UPC-level precision.',
    copy1: 'Online grocery replenishment blindspots cost packaged food brands up to 12% in missed cart conversions during key promotional windows.',
    copy2: 'Discover how Unilever Foods connects scanner checkout data to digital shelf availability across Albert Heijn, Tesco, and Carrefour.',
    hashtags: '#PackagedFoods #GroceryEcommerce #TradePromo #NielsenIQ',
    ctaHead: 'FMCG Omnichannel Availability Guide 2026',
    ctaUrl: 'nielseniq.com/products/grocery-shelf • 4 min read',
    stats: [
      { val: '+14%', label: 'Trade ROI Uplift' },
      { val: '100%', label: 'Store-Level Accuracy' },
      { val: '24/7', label: 'Restock Monitoring' }
    ],
    cue: 'Aris is an E-Commerce VP at Unilever, but in Foods. Notice how Graph automatically pairs the E-commerce Hero with Packaged Foods (+14% Trade ROI) proof instead of Personal Care.'
  },
  'p4': {
    id: 'p4',
    index: '4 of 18',
    name: 'Stefan Lindqvist',
    initials: 'SL',
    headline: 'VP Digital Retail & Omnichannel Commercial Ops',
    company: 'Nestlé • Vevey, Switzerland',
    searchQuery: 'CPG digital shelf scanner data integration',
    surge: '86/100 SURGE',
    surgeClass: 'high',
    account: 'Nestlé Global',
    keywords: 'Omnichannel Share & Online Availability',
    stage: 'Consideration (Prospect)',
    persona: 'Ecommerce_VP',
    industry: 'PackagedFoods',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H1 (Ecommerce)',
    proofId: 'P2 (Packaged Foods)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H1 + Proof P2 + Action A2',
    bannerText: 'Governed Permutation #4 (Nestlé Prospect E-Commerce)',
    kicker: 'For Food & Beverage Omnichannel Leaders',
    title: 'Connect Scanner Data to Digital Shelf Position',
    highlightTerm: 'Digital Shelf Position',
    subtext: 'Align online search ranking with offline retail scanner velocity across European hypermarkets.',
    copy1: 'When breakfast cereals or coffee drop out of stock online, shoppers permanently switch brands in 42% of cases.',
    copy2: 'Learn how global food manufacturers benchmark omnichannel trade performance across top European grocers.',
    hashtags: '#CPGEcommerce #FoodRetail #Omnichannel #NielsenIQ',
    ctaHead: 'The 2026 Packaged Grocery E-Commerce Benchmark',
    ctaUrl: 'nielseniq.com/reports/grocery-omnichannel • 6 min read',
    stats: [
      { val: '42%', label: 'Brand Switch Risk' },
      { val: '+14%', label: 'Promotional Uplift' },
      { val: '35+', label: 'Chains Covered' }
    ],
    cue: 'Stefan is a food prospect. Graph delivers Packaged Foods case evidence with a zero-friction asset download CTA.'
  },
  'p5': {
    id: 'p5',
    index: '5 of 18',
    name: 'Fiona Macpherson',
    initials: 'FM',
    headline: 'Global E-Commerce Director — Reserve & Luxury Spirits',
    company: 'Diageo • London, UK',
    searchQuery: 'Spirits e-commerce retail media out-of-stocks',
    surge: '92/100 SURGE',
    surgeClass: 'high',
    account: 'Diageo plc',
    keywords: 'Spirits E-Premise Availability & Share',
    stage: 'Customer Expansion (VIP)',
    persona: 'Ecommerce_VP',
    industry: 'BeverageAlcohol',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H1 (Ecommerce)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H1 + Proof P3 + Action A1',
    bannerText: 'Governed Permutation #5 (Diageo VIP E-Commerce)',
    kicker: 'For Beverage Alcohol E-Commerce Directors',
    title: 'Direct Retail Media Spend Exclusively to Stores in Stock',
    highlightTerm: 'Stores in Stock',
    subtext: 'Eliminate wasted digital ad spend by connecting spirits retail media directly to store-level bottle inventory.',
    copy1: 'Promoting premium whisky and spirits that are out of stock at the local delivery hub reduces retail media ROAS by over 30%.',
    copy2: 'See how enterprise beverage alcohol brands synchronize digital campaigns with verified store inventory.',
    hashtags: '#BeverageAlcohol #SpiritsEcommerce #RetailMedia #NielsenIQ',
    ctaHead: 'Executive Guide: Spirits Omnichannel Optimization',
    ctaUrl: 'nielseniq.com/spirits/omnichannel • 4 min read',
    stats: [
      { val: '22%', label: 'Retail Media ROAS' },
      { val: '100%', label: 'Inventory Sync' },
      { val: '18+', label: 'Spirits E-Retailers' }
    ],
    cue: 'Here is where the William Grant & Sons whisky case study belongs! Because Fiona manages Spirits e-commerce, the P3 proof is 100% brand-safe and highly relevant.'
  },
  'p6': {
    id: 'p6',
    index: '6 of 18',
    name: 'Matteo Rossi',
    initials: 'MR',
    headline: 'Head of Global E-Retail & Quick-Commerce Growth',
    company: 'Campari Group • Milan, Italy',
    searchQuery: 'Quick-commerce spirits delivery Gorillas Getir shelf',
    surge: '84/100 SURGE',
    surgeClass: 'high',
    account: 'Campari Group',
    keywords: 'Digital Shelf Share & Quick-Commerce',
    stage: 'Consideration (Prospect)',
    persona: 'Ecommerce_VP',
    industry: 'BeverageAlcohol',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H1 (Ecommerce)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H1 + Proof P3 + Action A2',
    bannerText: 'Governed Permutation #6 (Campari Prospect E-Commerce)',
    kicker: 'For Beverage Alcohol Growth Leaders',
    title: 'Win the Quick-Commerce & Spirits Digital Shelf',
    highlightTerm: 'Spirits Digital Shelf',
    subtext: 'Gain real-time visibility into fast-delivery platforms and online grocery liquor aisles across Europe.',
    copy1: 'Aperitifs and spirits require 100% availability during peak weekend order surges.',
    copy2: 'Discover how leading alcohol brands protect digital share and benchmark competitor visibility.',
    hashtags: '#QuickCommerce #SpiritsRetail #Ecommerce #NielsenIQ',
    ctaHead: '2026 Beverage Alcohol Digital Shelf Report',
    ctaUrl: 'nielseniq.com/alcohol/benchmark • 5 min read',
    stats: [
      { val: '22%', label: 'Media ROAS Lift' },
      { val: '15 min', label: 'Q-Commerce Audit' },
      { val: '30+', label: 'Delivery Hubs' }
    ],
    cue: 'Matteo receives the Spirits digital shelf evidence combined with a downloadable executive benchmark.'
  },

  // -------------------------------------------------------------
  // SLOT 2: CONSUMER INSIGHTS LEADERSHIP (Hero H2)
  // -------------------------------------------------------------
  'p7': {
    id: 'p7',
    index: '7 of 18',
    name: 'Elena Rostova',
    initials: 'ER',
    headline: 'Global Director of Consumer & Market Insights — Beauty',
    company: 'Unilever • London, UK',
    searchQuery: 'Household panel brand switching personal care',
    surge: '96/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Beauty',
    keywords: 'Household Panel & Brand Switching',
    stage: 'Customer Expansion (VIP)',
    persona: 'Insights_Director',
    industry: 'PersonalCare',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P1 (Personal Care)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H2 + Proof P1 + Action A1',
    bannerText: 'Governed Permutation #7 (Unilever Beauty VIP Insights)',
    kicker: 'For Consumer & Shopper Insights Directors',
    title: 'Predict Shopper Shifts with 100% Household Panel Precision',
    highlightTerm: '100% Household Panel Precision',
    subtext: 'Decode omnichannel buyer behavior, brand switching, and basket composition across retail channels.',
    copy1: 'Consumer loyalty in personal care is shifting faster than scanner data can report. Understand true shopper leakages.',
    copy2: 'See how Unilever Beauty leverages verified panel intelligence to anticipate category growth and brand migration.',
    hashtags: '#ConsumerInsights #ShopperBehavior #PersonalCare #NielsenIQ',
    ctaHead: 'Anticipate FMCG Shopper Shifts with Panel Precision',
    ctaUrl: 'nielseniq.com/insights/household-panel • 3 min read',
    stats: [
      { val: '100%', label: 'Panel Precision' },
      { val: '120K+', label: 'Verified Households' },
      { val: '99.8%', label: 'Demographic Match' }
    ],
    cue: 'Elena cares about panel precision, not e-commerce stockouts. Graph swaps the Hero block to H2 (Consumer Insights) while preserving her Personal Care vertical and VIP routing.'
  },
  'p8': {
    id: 'p8',
    index: '8 of 18',
    name: 'Chantal Dupont',
    initials: 'CD',
    headline: 'VP Global Consumer Intelligence & Predictive Analytics',
    company: 'The Estée Lauder Companies • Paris, France',
    searchQuery: 'Prestige beauty shopper basket penetration',
    surge: '89/100 SURGE',
    surgeClass: 'high',
    account: 'Estée Lauder',
    keywords: 'Omnichannel Shopper Basket Analytics',
    stage: 'Consideration (Prospect)',
    persona: 'Insights_Director',
    industry: 'PersonalCare',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P1 (Personal Care)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H2 + Proof P1 + Action A2',
    bannerText: 'Governed Permutation #8 (Estée Lauder Prospect Insights)',
    kicker: 'For Prestige Beauty Insights Leaders',
    title: 'Decode Luxury & Prestige Beauty Basket Migration',
    highlightTerm: 'Beauty Basket Migration',
    subtext: 'Map consumer trade-up and trade-down behaviors across departmental, e-commerce, and specialty retail.',
    copy1: 'Cross-channel shopper baskets reveal hidden substitution patterns between prestige and mass beauty.',
    copy2: 'Access comprehensive beauty shopper journey insights from NIQ’s representative household panels.',
    hashtags: '#PrestigeBeauty #ConsumerIntelligence #BasketAnalysis #NielsenIQ',
    ctaHead: 'The Global Beauty Shopper Behavior Benchmark',
    ctaUrl: 'nielseniq.com/beauty/panel-report • 4 min read',
    stats: [
      { val: '-18%', label: 'Category Friction' },
      { val: '4.8M', label: 'Analyzed Baskets' },
      { val: '14', label: 'European Markets' }
    ],
    cue: 'Chantal gets the Insights Hero, Personal Care proof, and an asset download.'
  },
  'p9': {
    id: 'p9',
    index: '9 of 18',
    name: 'Willem de Vries',
    initials: 'WV',
    headline: 'Director of Global Shopper Insights — Nutrition',
    company: 'Unilever • Rotterdam, Netherlands',
    searchQuery: 'Grocery basket composition brand switching scanner',
    surge: '93/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Nutrition',
    keywords: 'Scanner Data & Basket Composition',
    stage: 'Customer Expansion (VIP)',
    persona: 'Insights_Director',
    industry: 'PackagedFoods',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P2 (Packaged Foods)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H2 + Proof P2 + Action A1',
    bannerText: 'Governed Permutation #9 (Unilever Food VIP Insights)',
    kicker: 'For Food & Grocery Shopper Insights Leaders',
    title: 'Anticipate Category Growth with Verified Panel Intelligence',
    highlightTerm: 'Verified Panel Intelligence',
    subtext: 'Combine scanner checkout velocity with panel demographics to reveal why shoppers abandon food categories.',
    copy1: 'Inflationary pressure has transformed grocery shopping habits. Historical models no longer predict basket trade-offs.',
    copy2: 'Discover how Unilever Nutrition predicts emerging shopper trends using NIQ’s European grocery panel.',
    hashtags: '#ShopperInsights #PackagedFoods #GroceryTrends #NielsenIQ',
    ctaHead: 'Predictive Grocery Panel Intelligence 2026',
    ctaUrl: 'nielseniq.com/nutrition/insights • 4 min read',
    stats: [
      { val: '+14%', label: 'Promo Incrementality' },
      { val: '95K', label: 'Grocery Households' },
      { val: 'Daily', label: 'Panel Refresh' }
    ],
    cue: 'Willem sees Insights messaging grounded in Packaged Foods proof and VIP account handling.'
  },
  'p10': {
    id: 'p10',
    index: '10 of 18',
    name: 'Sophie Moreau',
    initials: 'SM',
    headline: 'Global Consumer Intelligence Lead — Dairy & Nutrition',
    company: 'Danone • Paris, France',
    searchQuery: 'Plant-based dairy shopper switching panel data',
    surge: '87/100 SURGE',
    surgeClass: 'high',
    account: 'Danone S.A.',
    keywords: 'Predictive Panel Intelligence',
    stage: 'Consideration (Prospect)',
    persona: 'Insights_Director',
    industry: 'PackagedFoods',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P2 (Packaged Foods)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H2 + Proof P2 + Action A2',
    bannerText: 'Governed Permutation #10 (Danone Prospect Insights)',
    kicker: 'For Dairy & Plant-Based Insights Leaders',
    title: 'Understand Consumer Shifts in Plant-Based Grocery',
    highlightTerm: 'Plant-Based Grocery',
    subtext: 'Isolate repeat purchase behavior and trial velocity across dairy and alternative protein categories.',
    copy1: 'Trial rates mean nothing without repeat purchase velocity. Measure long-term category penetration accurately.',
    copy2: 'Download NIQ’s European dairy and nutrition consumer migration study.',
    hashtags: '#PlantBased #DairyInsights #ConsumerPanel #NielsenIQ',
    ctaHead: 'European Nutrition Shopper Migration Report',
    ctaUrl: 'nielseniq.com/dairy/shopper-study • 5 min read',
    stats: [
      { val: '72%', label: 'Repeat Cohort Tracking' },
      { val: '+14%', label: 'Brand Conversion' },
      { val: '8 EU', label: 'Core Markets' }
    ],
    cue: 'Sophie is served the H2 Insights Hero with Packaged Foods evidence and an asset CTA.'
  },
  'p11': {
    id: 'p11',
    index: '11 of 18',
    name: 'Jean-Luc Perret',
    initials: 'JP',
    headline: 'Director of Global Insights & Omnichannel Intelligence',
    company: 'Moët Hennessy • Paris, France',
    searchQuery: 'Champagne and cognac consumer demographics panel',
    surge: '91/100 SURGE',
    surgeClass: 'high',
    account: 'Moët Hennessy',
    keywords: 'Premium Spirits Shopper Demographics',
    stage: 'Customer Expansion (VIP)',
    persona: 'Insights_Director',
    industry: 'BeverageAlcohol',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H2 + Proof P3 + Action A1',
    bannerText: 'Governed Permutation #11 (Moët Hennessy VIP Insights)',
    kicker: 'For Luxury Spirits & Wine Insights Directors',
    title: 'Decode Luxury Wine & Spirits Consumer Demographics',
    highlightTerm: 'Consumer Demographics',
    subtext: 'Understand on-premise consumption crossover into retail purchasing among high-net-worth consumers.',
    copy1: 'Luxury spirits purchase occasions are shifting between dining venues and premium home delivery.',
    copy2: 'Learn how Moët Hennessy and top luxury houses monitor brand prestige and consumer switching.',
    hashtags: '#LuxurySpirits #WineAndSpirits #ConsumerIntelligence #NielsenIQ',
    ctaHead: 'The Luxury Beverage Alcohol Consumer Study',
    ctaUrl: 'nielseniq.com/luxury/spirits-panel • 4 min read',
    stats: [
      { val: '22%', label: 'Campaign ROAS Lift' },
      { val: '88%', label: 'High-Net-Worth Reach' },
      { val: '500+', label: 'Luxury Venues' }
    ],
    cue: 'Jean-Luc receives the Insights Hero with William Grant & Sons spirits proof and dedicated account director access.'
  },
  'p12': {
    id: 'p12',
    index: '12 of 18',
    name: 'Rebecca Vance',
    initials: 'RV',
    headline: 'VP Global Market & Shopper Insights',
    company: 'Brown-Forman • Amsterdam, Netherlands',
    searchQuery: 'Spirits off-premise scanner panel crossover',
    surge: '85/100 SURGE',
    surgeClass: 'high',
    account: 'Brown-Forman',
    keywords: 'Brand Switching & Bar/Retail Crossover',
    stage: 'Consideration (Prospect)',
    persona: 'Insights_Director',
    industry: 'BeverageAlcohol',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H2 (Insights)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H2 + Proof P3 + Action A2',
    bannerText: 'Governed Permutation #12 (Brown-Forman Prospect Insights)',
    kicker: 'For Spirits Shopper Insights Teams',
    title: 'Bridge On-Premise Bar Data with Retail Scanner Velocity',
    highlightTerm: 'Retail Scanner Velocity',
    subtext: 'Unify bar/restaurant trend adoption with retail shelf purchasing across European metropolitan markets.',
    copy1: 'Spirits cocktails trending in London or Berlin reach supermarket shelves within 90 days. Are you prepared?',
    copy2: 'Download the comprehensive beverage alcohol consumer panel benchmark.',
    hashtags: '#SpiritsInsights #BarTrends #ShopperPanel #NielsenIQ',
    ctaHead: 'The 2026 Global Spirits Consumption Report',
    ctaUrl: 'nielseniq.com/spirits/annual-panel • 6 min read',
    stats: [
      { val: '22%', label: 'ROAS Improvement' },
      { val: '90 Days', label: 'Trend-to-Shelf Window' },
      { val: '2,500', label: 'Monitored Bars' }
    ],
    cue: 'Rebecca explores consumer insights tailored to beverage alcohol with an asset download path.'
  },

  // -------------------------------------------------------------
  // SLOT 3: COMMERCIAL & CATEGORY LEADERSHIP (Hero H3)
  // -------------------------------------------------------------
  'p13': {
    id: 'p13',
    index: '13 of 18',
    name: 'Marcus Vance',
    initials: 'MV',
    headline: 'Category Strategy & Revenue Growth Director — Personal Care',
    company: 'Unilever • London, UK',
    searchQuery: 'MAP compliance European retailers digital price elasticity',
    surge: '93/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Personal Care',
    keywords: 'Price Elasticity & MAP Enforcement',
    stage: 'Customer Expansion (VIP)',
    persona: 'Category_Commercial',
    industry: 'PersonalCare',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P1 (Personal Care)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H3 + Proof P1 + Action A1',
    bannerText: 'Governed Permutation #13 (Unilever PC VIP Commercial)',
    kicker: 'For Commercial & Category Strategy Leaders',
    title: 'Protect Retail Margins: Optimize Price & Promotion Strategy',
    highlightTerm: 'Price & Promotion Strategy',
    subtext: 'Quantify promotional effectiveness, map price elasticity, and stop margin-diluting MAP violations.',
    copy1: 'Unauthorized digital discounters diluting your minimum advertised price damage retail partner trust and profit margins.',
    copy2: 'Discover how Unilever Personal Care uses automated daily price scraping and elasticity models across European marketplaces.',
    hashtags: '#PriceElasticity #CategoryManagement #MAPCompliance #NielsenIQ',
    ctaHead: 'European Omnichannel Margin Protection Guide',
    ctaUrl: 'nielseniq.com/commercial/price-optimization • 4 min read',
    stats: [
      { val: '-18%', label: 'Margin Leakage' },
      { val: '100%', label: 'Daily MAP Scrapes' },
      { val: '30+', label: 'Digital Marketplaces' }
    ],
    cue: 'Marcus Vance is focused on trade promotion and price elasticity. Graph serves H3 (Category Leadership) with Personal Care metrics and VIP scheduling.'
  },
  'p14': {
    id: 'p14',
    index: '14 of 18',
    name: 'David Miller',
    initials: 'DM',
    headline: 'Commercial Strategy & Omnichannel Pricing Director',
    company: 'Colgate-Palmolive • Geneva, Switzerland',
    searchQuery: 'Trade spend optimization oral care grocery retail',
    surge: '87/100 SURGE',
    surgeClass: 'high',
    account: 'Colgate-Palmolive',
    keywords: 'Personal Care Trade Spend Optimization',
    stage: 'Consideration (Prospect)',
    persona: 'Category_Commercial',
    industry: 'PersonalCare',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P1 (Personal Care)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H3 + Proof P1 + Action A2',
    bannerText: 'Governed Permutation #14 (Colgate Prospect Commercial)',
    kicker: 'For Oral Care & Personal Care Category Directors',
    title: 'Quantify True Promotion ROI Across Pharmacy & Grocers',
    highlightTerm: 'Pharmacy & Grocers',
    subtext: 'Eliminate wasted trade allowance spend by measuring baseline incrementality versus forward-buying.',
    copy1: 'Over 55% of trade promotions in personal care fail to generate incremental category revenue.',
    copy2: 'Benchmark your commercial promotion strategy against European competitors.',
    hashtags: '#TradeSpend #CommercialStrategy #PersonalCare #NielsenIQ',
    ctaHead: 'The 2026 Personal Care Trade Promotion Benchmark',
    ctaUrl: 'nielseniq.com/promotions/personal-care • 5 min read',
    stats: [
      { val: '55%', label: 'Failed Promos Avoided' },
      { val: '-18%', label: 'Out-of-Stock Reduction' },
      { val: '40+', label: 'Monitored Grocers' }
    ],
    cue: 'David Miller receives commercial and pricing messaging with Personal Care proof and a benchmark download.'
  },
  'p15': {
    id: 'p15',
    index: '15 of 18',
    name: 'Hendrik Jan',
    initials: 'HJ',
    headline: 'Global Trade Promotion & Price Elasticity Director',
    company: 'Unilever • Rotterdam, Netherlands',
    searchQuery: 'FMCG trade promo spend optimization Albert Heijn Tesco',
    surge: '95/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Foods',
    keywords: 'FMCG Trade Spend & Margin Protection',
    stage: 'Customer Expansion (VIP)',
    persona: 'Category_Commercial',
    industry: 'PackagedFoods',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P2 (Packaged Foods)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H3 + Proof P2 + Action A1',
    bannerText: 'Governed Permutation #15 (Unilever Food VIP Commercial)',
    kicker: 'For Food & Beverage Revenue Management Leaders',
    title: 'Eliminate Wasted Trade Spend in European Grocery',
    highlightTerm: 'European Grocery',
    subtext: 'Connect store scanner velocity to promotion mechanics to identify subsidized sales and margin leakage.',
    copy1: 'Grocery trade promotions are the second largest expense on the P&L. Measuring incrementality in real time is essential.',
    copy2: 'See how Unilever Foods achieved +14% promotional ROI uplift across Tesco, Carrefour, and Albert Heijn.',
    hashtags: '#TradePromo #RevenueGrowthManagement #PackagedFoods #NielsenIQ',
    ctaHead: 'Grocery Trade Promotion ROI Playbook 2026',
    ctaUrl: 'nielseniq.com/food/trade-roi • 4 min read',
    stats: [
      { val: '+14%', label: 'Trade ROI Uplift' },
      { val: '€18M', label: 'Subsidized Spend Saved' },
      { val: '100%', label: 'Scanner Harmonization' }
    ],
    cue: 'Hendrik Jan sees Category Strategy paired with the +14% Trade ROI grocery case study.'
  },
  'p16': {
    id: 'p16',
    index: '16 of 18',
    name: 'Rachel Evans',
    initials: 'RE',
    headline: 'Director of Category Management & Trade Investment',
    company: 'General Mills • Nyon, Switzerland',
    searchQuery: 'Price elasticity cereal packaged foods European retail',
    surge: '88/100 SURGE',
    surgeClass: 'high',
    account: 'General Mills',
    keywords: 'Trade Promo ROI & Retail Elasticity',
    stage: 'Consideration (Prospect)',
    persona: 'Category_Commercial',
    industry: 'PackagedFoods',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P2 (Packaged Foods)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H3 + Proof P2 + Action A2',
    bannerText: 'Governed Permutation #16 (General Mills Prospect Commercial)',
    kicker: 'For Packaged Goods Category Managers',
    title: 'Master Price Elasticity Across European Supermarkets',
    highlightTerm: 'European Supermarkets',
    subtext: 'Test price threshold sensitivity before negotiating annual joint business plans with retailers.',
    copy1: 'Retailer margin pressure requires data-backed price elasticity models during annual category reviews.',
    copy2: 'Download NIQ’s packaged foods price sensitivity and promotion elasticity benchmark.',
    hashtags: '#CategoryManagement #PriceElasticity #FMCG #NielsenIQ',
    ctaHead: 'The 2026 Food & Beverage Price Elasticity Benchmark',
    ctaUrl: 'nielseniq.com/reports/food-elasticity • 5 min read',
    stats: [
      { val: '+14%', label: 'Promo Optimization' },
      { val: '0.15', label: 'Elasticity Precision' },
      { val: '24', label: 'Chains Tested' }
    ],
    cue: 'Rachel reviews category and price elasticity messaging with a free asset download.'
  },
  'p17': {
    id: 'p17',
    index: '17 of 18',
    name: 'Callum Stewart',
    initials: 'CS',
    headline: 'Global Commercial & Revenue Management Director',
    company: 'William Grant & Sons • Edinburgh, Scotland',
    searchQuery: 'Whisky retail media margin optimization off-premise',
    surge: '94/100 SURGE',
    surgeClass: 'high',
    account: 'William Grant & Sons',
    keywords: 'Retail Media Spend & Margin Protection',
    stage: 'Customer Expansion (VIP)',
    persona: 'Category_Commercial',
    industry: 'BeverageAlcohol',
    tier: 'StrategicCustomer',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H3 + Proof P3 + Action A1',
    bannerText: 'Governed Permutation #17 (William Grant & Sons VIP Commercial)',
    kicker: 'For Spirits Commercial Directors',
    title: 'Maximize Spirit Category Margins & Retail Media ROAS',
    highlightTerm: 'Retail Media ROAS',
    subtext: 'Align luxury brand distribution with targeted e-retail media promotions that drive profitable trade sell-through.',
    copy1: 'Distributing high-margin single malt scotch requires strict adherence to brand pricing and store-level fulfillment.',
    copy2: 'See how William Grant & Sons boosted retail media ROAS by 22% using NIQ’s connected distribution and shelf data.',
    hashtags: '#ScotchWhisky #RevenueManagement #RetailMediaROAS #NielsenIQ',
    ctaHead: 'Spirits Commercial Strategy & Retail Media Playbook',
    ctaUrl: 'nielseniq.com/spirits/commercial-growth • 4 min read',
    stats: [
      { val: '22%', label: 'Retail Media ROAS' },
      { val: '100%', label: 'Store Fulfillment' },
      { val: '45+', label: 'Luxury SKUs' }
    ],
    cue: 'The authentic William Grant & Sons customer context! Graph serves the Category Hero, their own case study, and VIP account leadership.'
  },
  'p18': {
    id: 'p18',
    index: '18 of 18',
    name: 'Hamish Campbell',
    initials: 'HC',
    headline: 'VP Commercial Strategy & Channel Pricing',
    company: 'Treasury Wine Estates • London, UK',
    searchQuery: 'Wine retail pricing promo cannibalization Europe',
    surge: '86/100 SURGE',
    surgeClass: 'high',
    account: 'Treasury Wine Estates',
    keywords: 'Channel Pricing & Elasticity',
    stage: 'Consideration (Prospect)',
    persona: 'Category_Commercial',
    industry: 'BeverageAlcohol',
    tier: 'ConsiderationProspect',
    label: 'governed',
    isGoverned: true,
    heroId: 'H3 (Category)',
    proofId: 'P3 (William Grant & Sons)',
    actionId: 'A2 (Asset Download)',
    resolutionText: 'Hero H3 + Proof P3 + Action A2',
    bannerText: 'Governed Permutation #18 (Treasury Wine Prospect Commercial)',
    kicker: 'For Wine & Spirits Commercial Strategists',
    title: 'Prevent Margin Dilution Across Online & Offline Retail',
    highlightTerm: 'Online & Offline Retail',
    subtext: 'Map price cliffs and cross-vintage promotional cannibalization across specialist and grocery retail.',
    copy1: 'Promotional depth in premium wine often erodes brand equity without expanding total category volume.',
    copy2: 'Access NIQ’s European wine and spirits pricing and promotional mechanics guide.',
    hashtags: '#WineIndustry #CommercialStrategy #PriceOptimization #NielsenIQ',
    ctaHead: 'The European Wine & Spirits Commercial Pricing Guide',
    ctaUrl: 'nielseniq.com/wine/pricing-study • 5 min read',
    stats: [
      { val: '22%', label: 'Media ROAS Lift' },
      { val: '-8%', label: 'Promo Cannibalization' },
      { val: '120+', label: 'Retail Chains' }
    ],
    cue: 'Hamish represents the 18th permutation: Category Lead + Spirits Vertical + Consideration Prospect.'
  },

  // -------------------------------------------------------------
  // GOVERNANCE DRIFT FAILURE MODES (FOR DEMO REVEAL)
  // -------------------------------------------------------------
  'drift-blunder': {
    id: 'drift-blunder',
    index: 'DRIFT #1',
    name: 'Marvin Oey',
    initials: 'MO',
    headline: 'VP of Global E-commerce & Omnichannel Retail',
    company: 'Unilever • London, UK',
    searchQuery: 'Baby care body wash digital shelf out-of-stock',
    surge: '95/100 SURGE',
    surgeClass: 'high',
    account: 'Unilever Personal Care (Dove)',
    keywords: 'Dove Body Wash Out-of-Stocks',
    stage: 'Customer Expansion (VIP)',
    persona: 'Ecommerce_VP',
    industry: 'BeverageAlcohol',
    tier: 'StrategicCustomer',
    label: 'blunder',
    isGoverned: false,
    heroId: 'H1 (Ecommerce)',
    proofId: '⚠️ P3 (Scottish Whisky)',
    actionId: 'A1 (Sarah Jenkins VIP)',
    resolutionText: 'Hero H1 (Personal Care E-com) + ⚠️ Proof P3 (Whisky!) + Action A1',
    bannerText: '⚠️ FAILURE MODE 1: Category Blunder (Whisky served to Unilever)',
    kicker: '⚠️ Vertical Drift Triggered (Unconstrained Template)',
    title: 'Benchmark Digital Shelf Share Across 40+ European Retailers',
    highlightTerm: '40+ European Retailers',
    subtext: 'Connect daily store-level availability directly to omnichannel revenue and share of search.',
    copy1: 'Marvin manages Dove body wash and baby care for Unilever. But in an ungoverned CMS with dynamic page assembly, look what happens:',
    copy2: 'The page mistakenly pulls Proof P3: William Grant & Sons Scottish Whisky! Marvin is told how Glenfiddich boosted bar and off-premise sales—eroding brand trust and showing total irrelevance.',
    hashtags: '#GovernanceDrift #CategoryBlunder #FrankenPage #BrandSafety',
    ctaHead: 'The 2026 European Digital Shelf Benchmark for FMCG Leaders',
    ctaUrl: 'nielseniq.com/products/digital-shelf • 4 min read',
    stats: [
      { val: '22%', label: 'Spirits ROAS (IRRELEVANT)' },
      { val: 'Scotch', label: 'Whisky Testimonial' },
      { val: '0%', label: 'Personal Care Alignment' }
    ],
    cue: '💥 ACT 2 REVEAL: This is what an unconstrained dynamic engine (or NIQ’s current static site) does! It forces Scottish Whisky onto a Unilever Baby & Personal Care executive. Now show how Optimizely Graph prevents this.'
  },
  'drift-leak': {
    id: 'drift-leak',
    index: 'DRIFT #2',
    name: 'Unknown Prospect',
    initials: '??',
    headline: 'Self-Employed • Unverified Domain',
    company: 'Cold Traffic • London, UK',
    searchQuery: 'free market research templates',
    surge: '12/100 COLD',
    surgeClass: 'low',
    account: 'Unresolved IP',
    keywords: 'None on record',
    stage: 'Unqualified Traffic',
    persona: 'Ecommerce_VP',
    industry: 'PersonalCare',
    tier: 'StrategicCustomer',
    label: 'leak',
    isGoverned: false,
    heroId: 'H1 (Ecommerce)',
    proofId: 'P1 (Personal Care)',
    actionId: '⚠️ A1 (Sarah Jenkins VIP LEAKED!)',
    resolutionText: 'Hero H1 + Proof P1 + ⚠️ Action A1 (Sarah Jenkins VIP Leaked!)',
    bannerText: '⚠️ FAILURE MODE 2: VIP Entitlement Leak (Sarah Jenkins Leaked)',
    kicker: '⚠️ Entitlement Drift Triggered (Unprotected Calendar)',
    title: 'Benchmark Digital Shelf Share Across 40+ European Retailers',
    highlightTerm: '40+ European Retailers',
    subtext: 'Connect daily store-level availability directly to omnichannel revenue.',
    copy1: 'An unverified anonymous visitor clicks an ad. Without entitlement guardrails, the system serves Action Block A1.',
    copy2: 'Result: Senior Director Sarah Jenkins has her private calendar link leaked to unqualified cold leads instead of 8-figure enterprise accounts.',
    hashtags: '#EntitlementLeak #SalesFriction #Governance #OptimizelyGraph',
    ctaHead: 'Direct Booking with Global Director Sarah Jenkins',
    ctaUrl: 'calendly.com/niq-unilever-team/15min • Fast-Path',
    stats: [
      { val: '100%', label: 'Store-Level Precision' },
      { val: '200B+', label: 'Daily Online Data Points' },
      { val: '⚠️ LEAK', label: 'VIP Calendar Compromised' }
    ],
    cue: '💥 ACT 2 REVEAL: In an ungoverned system, VIP fast-paths leak to cold traffic. With Optimizely Graph, Tier: StrategicCustomer is strictly gated to verified 6sense domains.'
  }
};

export default function NIQSimulatorApp() {
  const [activeProfileId, setActiveProfileId] = useState('p3');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(348);
  const [showVisitorPermutation, setShowVisitorPermutation] = useState(false);
  const [showSixSenseMatch, setShowSixSenseMatch] = useState(false);
  const [showChallengerCue, setShowChallengerCue] = useState(false);
  const [presenterBarOpen, setPresenterBarOpen] = useState(false);

  const profile = useMemo(() => PROFILES[activeProfileId] || PROFILES['p1'], [activeProfileId]);

  const handleProfileChange = (newId) => {
    setActiveProfileId(newId);
    setLiked(false);
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const targetUrl = useMemo(() => {
    const params = new URLSearchParams({
      persona: profile.persona,
      industry: profile.industry,
      tier: profile.tier,
      label: profile.label
    });
    return `/demo/limitless?${params.toString()}`;
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-[#191919] font-sans antialiased flex flex-col items-center">

      {/* TOP PRESENTER TRAY */}
      <div className="relative z-50 w-full h-0">
        <button
          onClick={() => setPresenterBarOpen((prev) => !prev)}
          aria-expanded={presenterBarOpen}
          aria-label="Toggle presenter tools"
          className="absolute right-2 top-0 z-60 bg-slate-800/50 hover:bg-slate-700 text-slate-500 hover:text-slate-300 text-[8px] leading-none px-1.5 py-0.5 rounded-b border border-t-0 border-slate-700 shadow-sm transition-colors"
        >
          {presenterBarOpen ? '▲' : '▼'}
        </button>
      </div>

      <div className="relative z-50 w-full">
        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${presenterBarOpen ? 'max-h-24' : 'max-h-0'}`}>
          <header className="w-full bg-[#0f172a] text-slate-100 border-b border-slate-700 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
                Demo Tool
              </span>
              <span className="font-semibold text-slate-200">NIQ Limitless Page Inventory Simulator</span>
              <span className="text-slate-500">|</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${profile.isGoverned ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                <span className="font-medium text-slate-300">{profile.bannerText}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Combinatorial Scale: <strong className="text-slate-200">18 Experiences</strong> (3 Heroes × 3 Proofs × 2 Actions)</span>
              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3">
                <button
                  onClick={() => setShowVisitorPermutation((prev) => !prev)}
                  aria-pressed={showVisitorPermutation}
                  className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${showVisitorPermutation ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                >
                  Visitor Permutation
                </button>
                <button
                  onClick={() => setShowSixSenseMatch((prev) => !prev)}
                  aria-pressed={showSixSenseMatch}
                  className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${showSixSenseMatch ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                >
                  ABM Match
                </button>
                <button
                  onClick={() => setShowChallengerCue((prev) => !prev)}
                  aria-pressed={showChallengerCue}
                  className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${showChallengerCue ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                >
                  What&apos;s Happening
                </button>
              </div>
              <button
                onClick={() => handleProfileChange('p1')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-600 transition-colors"
              >
                Reset Marvin #1
              </button>
              <button
                onClick={() => setPresenterBarOpen(false)}
                aria-label="Close presenter tools"
                className="text-slate-500 hover:text-slate-200 text-sm leading-none px-1 transition-colors"
              >
                ✕
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* LINKEDIN TOP NAV */}
      <nav className="w-full bg-white border-b border-[#e0dfdc] sticky top-0 z-40 flex justify-center px-4 h-[53px]">
        <div className="w-full max-w-[1160px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] bg-[#0a66c2] rounded flex items-center justify-center text-white font-extrabold text-lg select-none">
              in
            </div>
            <div className="flex items-center bg-[#edf3f8] rounded px-3 py-1.5 gap-2 w-[240px] md:w-[280px]">
              <span className="text-slate-500 text-sm">🔍</span>
              <input
                type="text"
                value={profile.searchQuery}
                readOnly
                aria-label="LinkedIn Search Query"
                className="bg-transparent border-none outline-none text-xs text-slate-800 w-full truncate font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 text-slate-500">
            <div className="flex flex-col items-center text-[11px] text-slate-900 border-b-2 border-slate-900 pb-1 cursor-pointer">
              <span className="text-base">🏠</span>
              <span className="hidden sm:inline">Home</span>
            </div>
            <div className="flex flex-col items-center text-[11px] hover:text-slate-900 cursor-pointer">
              <span className="text-base">👥</span>
              <span className="hidden sm:inline">My Network</span>
            </div>
            <div className="flex flex-col items-center text-[11px] hover:text-slate-900 cursor-pointer">
              <span className="text-base">💼</span>
              <span className="hidden sm:inline">Jobs</span>
            </div>
            <div className="flex flex-col items-center text-[11px] hover:text-slate-900 cursor-pointer">
              <span className="text-base">💬</span>
              <span className="hidden sm:inline">Messaging</span>
            </div>
            <div className="flex flex-col items-center text-[11px] hover:text-slate-900 cursor-pointer">
              <span className="text-base">🔔</span>
              <span className="hidden sm:inline">Notifications</span>
            </div>
            <div className="flex flex-col items-center text-[11px] cursor-pointer pl-1">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px]">
                {profile.initials}
              </div>
              <span className="hidden sm:inline">Me ▾</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 3-COLUMN PAGE CONTAINER */}
      <div className="w-full max-w-[1160px] p-4 pb-16 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[260px_570px_290px] gap-4 items-start">

        {/* LEFT COLUMN: CONTROLS & VISITOR IDENTITY */}
        <aside className="flex flex-col gap-3">

          {/* SIMULATOR CONTROLS */}
          {showVisitorPermutation && (
            <div className="bg-white border border-[#e0dfdc] rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Visitor Permutation
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                  {profile.index}
                </span>
              </div>

              <select
                value={activeProfileId}
                onChange={(e) => handleProfileChange(e.target.value)}
                size={6}
                className="w-full p-1 text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] cursor-pointer [&_option]:px-2 [&_option]:py-1.5 [&_optgroup]:py-1"
              >
                <optgroup label="Slot 1: E-Commerce Leadership (H1)">
                  <option value="p1">#1: Unilever PC (Marvin Oey) — VIP</option>
                  <option value="p2">#2: L'Oréal (Camille Laurent) — Asset</option>
                  <option value="p3">#3: Unilever Foods (Aris Thorne) — VIP</option>
                  <option value="p4">#4: Nestlé (Stefan Lindqvist) — Asset</option>
                  <option value="p5">#5: Diageo (Fiona Macpherson) — VIP</option>
                  <option value="p6">#6: Campari (Matteo Rossi) — Asset</option>
                </optgroup>
                <optgroup label="Slot 2: Consumer Insights (H2)">
                  <option value="p7">#7: Unilever Beauty (Elena Rostova) — VIP</option>
                  <option value="p8">#8: Estée Lauder (Chantal Dupont) — Asset</option>
                  <option value="p9">#9: Unilever Food (Willem de Vries) — VIP</option>
                  <option value="p10">#10: Danone (Sophie Moreau) — Asset</option>
                  <option value="p11">#11: Moët Hennessy (Jean-Luc Perret) — VIP</option>
                  <option value="p12">#12: Brown-Forman (Rebecca Vance) — Asset</option>
                </optgroup>
                <optgroup label="Slot 3: Category &amp; Commercial (H3)">
                  <option value="p13">#13: Unilever PC (Marcus Vance) — VIP</option>
                  <option value="p14">#14: Colgate (David Miller) — Asset</option>
                  <option value="p15">#15: Unilever Food (Hendrik Jan) — VIP</option>
                  <option value="p16">#16: General Mills (Rachel Evans) — Asset</option>
                  <option value="p17">#17: William Grant &amp; Sons (Callum Stewart) — VIP</option>
                  <option value="p18">#18: Treasury Wine (Hamish Campbell) — Asset</option>
                </optgroup>
                <optgroup label="⚠️ Intentional Governance Drift Demos">
                  <option value="drift-blunder">✘ Failure Mode 1: Category Blunder (Whisky to Unilever)</option>
                  <option value="drift-leak">✘ Failure Mode 2: VIP Entitlement Leak (Sarah Jenkins to Cold)</option>
                </optgroup>
              </select>
            </div>
          )}

          {/* VISITOR PROFILE CARD */}
          <div className="bg-white border border-[#e0dfdc] rounded-xl overflow-hidden shadow-sm text-center">
            <div className="h-16 w-full bg-gradient-to-r from-[#060A45] via-[#0B1340] to-[#2D6DF6] relative" />
            <div className="-mt-9 flex justify-center relative z-10">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center shadow">
                {profile.initials}
              </div>
            </div>
            <div className="p-3 border-b border-[#e0dfdc]">
              <h3 className="font-bold text-sm text-slate-900">{profile.name}</h3>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">{profile.headline}</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                {profile.company}
              </span>
            </div>
            <div className="p-3 text-left text-xs flex flex-col gap-1.5 text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>Profile viewers</span>
                <span className="text-[#0a66c2] font-semibold">412</span>
              </div>
              <div className="flex justify-between">
                <span>Post impressions</span>
                <span className="text-[#0a66c2] font-semibold">2,840</span>
              </div>
            </div>
          </div>

          {/* 6SENSE SIGNAL MATCH CARD */}
          {showSixSenseMatch && (
            <div className="bg-[#090e17] text-slate-100 border border-slate-800 rounded-xl p-3.5 shadow-md text-xs leading-relaxed">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-[#00D2FF] flex items-center gap-1.5">
                  ⚡ ABM Match
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${profile.surgeClass === 'high' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-red-950/80 border-red-500 text-red-400'}`}>
                  {profile.surge}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Target Account</span>
                  <span className="font-semibold text-slate-200">{profile.account}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Verified Keyword Surge</span>
                  <span className="font-semibold text-sky-400">{profile.keywords}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Buying Stage</span>
                  <span className="font-bold text-slate-100">{profile.stage}</span>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* CENTER FEED COLUMN */}
        <main className="flex flex-col gap-3">

          {/* START A POST */}
          <div className="bg-white border border-[#e0dfdc] rounded-xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
              {profile.initials}
            </div>
            <div className="bg-transparent border border-slate-300 rounded-full py-2 px-4 text-xs font-medium text-slate-500 flex-grow cursor-pointer hover:bg-slate-50 transition-colors">
              Start a post, {profile.name.split(' ')[0]}...
            </div>
          </div>

          {/* SPONSORED NIQ ABM AD CARD */}
          <article className="bg-white border border-[#e0dfdc] rounded-xl overflow-hidden shadow-sm">

            {/* AD HEADER */}
            <div className="p-3.5 pb-2 flex items-start justify-between">
              <div className="flex gap-3">
                {/* NIQ Monogram SVG */}
                <div className="w-12 h-12 rounded-lg bg-white border border-[#1E2E6E] shadow flex items-center justify-center flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/niq-logo.svg" alt="NielsenIQ" className="w-[34px] h-[34px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 leading-snug">
                    NielsenIQ
                    <svg className="w-3.5 h-3.5 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-slate-500">The world's leading consumer intelligence company • 1.4M followers</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">Promoted • 🌐</span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-slate-800 text-lg px-1">•••</button>
            </div>

            {/* AD COPY */}
            <div className="px-4 py-2 text-[13px] leading-relaxed text-slate-800 space-y-2">
              <p>{profile.copy1}</p>
              <p>{profile.copy2}</p>
              <div className="text-[#0a66c2] font-semibold text-xs pt-0.5">
                {profile.hashtags}
              </div>
            </div>

            {/* NIQ CREATIVE BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#060A45] via-[#0B1340] to-[#04072B] border-y border-[#1E2E6E] p-6 text-white flex flex-col gap-4">
              {/* Background Glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-radial-gradient from-blue-600/30 via-cyan-400/10 to-transparent rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2D6DF6] via-[#00D2FF] to-transparent" />

              {/* Top Banner Lockup */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/niq-logo.svg" alt="NielsenIQ" className="h-6 w-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 border-l border-slate-600 pl-2">
                    Consumer Intelligence
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-blue-600/20 text-[#70A5FF] border border-blue-500/40 px-2.5 py-1 rounded-full">
                  Executive Benchmark 2026
                </span>
              </div>

              {/* Creative Core Message */}
              <div className="relative z-10 space-y-2">
                <span className="text-[#00D2FF] text-[11px] font-extrabold uppercase tracking-wider">
                  {profile.kicker}
                </span>
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white max-w-[500px]">
                  {profile.title.split(profile.highlightTerm)[0]}
                  <span className="bg-gradient-to-r from-[#2D6DF6] to-[#00D2FF] bg-clip-text text-transparent">
                    {profile.highlightTerm}
                  </span>
                  {profile.title.split(profile.highlightTerm)[1]}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-[460px]">
                  {profile.subtext}
                </p>
              </div>

              {/* Metric Proof Points */}
              <div className="relative z-10 grid grid-cols-3 gap-2 bg-[#060A45]/80 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
                {profile.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-lg font-black text-white tracking-tight">
                      {stat.val}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wide mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AD ACTION BAR */}
            <div className="bg-[#f9fafb] px-4 py-3 flex items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {profile.ctaHead}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {profile.ctaUrl}
                </span>
              </div>
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-1.5 border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 hover:border-[#004182] hover:text-[#004182] font-bold text-xs whitespace-nowrap transition-colors"
              >
                Learn more ↗
              </a>
            </div>

            {/* ENGAGEMENT METRICS */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-[#e0dfdc]">
              <span>👍 💡 👏 {likeCount} • 52 comments</span>
              <span>24 reposts</span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex items-center justify-around py-1 text-xs font-semibold text-slate-600">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 py-2 px-3 rounded hover:bg-[#ebebeb] transition-colors ${liked ? 'text-[#0a66c2]' : ''}`}
              >
                👍 Like
              </button>
              <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-[#ebebeb] transition-colors">
                💬 Comment
              </button>
              <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-[#ebebeb] transition-colors">
                🔁 Repost
              </button>
              <button className="flex items-center gap-1.5 py-2 px-3 rounded hover:bg-[#ebebeb] transition-colors">
                🚀 Send
              </button>
            </div>

          </article>

        </main>

        {/* RIGHT COLUMN: CHALLENGER SCRIPT & GRAPH INSPECTOR */}
        <aside className="flex flex-col gap-3">

          {/* CHALLENGER SCRIPT CARD */}
          {showChallengerCue && (
            <div className="bg-[#090e17] text-slate-200 border border-slate-800 rounded-xl p-3.5 shadow-md text-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#38bdf8] flex items-center gap-1.5">
                  ⚡ What's Happening
                </h4>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border ${profile.isGoverned ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400' : 'bg-red-950/70 border-red-500 text-red-400'}`}>
                {profile.isGoverned ? '✔ 100% Governed Permutation' : '✘ Governance Drift / Franken-Page'}
              </div>

              <p className="text-slate-400 leading-relaxed">
                {profile.cue}
              </p>

              {/* GRAPH QUERY RESOLVER */}
              <div className="bg-[#030712] border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1 font-sans flex items-center justify-between">
                  <span>Live Optimizely Graph Query</span>
                  <span className="text-[10px] text-sky-400">Deterministic</span>
                </div>
                <div><span className="text-amber-400">$visitorRole:</span> <span className="text-sky-300">"{profile.persona}"</span></div>
                <div><span className="text-amber-400">$visitorIndustry:</span> <span className="text-sky-300">"{profile.industry}"</span></div>
                <div><span className="text-amber-400">$visitorTier:</span> <span className="text-sky-300">"{profile.tier}"</span></div>
                <div className="pt-1 text-slate-300 border-t border-slate-800 mt-1">
                  <span className="text-slate-400">Resolves:</span><br/>
                  <span className="text-emerald-400 font-semibold">{profile.resolutionText}</span>
                </div>
              </div>
            </div>
          )}

          {/* LINKEDIN NEWS CARD */}
          <div className="bg-white border border-[#e0dfdc] rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900">LinkedIn News</span>
              <span className="text-xs text-slate-400">ℹ️</span>
            </div>
            <ul className="space-y-3 text-xs">
              <li className="flex flex-col">
                <span className="font-semibold text-slate-800 hover:text-[#0a66c2] cursor-pointer">
                  European Retail Media surges 28%
                </span>
                <span className="text-[11px] text-slate-500">1d ago • 14,210 readers</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-slate-800 hover:text-[#0a66c2] cursor-pointer">
                  CPGs face digital out-of-stock squeeze
                </span>
                <span className="text-[11px] text-slate-500">3h ago • 8,920 readers</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold text-slate-800 hover:text-[#0a66c2] cursor-pointer">
                  Amazon 1P vs. 3P profitability battle
                </span>
                <span className="text-[11px] text-slate-500">12h ago • 5,420 readers</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </div>
  );
}
