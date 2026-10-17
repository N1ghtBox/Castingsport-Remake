import { useEffect, useRef } from "react";

type CtrlShortcutOptions = {
	// When false, the shortcut is ignored while typing in a text field so the field keeps its native behaviour (e.g. Ctrl+A select all).
	allowInInputs?: boolean;
};

const isEditableElement = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Runs `handler` on Ctrl+`key` (Cmd+`key` on macOS) anywhere on the page. */
export function useCtrlShortcut(
	key: string,
	handler: () => void,
	{ allowInInputs = false }: CtrlShortcutOptions = {},
) {
	const handlerRef = useRef(handler);
	handlerRef.current = handler;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== key) return;
			if (event.repeat || (!allowInInputs && isEditableElement(event.target))) return;
			event.preventDefault();
			handlerRef.current();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [key, allowInInputs]);
}
