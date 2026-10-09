import { Injectable } from '@angular/core';
import { ObservationSnapshot } from '../../domain/model/observation-snapshot';
import { ReportPeriod } from '../../domain/model/report-period';

/** Exportador PDF sin librerías externas. Los textos se normalizan a ASCII para fuente Helvetica estándar. */
@Injectable({ providedIn: 'root' })
export class ReportPdfService {

  create(childId: string, period: ReportPeriod, observations: ObservationSnapshot[]): Blob {
    const lines = [
      'KINEMO - Reporte de observaciones',
      `Nino: ${childId}`,
      `Periodo: ${period.startDate} a ${period.endDate}`,
      `Total de observaciones: ${observations.length}`,
      '',
      ...observations.flatMap(item => [
        `${item.createdAt.slice(0, 10)} | ${item.author} | ${item.category ?? 'Observacion'}`,
        ...this.wrap(item.description, 87),
        ''
      ])
    ];

    const pages: string[][] = [];

    for (let i = 0; i < lines.length; i += 47) {
      pages.push(lines.slice(i, i + 47));
    }

    const objects: string[] = [];

    const add = (value: string): number => {
      objects.push(value);
      return objects.length;
    };

    const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const pagesId = add('');
    const pageIds: number[] = [];

    for (const page of pages) {
      const ops = page.map((line, i) =>
        `BT /F1 10 Tf 48 ${790 - i * 16} Td (${this.escape(line)}) Tj ET`
      ).join('\n');

      const contentId = add(`<< /Length ${ops.length} >>\nstream\n${ops}\nendstream`);

      const pageId = add(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${contentId} 0 R >>`
      );

      pageIds.push(pageId);
    }

    objects[pagesId - 1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] >>`;

    const catalog = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((obj, idx) => {
      offsets.push(pdf.length);
      pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xref = pdf.length;

    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

    for (const offset of offsets.slice(1)) {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
  }

  private escape(value: string): string {
    return value.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, '?')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  private wrap(value: string, length: number): string[] {
    const words = value.split(/\s+/);
    const lines: string[] = [];
    let line = '';

    for (const word of words) {
      if ((line + ' ' + word).trim().length > length && line) {
        lines.push(line);
        line = '';
      }

      if (word.length > length) {
        if (line) {
          lines.push(line);
          line = '';
        }

        for (let i = 0; i < word.length; i += length) {
          lines.push(word.slice(i, i + length));
        }
      } else {
        line = `${line} ${word}`.trim();
      }
    }

    if (line) {
      lines.push(line);
    }

    return lines.length ? lines : ['Sin descripcion'];
  }
}
