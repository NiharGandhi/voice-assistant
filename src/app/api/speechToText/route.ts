import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const arrayBuffer = await req.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });

        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        const headers = {
            'x-rapidapi-key': 'e9a0d93d50mshe98a3e570cb3576p1bc973jsn3823a95811ea',
            'x-rapidapi-host': 'whisper-speech-to-text1.p.rapidapi.com',
            // Do not include the headers returned by formData.getHeaders()
            // as it's not available in browser FormData.
        };

        const response = await axios.post('https://whisper-speech-to-text1.p.rapidapi.com/speech-to-text', formData, { headers });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("[ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
