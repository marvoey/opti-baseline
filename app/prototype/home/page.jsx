import Image from 'next/image';

/**
 * Recreates #ctl01_CLHomeBanner from www.esl.org
 * Source: 000-build-notes/ESL Federal Credit Union.html, lines 992–1034
 */
export default function HomeBannerPrototype() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background image — mirrors the <picture> randomContainer */}
      <div className="relative w-full aspect-[16/5] min-h-64">
        <Image
          src="/hpb_homeequity_summer2026.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        {/* bannerMain-copy overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl bg-blue-950/80 md:bg-transparent rounded-lg p-6 md:p-0">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Turn Your Home Equity into a Flexible Financial Solution
              </h1>
              <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
                3.95% Intro APR<sup>1</sup> for 12 months with an LTV up to 90% + no closing
                costs<sup>3</sup> then 7.25% APR<sup>1</sup> with an LTV up to 80%.
              </p>
              <a
                href="https://www.esl.org/home-equity/esl-home-equity-solutions"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
              >
                Apply Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
