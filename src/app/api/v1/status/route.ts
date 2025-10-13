import { NextRequest, NextResponse } from "next/server";

type WebService = {
  status: string;
  detail: string;
  version: string;
};

type ResponseData = {
  updated_at: string;
  web_service: WebService;
};

export async function GET(req: NextRequest) {
  const updatedAt = new Date().toISOString();

  let status = "offline";
  let detail = "";
  const version = process.version;

  try {
    const response = await fetch(process.env.NODE_ENV == "development" ? "http://localhost:3000": "https://chat.maycon.dev.br/");
    if (response.status === 200) {
      status = "online";
    }
    detail = `HTTPS ${response.status}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      detail = err.message;
    } else {
      detail = String(err);
    }
  }

  // Retorna JSON no App Router
  return NextResponse.json<ResponseData>(
    {
      updated_at: updatedAt,
      web_service: {
        status,
        detail,
        version,
      },
    },
    { status: 200 } // define o status HTTP
  );
}