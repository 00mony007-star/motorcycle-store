import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const brands = [
  'MotoElite', 'TrailMaster', 'CityRider', 'WeatherTech', 'PeakPerformance', 
  'UrbanGrip', 'SpeedTech', 'RideSafe', 'MotoCorp', 'Velocity', 'ApexGear', 'TourMaster'
];

const BrandLogo = ({ name }: { name: string }) => (
  <div className="flex items-center space-x-3 flex-shrink-0 mx-6">
    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
      <span className="text-primary font-bold text-sm">{name.charAt(0)}</span>
    </div>
    <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{name}</span>
  </div>
);

export function BrandMarquee() {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const extendedBrands = [...brands, ...brands]; // Duplicate for seamless loop

  return (
    <section className="bg-secondary py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-semibold uppercase text-muted-foreground tracking-widest mb-8">
          {t('home.brandMarqueeTitle')}
        </h3>
        <div className="relative overflow-hidden group">
          <div className={cn(
            "flex group-hover:[animation-play-state:paused]",
            isRtl ? 'animate-marquee-rtl' : 'animate-marquee'
          )}>
            {extendedBrands.map((brand, index) => (
              <BrandLogo key={`${brand}-${index}`} name={brand} />
            ))}
          </div>
          <div className={cn(
            "absolute inset-0 pointer-events-none",
            isRtl 
              ? "bg-gradient-to-l from-background via-transparent to-background" 
              : "bg-gradient-to-r from-background via-transparent to-background"
          )}></div>
        </div>
      </div>
    </section>
  );
}
