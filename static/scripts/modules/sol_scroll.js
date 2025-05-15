const sol_smooth_scroll = () => {
  let speed = 500;
  let increments = 60;
  let steps = 3;
  let divided = speed / increments;

  window.sol_components["scroll"] = {
    scrollings: null,
    speed: null,
    old_position: window.scrollY ?? 0,
  };

  window.addEventListener(
    `scroll`,
    (e) => {
      if (window.sol_components["scroll"]["scrollings"] != null) {
        e.preventDefault();
        return;
      }

      window.sol_components["scroll"]["old_position"] = window.scrollY;
    },
    {
      passive: false,
    },
  );

  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (window.sol_components["scroll"]["speed"] == null) {
        speed = Math.abs(Math.round(e.deltaY * 2));
        increments = Math.round(speed / 10);
        divided = Math.round(speed / increments);
        window.sol_components["scroll"]["speed"] = speed;
      }

      window.throttler(
        () => {
          if (window.sol_components["scroll"]["scrollings"] != null) {
            clearInterval(window.sol_components["scroll"]["scrollings"]);
          }

          let curr = window.sol_components["scroll"]["old_position"];
          let multiplier = 1;

          if (e.deltaY > 0) {
            multiplier = 1;
          } else {
            multiplier = -1;
          }

          let wish = curr + speed * multiplier;

          window.sol_components["scroll"]["scrollings"] = setInterval(() => {
            if (multiplier < 0) {
              if (curr <= wish) {
                clearInterval(window.sol_components["scroll"]["scrollings"]);
                window.sol_components["scroll"]["old_position"] =
                  window.scrollY;
              }
            } else if (multiplier > 0) {
              if (curr >= wish) {
                clearInterval(window.sol_components["scroll"]["scrollings"]);
                window.sol_components["scroll"]["old_position"] =
                  window.scrollY;
              }
            }

            let calc = curr + divided * multiplier;

            window.scrollTo({
              top: calc,
              left: 0,
              behavior: "instant",
            });

            window.sol_components["scroll"]["old_position"] = calc;
            curr = calc;
          }, steps);
        },
        increments,
        "window_scroll",
      );

      window.sol_components["scroll"]["old_position"] = window.scrollY;
    },
    {
      passive: false,
    },
  );
};

export { sol_smooth_scroll };
