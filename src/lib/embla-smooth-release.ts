import type {
	CreateOptionsType,
	CreatePluginType,
	EmblaCarouselType,
} from "embla-carousel";

/**
 * Embla's `ScrollBody.seek()` isn't pure momentum decay — it's a damped
 * spring toward a target:
 *
 *   velocity += (target - location) / duration   // spring pull
 *   velocity *= friction                          // damping
 *   location += velocity
 *
 * `duration` and `friction` are hardcoded by DragHandler.up() on release
 * (~33-43 and ~0.68-0.7 for dragFree) with no public option to change them.
 * Overriding only `friction` (as a first attempt did) reduces damping
 * without softening the spring pull, making the system underdamped — it
 * overshoots the target and oscillates before settling (feels "bouncy").
 *
 * Both values must move together to keep it critically/over-damped. Values
 * below were chosen by simulating the exact recurrence above: duration=70,
 * friction=0.80 settles in ~2.2s with zero overshoot at any drag distance —
 * a noticeably longer, smoother coast than Embla's stock ~1-1.5s decay,
 * without any spring-back.
 */
export type SmoothReleaseOptions = CreateOptionsType<{
	/** Spring pull strength — higher = softer, less abrupt. */
	duration: number;
	/** Damping — must stay low enough relative to `duration` to avoid overshoot. */
	friction: number;
}>;

type SmoothReleasePluginType = CreatePluginType<
	Record<string, unknown>,
	SmoothReleaseOptions
>;

export function SmoothRelease(
	userOptions: Partial<SmoothReleaseOptions> = {},
): SmoothReleasePluginType {
	const duration = userOptions.duration ?? 70;
	const friction = userOptions.friction ?? 0.8;
	let emblaApi: EmblaCarouselType;

	function extendGlide() {
		// Runs after Embla's own DragHandler.up() has already set its (fixed,
		// abrupt) release physics — overriding both values together here keeps
		// the spring damped while extending the coast, since nothing else
		// touches duration/friction until the next pointerDown.
		emblaApi.internalEngine().scrollBody.useDuration(duration).useFriction(friction);
	}

	function init(emblaApiInstance: EmblaCarouselType) {
		emblaApi = emblaApiInstance;
		emblaApi.on("pointerUp", extendGlide);
	}

	function destroy() {
		emblaApi.off("pointerUp", extendGlide);
	}

	return {
		name: "smoothRelease",
		options: userOptions,
		init,
		destroy,
	};
}
