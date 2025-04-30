import { delay, http, HttpResponse } from "msw";
import { IReport } from "../types/app.types";

const sampleReports: IReport[] = [
  { id: 1, title: "Monthly Sales Report", content: "" },
  { id: 2, title: "Yearly Summary", content: "" },
  { id: 3, title: "User Feedback Analysis", content: "" },
  { id: 4, title: "Revenue Overview", content: "" },
  { id: 5, title: "Something AP", content: "" },
  { id: 6, title: "Purchase Overview 2025", content: "" },
];

type ReportPayload = {
  title: string;
  content: string;
};

export const handlers = [
  http.get(`${import.meta.env.VITE_API_URL}/reports`, async () => {
    try {
      await delay(700);
      return HttpResponse.json({ data: sampleReports });
    } catch (error) {
      console.error("Failed to parse request:", error);
      return HttpResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }
  }),
  http.post(`${import.meta.env.VITE_API_URL}/reports`, async ({ request }) => {
    try {
      await delay(700);
      const body = await request.json();
      const { title, content } = body as ReportPayload;

      if (title && content) {
        return HttpResponse.json(
          { success: true, data: { title, content } },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { error: "Submitted data not in valid format." },
          { status: 422 }
        );
      }
    } catch (error) {
      console.error("Failed to parse request:", error);
      return HttpResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }
  }),
];
