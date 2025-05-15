const dragging_touch = (i, event) => {
	let carousel_object = window.sol_components["carousel"][i];
	let carousel = carousel_object["carousel"];

	if (!carousel.classList.contains(`dragging`)) return;

	let inner = carousel_object["inner"];
	let leading = carousel_object["leading"];
	let max_leading = carousel_object["max_leading"];

	let movement = event.touches[0].clientX;
	let old =
		window
			.getComputedStyle(inner)
			.getPropertyValue(`transform`)
			.split(",")[4] ?? 0;
	old = parseInt(old);
	let easing = 0;
	let start = carousel_object["start"] ?? 0;

	carousel_object["end_time"] = window.performance.now();

	let direction = 0;

	if (movement > 0) {
		direction = -1;
	} else if (movement < 0) {
		direction = 1;
	}

	let delta_time = carousel_object["end_time"] - carousel_object["start_time"];
	let velocity = Math.round((movement * delta_time) / 100);

	if (velocity > 2) {
		velocity = 2;
	}

	let new_pos = movement - start - easing + parseInt(old);
	let extra = movement - start - easing * velocity * direction;
	new_pos = new_pos + extra * 0.25;

	window.throttler(
		() => {
			carousel_object["start_time"] = window.performance.now();
		},
		15,
		`carousel_start_${i}`
	);

	if (new_pos + leading <= 0 && new_pos >= max_leading * -1) {
		inner.style.transform = `translate3d(${new_pos}px, 0, 0)`;
	}
	window.sol_components["carousel"][i]["start"] = movement;
};

const dragging = (i, event) => {
	let carousel_object = window.sol_components["carousel"][i];

	if (!carousel_object["carousel"].classList.contains(`dragging`)) return;

	let inner = carousel_object["inner"];
	let leading = carousel_object["leading"];
	let max_leading = carousel_object["max_leading"];

	let movement = carousel_object["start"] - event.clientX;
	carousel_object["end_time"] = window.performance.now();

	let old =
		window
			.getComputedStyle(inner)
			.getPropertyValue(`transform`)
			.split(",")[4] ?? 0;
	old = parseInt(old);

	let direction = 0;

	if (movement > 0) {
		direction = -1;
	} else if (movement < 0) {
		direction = 1;
	}

	let delta_time = carousel_object["end_time"] - carousel_object["start_time"];
	let velocity = Math.round((movement * delta_time) / 100);

	if (velocity > 2) {
		velocity = 2;
	}

	let new_pos = old - movement;
	let extra = movement * velocity * direction;
	new_pos = new_pos + extra * 0.25;

	carousel_object["start"] = event.clientX;
	window.throttler(
		() => {
			carousel_object["start_time"] = window.performance.now();
		},
		15,
		`carousel_start_${i}`
	);

	if (new_pos <= leading * -1 && new_pos >= max_leading * -1) {
		inner.style.transform = `translate3d(${new_pos}px, 0, 0)`;
	}
};

const click_up_or_leave = (i, event) => {
	let carousel_object = window.sol_components["carousel"][i];
	let carousel = carousel_object["carousel"];

	if (carousel.contains(event.target))
		window.throttler(
			carousel.classList.remove(`dragging`),
			50,
			`carousel_end_${i}`
		);

	carousel_object["end_time"] = window.performance.now();

	window.throttler(
		carousel.classList.remove(`dragging`),
		50,
		`carousel_end_${i}`
	);
};

const click_down = (i, event) => {
	let carousel_object = window.sol_components["carousel"][i];
	let carousel = carousel_object["carousel"];

	carousel_object["start"] = event.touches
		? event.touches[0].clientX
		: event.clientX - carousel_object["inner_pos"].left;

	carousel_object["start_time"] = window.performance.now();

	window.throttler(carousel.classList.add(`dragging`), 50, `carousel_end_${i}`);
};

const carousel_event_listener = (i) => {
	let carousel_object = window.sol_components["carousel"][i];

	let carousel = carousel_object["carousel"];
	let pos = (carousel_object["pos"] = carousel.getBoundingClientRect());

	let inner = (carousel_object["inner"] = carousel.querySelector(
		`sol-carousel-items, [sol-carousel-items]`
	));
	let inner_pos = (carousel_object["inner_pos"] =
		inner.getBoundingClientRect());

	let leading = (carousel_object["leading"] =
		-inner?.children[0].getBoundingClientRect().width / 2 ?? 0);
	let max_leading = (carousel_object["max_leading"] =
		-leading + inner.scrollWidth - inner_pos.width);
	let start = (carousel_object["start"] = 0);

	if (pos.width > inner_pos.width) {
		leading = 0;
		max_leading = 0;
	}

	carousel.addEventListener("mousemove", dragging.bind(null, i), false);
	carousel.addEventListener("mousedown", click_down.bind(null, i), false);
	carousel.addEventListener("mouseup", click_up_or_leave.bind(null, i), false);
	carousel.addEventListener(
		"mouseleave",
		click_up_or_leave.bind(null, i),
		false
	);

	carousel.addEventListener("touchmove", dragging_touch.bind(null, i), false);
	carousel.addEventListener("touchstart", click_down.bind(null, i), false);
	carousel.addEventListener("touchend", click_up_or_leave.bind(null, i), false);
	carousel.addEventListener(
		"touchleave",
		click_up_or_leave.bind(null, i),
		false
	);
};

const sol_carousel = () => {
	let cars = document.querySelectorAll(`sol-carousel, [sol-carousel]`);

	if (!window.sol_components["carousel"])
		window.sol_components["carousel"] = [];

	for (let i = 0; i < cars.length; i++) {
		if (!window.sol_components["carousel"][i])
			window.sol_components["carousel"][i] = { carousel: cars[i] };

		carousel_event_listener(i);

		window.addEventListener("resize", () => {
			let carousel_object = window.sol_components["carousel"][i];

			let carousel = carousel_object["carousel"];
			let pos = (carousel_object["pos"] = carousel.getBoundingClientRect());

			let inner = (carousel_object["inner"] = carousel.querySelector(
				`sol-carousel-items, [sol-carousel-items]`
			));
			let inner_pos = (carousel_object["inner_pos"] =
				inner.getBoundingClientRect());

			let leading = (carousel_object["leading"] =
				-inner?.children[0].getBoundingClientRect().width / 2 ?? 0);
			let max_leading = (carousel_object["max_leading"] =
				-leading + inner.scrollWidth - inner_pos.width);
			let start = (carousel_object["start"] = 0);

			if (pos.width > inner_pos.width) {
				window.sol_components["carousel"][i]["leading"] = 0;
				window.sol_components["carousel"][i]["max_leading"] = 0;
			}

			let old =
				window
					.getComputedStyle(inner)
					.getPropertyValue(`transform`)
					.split(",")[4] ?? 0;

			if (old < leading)
				window.sol_components["carousel"][i][
					"inner"
				].style.transform = `translate3d(1px, 0, 0)`;
		});
	}
};

export { sol_carousel };
