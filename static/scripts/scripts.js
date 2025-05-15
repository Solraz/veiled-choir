import {
  queuer_preparator,
  throttle,
  debounce,
} from "./modules/performance.js";
import { init_component_states } from "./modules/sol-components.js";

import { sol_contact } from "./modules/sol_contact.js";
import { sol_menu } from "./modules/sol_menu.js";
import { sol_parallax } from "./modules/sol_parallax.js";
import { sol_smooth_scroll } from "./modules/sol_scroll.js";
import { sol_showcase } from "./modules/sol_showcase.js";

window.addEventListener("load", () => {
  queuer_preparator();
  window.throttler = throttle;
  window.debouncer = debounce;

  init_component_states();

  sol_parallax();
  sol_smooth_scroll();
  sol_contact();
  sol_menu();

  window.sol_showcase = sol_showcase;

  htmx.onLoad(() => {
    // sol_showcase();
  });
});
