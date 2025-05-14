import { NextRequest, NextResponse } from "next/server";
import  NewsletterService  from "../../core/services/NewsletterService";

export async function POST(request: NextRequest) {
    const body: NewsletterSignup = await request.json();
    const service = new NewsletterService();

    return NextResponse.json(
        {
            success: await service.subscribe(body),
            data: body
        },
        { status: 200 }
    );
}