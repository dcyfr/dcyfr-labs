import { NextResponse } from "next/server";

function generateLolzContent() {
  // Generate some humorous or silly content
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer go broke? Because he used up all his cache.",
    "Why do Java developers wear glasses? Because they don't see sharp.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "Why do Python programmers have low self-esteem? Because they're constantly comparing their self to others.",
    "What do you call 8 hobbits? A hobbyte.",
    "Why did the computer show up at work late? It had a hard drive.",
    "Why was the cell phone wearing glasses? Because it lost its contacts.",
    "Why did the scarecrow become a successful software engineer? Because he was outstanding in his field!",
    "Why don't programmers like nature? It has too many bugs.",
    "What do you get when you cross a computer and a lifeguard? A screensaver.",
    "Why did the developer go broke? Because he used up all his cache.",
    "Why was the math book sad? Because it had too many problems.",
    "Why did the web developer leave the restaurant? Because of the table layout.",
    "Why do programmers hate spaces? Because they prefer tabs.",
    "What do you call a group of 8 hobbits? A hobbyte.",
     "Why did the computer go to therapy? It had too many bytes of emotional baggage.",
  ];

  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}

export function GET() {
  const content = generateLolzContent();
  return NextResponse.json({ lolz: content }, { status: 200 });
}