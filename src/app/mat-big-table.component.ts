import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface RowData {
  [key: string]: string | number;
}

@Component({
  selector: 'app-mat-big-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './mat-big-table.component.html',
  styleUrls: ['./mat-big-table.component.css']
})
export class MatBigTableComponent implements AfterViewInit {
  readonly TOTAL_COLUMNS = 50;
  readonly TOTAL_ROWS = 200;

  dataSource = new MatTableDataSource<RowData>([]);

  // column visibility map (col1..col50)
  columnVisibility: Record<string, boolean> = {} as Record<string, boolean>;

  // column groups (four groups with ranges)
  columnGroups = [
    { name: 'Fixed Columns', start: 1, end: 3 },
    { name: 'Acquire, Engage & Invest', start: 4, end: 12 },
    { name: 'Payments & Lending', start: 13, end: 25 },
    { name: 'Digital Shared Services', start: 26, end: 38 },
    { name: 'Open Banking & Partnership', start: 39, end: 40 },
    { name: 'API & Partnership', start: 41, end: 45 },
    { name: 'Emerging Tech & Collabration', start: 46, end: 50 }
  ];

  // group header column ids used for the top header row
  get groupHeaderColumns(): string[] {
    return this.columnGroups.map((_, i) => `group${i}`);
  }

  countVisibleInGroup(groupIndex: number) {
    const g = this.columnGroups[groupIndex];
    let count = 0;
    for (let i = g.start; i <= g.end; i++) {
      if (this.columnVisibility[`col${i}`]) count++;
    }
    return count;
  }

  get allColumns(): string[] {
    return Array.from({ length: this.TOTAL_COLUMNS }, (_, i) => `col${i + 1}`);
  }

  get displayedColumns(): string[] {
    return this.allColumns.filter((c) => this.columnVisibility[c]);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions = [5, 10, 15, 20, 25];

  constructor() {
    // default: show all columns
    this.allColumns.forEach((c) => (this.columnVisibility[c] = true));

    // create mock data
    const rows: RowData[] = [];
    for (let r = 1; r <= this.TOTAL_ROWS; r++) {
      const row: RowData = { id: r };
      for (let c = 1; c <= this.TOTAL_COLUMNS; c++) {
        row[`col${c}`] = `R${r}-C${c}`;
      }
      rows.push(row);
    }

    this.dataSource.data = rows;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // ensure paginator length and default page size are set
    this.paginator.length = this.dataSource.data.length;
    if (!this.paginator.pageSize) {
      this.paginator.pageSize = 5;
    }

    // subscribe to paginator events for debugging and to ensure change handling
    this.paginator.page.subscribe((event) => {
      // keep default behavior (MatTableDataSource listens to paginator.events)
      console.log('paginator event', event);
    });
  }

  onPageSizeChange(value: any) {
    const size = Number(value);
    if (!this.paginator || Number.isNaN(size)) return;
    // Prefer the internal method if available
    const pg: any = this.paginator as any;
    if (typeof pg._changePageSize === 'function') {
      pg._changePageSize(size);
    } else {
      // fallback: set pageSize and emit a page event
      const prev = this.paginator.pageIndex;
      this.paginator.pageSize = size;
      this.paginator.pageIndex = 0;
      this.paginator.page.emit({
        pageIndex: 0,
        pageSize: size,
        length: this.paginator.length,
        previousPageIndex: prev
      });
    }
  }

  toggleGroup(groupIndex: number, visible?: boolean) {
    const group = this.columnGroups[groupIndex];
    for (let i = group.start; i <= group.end; i++) {
      this.columnVisibility[`col${i}`] = visible ?? !this.columnVisibility[`col${i}`];
    }
  }

  toggleColumn(column: string) {
    this.columnVisibility[column] = !this.columnVisibility[column];
  }

  showAll() {
    this.allColumns.forEach((c) => (this.columnVisibility[c] = true));
  }

  hideAll() {
    this.allColumns.forEach((c) => (this.columnVisibility[c] = false));
  }
}
