// Hero header of /demo/fx-guide.
// Generated from the ehealth_fx_implementation_guide.html canvas. See ../page.tsx before editing by hand.
/* eslint-disable @next/next/no-img-element -- static SVG illustrations, nothing to optimize */
import logoImg from '../_assets/logo.svg';
import heroImg from '../_assets/hero.svg';

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap hero-in">
        <div>
          <img className="logo" src={logoImg.src} alt="Optimizely" width="264" />
          <p className="hero-eyebrow">eHealth demo · Friday 20 Nov 2026 · Act 3: personalize and test</p>
          <h1 className="h1">You’re free to <span className="extw" style={{ width: '5.034em' }}><svg className="ext" role="img" aria-label="experiment" xmlns="http://www.w3.org/2000/svg" viewBox="-26 -85 541.4 137" style={{ left: '-0.260em', bottom: '-0.52em', width: '5.414em', height: '1.37em' }}><g fontSize="100"><text x="-20" y="20" fill="#0D593E">experiment</text><text x="-15" y="15" fill="#166E49">experiment</text><text x="-10" y="10" fill="#2E8C45">experiment</text><text x="-5" y="5" fill="#3AB533">experiment</text><text x="0" y="0" fill="#ABFF44">experiment</text></g></svg></span>.</h1>
          <p className="sub">Feature Experimentation + CMS SaaS on the eHealth demo: how the home-page hero gets picked, built and ordered, step by step.</p>
          <p className="lead">Editors write the variations. Feature Experimentation decides who sees which one. Optimizely Graph serves the winner on the server, so nothing flickers. This guide covers what was set up, in what order, why, and what happens on every request.</p>
          <div className="chips"><span className="chip live">Live and verified 19 Nov</span> <span className="chip">FX project 6229025884995584</span> <span className="chip">Environment: Development</span> <span className="chip">JS SDK 6.7, server side</span> <span className="chip">Next.js 16 + @optimizely/cms-sdk 2.x</span> <span className="chip">Web Experimentation: not used</span></div>
        </div>
        <img className="hero-ill" src={heroImg.src} alt="" />
      </div>
    </header>
  );
}
