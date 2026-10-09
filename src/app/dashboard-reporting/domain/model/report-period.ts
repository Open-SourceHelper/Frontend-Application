/** Intervalo inclusivo de fechas ISO (YYYY-MM-DD). */
export class ReportPeriod {
  constructor(readonly startDate: string, readonly endDate: string) {
    const valid = (value: string) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
      new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

    if (!valid(startDate) || !valid(endDate) || startDate > endDate) {
      throw new Error('Selecciona un rango de fechas válido.');
    }
  }

  contains(date: string): boolean {
    return date.slice(0, 10) >= this.startDate &&
      date.slice(0, 10) <= this.endDate;
  }
}
