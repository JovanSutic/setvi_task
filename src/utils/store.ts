import { create } from "zustand";
import { IReport, IReportCreate } from "../types/app.types";
import { sampleReports } from "../mocks/mockData";

interface AppStore {
  reports: IReport[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  role: "Admin" | "Viewer";

  setReports: (reports: IReport[]) => void;
  addReport: (report: IReportCreate) => void;
  updateReport: (id: number, updatedReport: IReportCreate) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
  setSuccessMessage: (message: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  reports: [],
  loading: false,
  error: null,
  successMessage: null,
  role: "Admin",

  setReports: (reports) => set({ reports }),
  addReport: (report: IReportCreate) =>
    set((state) => ({
      reports: state.reports.length
        ? [
            ...state.reports,
            {
              id: state.reports.length + 1,
              title: report.title,
              content: report.content,
            },
          ]
        : [
            ...sampleReports,
            {
              id: sampleReports.length + 1,
              title: report.title,
              content: report.content,
            },
          ],
    })),
  updateReport: (id, updatedReport) =>
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id ? { ...report, ...updatedReport } : report
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
  setSuccessMessage: (message) => set({ successMessage: message }),
}));
