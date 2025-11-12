"use client";

import { useEffect } from 'react';
import getSupabase from '@/lib/supabaseClient';

function hexToHslString(hex: string) {
  if (!hex) return '';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hDeg = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hDeg = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hDeg = (b - r) / d + 2; break;
      case b: hDeg = (r - g) / d + 4; break;
    }
    hDeg = Math.round(hDeg * 60);
  }
  return `${hDeg} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function ThemeManager() {
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getUser().then((res) => {
      const currentUser = res.data.user;
      const color = currentUser?.user_metadata?.color || null;
      applyColor(color);
    }).catch(() => {
      applyColor(null);
    });

    function applyColor(hex: string | null) {
      try {
        if (hex) {
          const hsl = hexToHslString(hex);
          if (hsl) {
            document.documentElement.style.setProperty('--primary', hsl);
            document.documentElement.style.setProperty('--accent', hsl);
          }
          setMetaVariants(hex);
        } else {
          // default dark browser theme color
          setMetaVariants('#0f172a');
        }
      } catch (err) {
        // ignore
      }
    }

    function darkenHex(hex: string, factor = 0.8) {
      const h = hex.replace('#', '');
      const r = Math.max(0, Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * factor)));
      const g = Math.max(0, Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * factor)));
      const b = Math.max(0, Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * factor)));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function setMetaVariants(colorHex: string) {
      // default
      let metaDefault = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (!metaDefault) {
        metaDefault = document.createElement('meta');
        metaDefault.name = 'theme-color';
        document.head.appendChild(metaDefault);
      }
      metaDefault.setAttribute('content', colorHex);

      // prefers-color-scheme light
      let metaLight = document.querySelector('meta[name="theme-color"][media]') as HTMLMetaElement | null;
      if (!metaLight) {
        metaLight = document.createElement('meta');
        metaLight.setAttribute('name', 'theme-color');
        metaLight.setAttribute('media', '(prefers-color-scheme: light)');
        document.head.appendChild(metaLight);
      }
      // use a slightly lighter variant for light scheme
      metaLight.setAttribute('content', colorHex);

      // prefers-color-scheme dark
      let metaDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]') as HTMLMetaElement | null;
      if (!metaDark) {
        metaDark = document.createElement('meta');
        metaDark.setAttribute('name', 'theme-color');
        metaDark.setAttribute('media', '(prefers-color-scheme: dark)');
        document.head.appendChild(metaDark);
      }
      // darken color a bit for dark scheme to ensure contrast
      metaDark.setAttribute('content', darkenHex(colorHex, 0.75));
    }
  }, []);

  return null;
}
