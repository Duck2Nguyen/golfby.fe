import { themeQuartz } from 'ag-grid-community';

export const customerDataGridTheme = themeQuartz.withParams({
  borderRadius: 0,
  wrapperBorderRadius: 0,

  backgroundColor: '#FFFFFF',
  oddRowBackgroundColor: '#FFFFFF',
  headerBackgroundColor: '#F3F4F699',
  chromeBackgroundColor: '#FFFFFF',

  foregroundColor: '#111827',
  cellTextColor: '#6B7280',
  headerTextColor: '#6B7280',
  subtleTextColor: '#6B7280',

  fontFamily: 'var(--font-nunito), sans-serif',
  fontSize: 13,
  dataFontSize: 13,
  headerFontSize: 12,
  headerFontWeight: 600,

  borderColor: '#E5E7EB',
  columnBorder: false,
  headerColumnBorder: false,
  rowBorder: false,
  wrapperBorder: false,
  headerRowBorder: false,

  spacing: 4,
  cellHorizontalPadding: 20,
  rowHeight: 52,
  headerHeight: 46,

  rowHoverColor: '#F3F4F680',
  selectedRowBackgroundColor: '#ECFDF5',

  headerColumnResizeHandleColor: 'transparent',
});
