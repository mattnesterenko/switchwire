import { CommonUtils } from '@/util';

/**
 * This class is a very simple way to resolve a component base from a path using the require syntax. If any
 * component has a `requirePath` property, `canResolveComponent` will return `true` and the file path will be loaded
 */
export default class ComponentRequirePathResolver {

	canResolveComponent(component) {
		if (component.requirePath) {
			return true;
		}

		return false;
	}

	resolveComponent(component) {
		var { requirePath, requireBase = '' } = component;
		var base = require(requireBase + requirePath);

		if (!base) {
			throw new Error(`RequireResolver::getComponentBase()- Failed to load component at path: "${ requirePath }"`);
		}

		if (base.__esModule) {
			if (base.default) {
				base = base.default;
			} else if (CommonUtils.has(base, component.name)) {
				base = base[component.name];
			}
		}

		return base;
	}
}
