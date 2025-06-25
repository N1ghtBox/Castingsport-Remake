"use client"
import { useNavigate } from "react-router"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

type ActionCardProps = {
    title: string
    description?: string
    url: string
    content?: string | JSX.Element
    icon?: JSX.Element
}

export function ActionCard({ description, title, icon, content, url }: ActionCardProps) {
    const navigate = useNavigate()

    return (
        <Card onClick={() => navigate(url)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardAction>{icon}</CardAction>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}
