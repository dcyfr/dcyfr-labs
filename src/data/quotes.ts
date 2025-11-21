export type Quote = {
    text: string;
    author?: string;
    date?: string;
    source?: string;
    tags?: string[];
};

export const quotes: Quote[] = [
    {
        text: "I was a skeptic, I became a nihilist, now I'm an absurdist.",
        author: "Drew",
        date: "2025-11-20",
        tags: ["philosophy", "absurdism", "personal"]
    }
];