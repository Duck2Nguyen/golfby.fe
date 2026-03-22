'use client';

import { AgGridReact } from 'ag-grid-react';
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

import {
  type GridApi,
  ModuleRegistry,
  AllCommunityModule,
  type GridReadyEvent,
  type BodyScrollEvent,
  type ViewportChangedEvent,
} from 'ag-grid-community';

import type { Ref } from 'react';
import type { AgGridReactProps } from 'ag-grid-react';

import styles from './styles.module.css';
import { customerDataGridTheme } from './theme';
import 'ag-grid-community/styles/ag-grid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataGridProps extends AgGridReactProps {
  className?: string;
  onScrollToBottom?: () => void;
}

export interface DataGridHandle {
  api?: GridApi;

  hideOverlay(): void;
  showLoadingOverlay(): void;
}

const DataGrid = forwardRef(
  (
    props: DataGridProps,
    ref:
      | ((instance: DataGridHandle | null) => void)
      | React.MutableRefObject<DataGridHandle | null>
      | Ref<DataGridHandle | null>
      | null,
  ) => {
    const { className, defaultColDef, onGridReady, onScrollToBottom, theme, ...rest } = props;

    const [gridInit, setGridInit] = useState(false);
    const loadingRef = useRef(false);
    const scrollOffset = 0.95;
    const containerRef = useRef<HTMLDivElement>(null);

    const dataGridRef = useRef<{
      api?: GridApi;
      loading: boolean;
    }>({
      loading: false,
    });

    const handleGridReady = (event: GridReadyEvent) => {
      dataGridRef.current.api = event.api;
      setGridInit(true);
      setTimeout(() => {
        onGridReady?.(event);
      });
    };

    const hideOverlay = () => {
      if (!dataGridRef.current.api) return;

      dataGridRef.current.api.setGridOption('loading', false);
      dataGridRef.current.loading = false;
      loadingRef.current = false;
    };

    const showLoadingOverlay = () => {
      if (!dataGridRef.current.api) return;

      dataGridRef.current.api.setGridOption('loading', true);
      dataGridRef.current.loading = true;
    };

    const handleBodyScroll = (event: BodyScrollEvent) => {
      if (event.direction !== 'vertical') return;
      if (!dataGridRef.current.api) return;

      const { bottom } = dataGridRef.current.api.getVerticalPixelRange();
      const rowCount = dataGridRef.current.api.getDisplayedRowCount();
      const rowHeight = dataGridRef.current.api.getSizesForCurrentTheme().rowHeight;
      const contentHeight = rowCount * rowHeight;

      if (contentHeight <= 0) return;
      if (bottom / contentHeight <= scrollOffset) return;

      if (onScrollToBottom && !dataGridRef.current.loading && !loadingRef.current) {
        loadingRef.current = true;
        onScrollToBottom();
      }
    };

    const handleViewportChanged = (event: ViewportChangedEvent) => {
      if (!containerRef.current || event.lastRow === -1) return;

      const agBodyViewport = containerRef.current.querySelector('.ag-body-viewport') as HTMLElement | null;
      if (!agBodyViewport) return;

      if (agBodyViewport.scrollHeight <= agBodyViewport.clientHeight) {
        if (onScrollToBottom && !dataGridRef.current.loading && !loadingRef.current) {
          onScrollToBottom();
          loadingRef.current = true;
        }
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        api: dataGridRef.current.api,
        hideOverlay,
        showLoadingOverlay,
      }),
      [gridInit],
    );

    return (
      <div ref={containerRef} className={`${styles.root} ${className || ''}`.trim()}>
        <AgGridReact
          onBodyScroll={handleBodyScroll}
          onGridReady={handleGridReady}
          onViewportChanged={handleViewportChanged}
          animateRows={false}
          defaultColDef={{
            minWidth: 60,
            resizable: false,
            ...defaultColDef,
          }}
          overlayLoadingTemplate="Đang tải"
          overlayNoRowsTemplate="Không có dữ liệu"
          sortingOrder={['desc', 'asc', null]}
          suppressCellFocus
          suppressDragLeaveHidesColumns
          suppressRowHoverHighlight
          theme={theme || customerDataGridTheme}
          {...rest}
        />
      </div>
    );
  },
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
