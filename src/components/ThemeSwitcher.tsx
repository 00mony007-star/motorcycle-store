import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useThemeStore } from '../lib/stores/themeStore';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const themes = [
  { name: 'default', label: 'MotoGear Slate', description: 'The original dark theme', colors: ['#F8FAFC', '#334155', '#0F172A'] },
  { name: 'ocean-blue', label: 'Ocean Blue', description: 'Cool and refreshing', colors: ['#38BDF8', '#0EA5E9', '#0369A1'] },
  { name: 'forest-green', label: 'Forest Green', description: 'Natural and calming', colors: ['#4ADE80', '#22C55E', '#15803D'] },
  { name: 'sunset-pink', label: 'Sunset Pink', description: 'Warm and vibrant', colors: ['#F472B6', '#EC4899', '#BE185D'] },
  { name: 'vintage-sepia', label: 'Vintage Sepia', description: 'Classic and elegant', colors: ['#D5A75F', '#B58A44', '#846128'] },
];

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, toggleMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 start-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-2 w-72 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg"
          >
            <div className="p-4 border-b">
                <h3 className="font-semibold text-sm flex items-center"><Palette className="me-2 h-4 w-4"/> Choose Theme</h3>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
                {themes.map((t) => (
                    <button
                        key={t.name}
                        className={cn(
                            'w-full text-start p-3 rounded-md hover:bg-muted/50 transition-colors focus-ring',
                            colorTheme === t.name && 'bg-muted'
                        )}
                        onClick={() => setColorTheme(t.name as any)}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="flex -space-x-2 me-3">
                                    {t.colors.map(c => <div key={c} className="w-5 h-5 rounded-full border-2 border-background" style={{ backgroundColor: c }} />)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{t.label}</p>
                                    <p className="text-xs text-muted-foreground">{t.description}</p>
                                </div>
                            </div>
                            {colorTheme === t.name && <Check className="h-5 w-5 text-primary" />}
                        </div>
                    </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col gap-2">
        <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={toggleMode}
            aria-label="Toggle light/dark mode"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, rotate: -30 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                >
                    {mode === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </motion.div>
            </AnimatePresence>
        </Button>
        <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Choose theme"
        >
            <Palette className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
