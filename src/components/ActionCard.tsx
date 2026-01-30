"use client";
import { useNavigate } from "react-router";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

type ActionCardProps = {
	title: string;
	description?: string;
	url: string;
	content?: string | JSX.Element;
	icon?: JSX.Element;
};

export function ActionCard({
	description,
	title,
	icon,
	content,
	url,
}: ActionCardProps) {
	const navigate = useNavigate();

	return (
		<Card
			onClick={() => navigate(url)}
			className="hover:cursor-pointer relative overflow-hidden pl-[30%]">
			<img src='/timeline.jpg' className="absolute h-full w-[32%] top-0 left-0 [mask-image:linear-gradient(to_right,black,transparent)] 
            [-webkit-mask-image:linear-gradient(to_right,black,transparent)]" alt="" />
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<CardAction>{icon}</CardAction>
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	);
}
