import { create } from "zustand";
import { IReport, IReportCreate } from "../types/app.types";

interface AppStore {
  reports: IReport[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  setReports: (reports: IReport[]) => void;
  addReport: (report: IReportCreate) => void;
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

  setReports: (reports) => set({ reports }),
  addReport: (report: IReportCreate) =>
    set((state) => ({
      reports: [
        ...state.reports,
        {
          id: state.reports.length + 1,
          title: report.title,
          content: report.content,
        },
      ],
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
  setSuccessMessage: (message) => set({ successMessage: message }),
}));
