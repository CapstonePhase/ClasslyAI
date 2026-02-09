/**
 * Svelte action: smooth horizontal scrolling via wheel + pointer drag with momentum.
 */
export function horizontalScroll(node: HTMLElement) {
	const DRAG_THRESHOLD = 3;
	const FRICTION = 0.92;
	const MIN_VELOCITY = 0.5;
	const VELOCITY_SAMPLES = 5;
	const WHEEL_LERP = 0.18;
	const WHEEL_SETTLE = 0.5;

	let wheelTarget = 0;
	let wheelAnimId = 0;
	let wheelIdleTimer = 0;
	let wheelActive = false;

	function startWheelAnim() {
		if (wheelAnimId) return;
		node.style.scrollSnapType = 'none';
		node.style.scrollBehavior = 'auto';
		wheelAnimId = requestAnimationFrame(tickWheel);
	}

	function tickWheel() {
		const diff = wheelTarget - node.scrollLeft;
		if (Math.abs(diff) < WHEEL_SETTLE) {
			node.scrollLeft = wheelTarget;
			wheelAnimId = 0;
			scheduleSnapRestore();
			return;
		}
		node.scrollLeft += diff * WHEEL_LERP;
		wheelAnimId = requestAnimationFrame(tickWheel);
	}

	function scheduleSnapRestore() {
		clearTimeout(wheelIdleTimer);
		wheelIdleTimer = window.setTimeout(() => {
			node.style.scrollSnapType = '';
			node.style.scrollBehavior = '';
			wheelActive = false;
		}, 200);
	}

	function onWheel(e: WheelEvent) {
		const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		if (Math.abs(delta) < 1) return;

		const maxScroll = node.scrollWidth - node.clientWidth;
		if (!wheelActive) {
			wheelTarget = node.scrollLeft;
			wheelActive = true;
		}

		const newTarget = Math.max(0, Math.min(maxScroll, wheelTarget + delta));
		if (newTarget === wheelTarget) return;

		e.preventDefault();
		wheelTarget = newTarget;
		startWheelAnim();
		scheduleSnapRestore();
	}

	// Pointer drag with momentum
	let isDragging = false;
	let hasMoved = false;
	let lastX = 0;
	let scrollStart = 0;
	let startX = 0;
	let animId = 0;

	const samples: { dx: number; dt: number }[] = [];

	function stopMomentum() {
		if (animId) {
			cancelAnimationFrame(animId);
			animId = 0;
		}
		if (wheelAnimId) {
			cancelAnimationFrame(wheelAnimId);
			wheelAnimId = 0;
		}
		wheelActive = false;
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		const tag = (e.target as HTMLElement).tagName;
		if (tag === 'IFRAME' || tag === 'A' || tag === 'BUTTON' || tag === 'INPUT') return;

		stopMomentum();
		isDragging = true;
		hasMoved = false;
		startX = e.clientX;
		lastX = e.clientX;
		scrollStart = node.scrollLeft;
		samples.length = 0;

		node.setPointerCapture(e.pointerId);
		node.style.scrollSnapType = 'none';
		node.style.scrollBehavior = 'auto';
		node.style.userSelect = 'none';
		node.style.cursor = 'grabbing';
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;
		const dx = e.clientX - lastX;
		samples.push({ dx, dt: 1 });
		if (samples.length > VELOCITY_SAMPLES) samples.shift();
		lastX = e.clientX;

		const totalDx = e.clientX - startX;
		if (Math.abs(totalDx) > DRAG_THRESHOLD) hasMoved = true;
		node.scrollLeft = scrollStart - totalDx;
	}

	function onPointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;

		node.releasePointerCapture(e.pointerId);
		node.style.userSelect = '';
		node.style.cursor = '';

		if (hasMoved) {
			node.addEventListener(
				'click',
				(ev) => {
					ev.preventDefault();
					ev.stopPropagation();
				},
				{ capture: true, once: true }
			);
		}

		if (samples.length < 2) {
			resetStyles();
			return;
		}

		const avgVelocity = samples.reduce((sum, s) => sum + s.dx, 0) / samples.length;
		let velocity = -avgVelocity * 1.5;

		function tick() {
			if (Math.abs(velocity) < MIN_VELOCITY) {
				resetStyles();
				return;
			}
			node.scrollLeft += velocity;
			velocity *= FRICTION;

			if (node.scrollLeft <= 0 || node.scrollLeft + node.clientWidth >= node.scrollWidth - 1) {
				resetStyles();
				return;
			}
			animId = requestAnimationFrame(tick);
		}

		animId = requestAnimationFrame(tick);
	}

	function resetStyles() {
		animId = 0;
		node.style.scrollSnapType = '';
		node.style.scrollBehavior = '';
	}

	node.addEventListener('wheel', onWheel, { passive: false });
	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('pointermove', onPointerMove);
	node.addEventListener('pointerup', onPointerUp);
	node.addEventListener('pointercancel', onPointerUp);

	return {
		destroy() {
			stopMomentum();
			node.removeEventListener('wheel', onWheel);
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointermove', onPointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerUp);
		}
	};
}
