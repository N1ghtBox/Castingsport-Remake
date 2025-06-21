type Team = {
    id: string;
    name: string;
    memberNames: Array<string>;
    member: Array<string>;
    category: typeof TeamCategory[keyof typeof TeamCategory]; // Category of the team, e.g., "Junior", "Senior"
};

export const TeamCategory = {
    Junior: "Młodzieżowa",
    Senior: "Mężczyźni",
    Women: "Kobiety"
} as const

export default Team