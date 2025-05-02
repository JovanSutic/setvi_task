import { delay, http, HttpResponse } from "msw";
import { OpenAIChatRequest } from "../types/app.types";
import { sampleReports, draftMock, reportSummery } from "./mockData";

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
                    content: reportSummery,
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
                  content: draftMock,
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
