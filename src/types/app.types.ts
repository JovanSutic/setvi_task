export interface IReport {
  id: number;
  title: string;
  content: string;
}

export interface IReportCreate {
  title: string;
  content: string;
}

export interface OpenAIChatRequest {
  model: string;
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}
