type Team = {
	id: string;
	name: string;
	memberNames: Array<string>;
	members: Array<string>;
	category: (typeof TeamCategory)[keyof typeof TeamCategory]; // Category of the team, e.g., "Junior", "Senior"
};

export const TeamCategory = {
	Junior: "Młodzieży",
	Senior: "Seniorów",
	Women: "Kobiet",
} as const;

export default Team;
