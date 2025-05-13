import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body: NewsletterSignup = await request.json();

    return NextResponse.json(
        {
            success: true,
            message: `Thank you, ${body.firstName}!`,
            data: body
        },
        { status: 200 }
    );
}