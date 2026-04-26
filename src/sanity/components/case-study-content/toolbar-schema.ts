import {
	useToolbarSchema,
	type ExtendDecoratorSchemaType,
	type ToolbarSchema,
} from "@portabletext/toolbar";
import { WEIGHT_DECORATORS } from "./constants";

const WEIGHT_SET = new Set<string>(WEIGHT_DECORATORS);

/**
 * Marks each weight decorator as mutually exclusive with the other four so
 * `useDecoratorButton` will auto-strip the others when one is toggled on.
 */
const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
	if (WEIGHT_SET.has(decorator.name)) {
		return {
			...decorator,
			mutuallyExclusive: WEIGHT_DECORATORS.filter((w) => w !== decorator.name),
		};
	}
	return decorator;
};

export function useCaseStudyToolbarSchema(): ToolbarSchema {
	return useToolbarSchema({ extendDecorator });
}
