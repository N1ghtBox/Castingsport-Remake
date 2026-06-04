import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
	const error = useRouteError();
	const navigate = useNavigate();

	useEffect(() => {
		if (isRouteErrorResponse(error)) {
			console.error(`[ErrorPage] ${error.status} ${error.statusText}`, error.data);
		} else if (error instanceof Error) {
			console.error(`[ErrorPage] ${error.message}`, error.stack);
		} else {
			console.error("[ErrorPage] Unknown error", error);
		}
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center h-screen gap-6 text-center px-4">
			<AlertTriangle className="h-14 w-14 text-destructive" />
			<div className="flex flex-col gap-1">
				<h1 className="text-xl font-semibold">Coś poszło nie tak</h1>
				<p className="text-sm text-muted-foreground">
					Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem.
				</p>
			</div>
			<div className="flex gap-2">
				<Button variant="outline" onClick={() => navigate(-1)}>
					<RotateCcw className="h-4 w-4" />
					Wróć
				</Button>
				<Button onClick={() => navigate("/")}>
					<Home className="h-4 w-4" />
					Strona główna
				</Button>
			</div>
		</div>
	);
}
