import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
	open: boolean;
	title: ReactNode;
	description: ReactNode;
	confirmLabel: ReactNode;
	destructive?: boolean;
	onResolve: (confirmed: boolean) => void;
};

export function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel,
	destructive,
	onResolve,
}: ConfirmDialogProps) {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onResolve(false)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onResolve(false)}>
						{t("common.cancel")}
					</Button>
					<Button
						autoFocus
						variant={destructive ? "destructive" : "default"}
						onClick={() => onResolve(true)}>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
