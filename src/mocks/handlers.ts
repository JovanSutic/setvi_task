import { delay, http, HttpResponse } from "msw";
import { IReport, OpenAIChatRequest } from "../types/app.types";

const summeryMock =
  "Executive SummaryIn the first quarter of 2025, [Institution Name] demonstrated strong financial performance and operational resilience despite ongoing market volatility. Continued focus on digital transformation, customer-centric strategies, and robust risk management contributed to healthy revenue growth and profitability.Key Financial HighlightsTotal Revenue: $XX million (↑ X% YoY)Net Income: $XX million (↑ X% YoY)Earnings Per Share (EPS): $X.XXReturn on Equity (ROE): X.X%Cost-to-Income Ratio: XX.X% (↓ X.X percentage points)Business Segment PerformanceRetail Banking: Continued growth in personal loans and mortgage portfolios, with net interest income increasing by X%.Corporate Banking: Strong pipeline of commercial lending; transactional revenue saw X% uplift.Wealth Management: Assets under management (AUM) rose to $XX billion, driven by inflows and positive market performance.Digital Services: Digital channel usage increased by X%, supporting lower operational costs.Risk & Compliance OverviewCredit quality remained stable, with non-performing loan (NPL) ratio at X.X%.Liquidity coverage ratio (LCR) remained above regulatory thresholds.Cybersecurity protocols and anti-money laundering (AML) monitoring were further enhanced.Strategic InitiativesLaunched new AI-powered financial advisory platform.Expanded sustainable finance offerings, including green bonds and ESG-focused lending products.Continued branch rationalization and investment in digital infrastructure.Outlook for Q2 2025Management expects continued revenue growth supported by interest rate stability and improved loan demand. Focus areas include accelerating fintech partnerships, expanding regional market share, and advancing ESG integration.";

export const sampleReports: IReport[] = [
  { id: 1, title: "Monthly Sales Report", content: "A" },
  { id: 2, title: "Yearly Summary", content: "B" },
  { id: 3, title: "User Feedback Analysis", content: "C" },
  { id: 4, title: "Revenue Overview", content: "D" },
  { id: 5, title: "Something AP", content: "E" },
  { id: 6, title: "Purchase Overview 2025", content: "F" },
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
  http.get(
    `${import.meta.env.VITE_API_URL}/reports/:id`,
    async ({ params }) => {
      try {
        await delay(700);
        const { id } = params;
        const report = sampleReports.find((r) => r.id === Number(id));

        if (report) {
          return HttpResponse.json({ data: report });
        } else {
          return HttpResponse.json(
            { error: "Report not found." },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error("Failed to parse request:", error);
        return HttpResponse.json(
          { error: "Invalid JSON payload." },
          { status: 400 }
        );
      }
    }
  ),
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
  http.put(
    `${import.meta.env.VITE_API_URL}/reports/:id`,
    async ({ request, params }) => {
      try {
        await delay(700);
        const body = await request.json();
        const { title, content } = body as ReportPayload;
        const { id } = params;

        if (title && content) {
          return HttpResponse.json(
            { success: true, data: { id: Number(id), title, content } },
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
    }
  ),
  http.post(
    "https://api.openai.com/v1/chat/completions",
    async ({ request }) => {
      try {
        await delay(700);
        const body = await request.json();
        const { messages } = body as OpenAIChatRequest;
        if (
          messages[0].content ===
          "You are a helpful assistant that summarizes reports."
        ) {
          return HttpResponse.json(
            {
              choices: [
                {
                  message: {
                    content:
                      "This is the best report in the world and you don't need to worry about anything.",
                  },
                },
              ],
            },
            { status: 200 }
          );
        }

        return HttpResponse.json(
          {
            choices: [
              {
                message: {
                  content: summeryMock,
                },
              },
            ],
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Failed to parse request:", error);
        return HttpResponse.json(
          { error: "Invalid JSON payload." },
          { status: 400 }
        );
      }
    }
  ),
];
