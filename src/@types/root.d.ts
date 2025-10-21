type Subject = { id: number; name: string; board: string; }

type Unit = { id: number; title: string; name: string; }

type Lesson = { id: number; title: string; name: string; }

type QueOption = {
    text: string;
    image: File | null;
}

type InitFiltersData = {
    subjects: Subject[];
    units: Unit[];
    lessons: Lesson[];
}

type Question = {
    id: number;
    title: string;
    type: string;
    content: string;
}