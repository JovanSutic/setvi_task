import { http, HttpResponse } from "msw";
import { IReport } from "../pages/IndexPage";

const sampleReports: IReport[] = [
  { id: 1, title: "Monthly Sales Report" },
  { id: 2, title: "Yearly Summary" },
  { id: 3, title: "User Feedback Analysis" },
  { id: 4, title: "Revenue Overview" },
  { id: 5, title: "Something AP" },
  { id: 6, title: "Purchase Overview 2025" },
];

export const handlers = [
  http.get(`${import.meta.env.VITE_API_URL}/reports`, async ({ request, params }) => {
    console.log(request);
    console.log(params);
    return HttpResponse.json({ data: sampleReports });
  }),
];
