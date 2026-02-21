import { Style } from 'valdi_core/src/Style';
import { Colors } from './ColorUtils';

// Shared Notion-style styles
export const styles = {
  // Page background
  page: new Style<View>({
    backgroundColor: Colors.background,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  }),

  // Card container
  card: new Style<View>({
    backgroundColor: Colors.surface,
    borderRadius: 8,
    border: `1 solid ${Colors.border}`,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  }),

  // Card without horizontal margin (for nested use)
  cardInner: new Style<View>({
    backgroundColor: Colors.surface,
    borderRadius: 8,
    border: `1 solid ${Colors.border}`,
    padding: 12,
  }),

  // Section container
  section: new Style<View>({
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  }),

  // Row layout
  row: new Style<View>({
    flexDirection: 'row',
    alignItems: 'center',
  }),

  // Row with space between
  rowSpaced: new Style<View>({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }),

  // 2x2 grid container
  grid2x2: new Style<View>({
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 12,
  }),

  // Grid cell (half width with gap)
  gridCell: new Style<View>({
    width: '48%',
    marginBottom: 8,
  }),

  // Divider line
  divider: new Style<View>({
    height: 1,
    backgroundColor: Colors.divider,
    width: '100%',
    marginVertical: 8,
  }),

  // Tap target
  tapTarget: new Style<View>({
    paddingVertical: 12,
    paddingHorizontal: 16,
  }),

  // List item row
  listItem: new Style<View>({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  }),

  // Button
  button: new Style<View>({
    backgroundColor: Colors.textPrimary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // Button (outline)
  buttonOutline: new Style<View>({
    backgroundColor: 'transparent',
    borderRadius: 6,
    border: `1 solid ${Colors.border}`,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // Button (destructive)
  buttonDestructive: new Style<View>({
    backgroundColor: Colors.error,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // Text input
  textInput: new Style<TextField>({
    backgroundColor: Colors.surfaceHover,
    borderRadius: 6,
    border: `1 solid ${Colors.border}`,
    padding: 12,
    width: '100%',
    color: Colors.textPrimary,
  }),
};

// Font helpers
export function titleFont() {
  return systemBoldFont(24);
}

export function headingFont() {
  return systemBoldFont(18);
}

export function sectionFont() {
  return systemBoldFont(16);
}

export function bodyFont() {
  return systemFont(14);
}

export function captionFont() {
  return systemFont(12);
}

export function monoFont() {
  return monospacedFont(13);
}
