import { useContext } from "react";

export function useGenericContext<T>(baseContext: React.Context<unknown>) {
	const context = useContext(baseContext);

	if (context === null) {
		throw new Error("useGenericContext must be used within a Provider");
	}

	return context as T;
}
