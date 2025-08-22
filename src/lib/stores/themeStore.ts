import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Mode = 'light' | 'dark'
type ColorTheme = 'default' | 'ocean-blue' | 'forest-green' | 'sunset-pink' | 'vintage-sepia'

interface ThemeState {
  colorTheme: ColorTheme
  mode: Mode
  setColorTheme: (theme: ColorTheme) => void
  setMode: (mode: Mode) => void
  toggleMode: () => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorTheme: 'default',
      mode: 'dark',

      setColorTheme: (theme: ColorTheme) => {
        set({ colorTheme: theme })
        get().applyTheme()
      },

      setMode: (mode: Mode) => {
        set({ mode })
        get().applyTheme()
      },

      toggleMode: () => {
        const currentMode = get().mode
        const newMode = currentMode === 'dark' ? 'light' : 'dark'
        get().setMode(newMode)
      },

      applyTheme: () => {
        const { colorTheme, mode } = get()
        const root = document.documentElement
        
        // Remove all theme classes
        root.classList.remove('light', 'dark')
        
        // Add current mode class
        root.classList.add(mode)
        
        // Set the data-theme attribute
        root.dataset.theme = colorTheme
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.applyTheme()
        }
      }
    }
  )
)
