const bg_parallax = (banner, bg, cont) => {
  const speed = 1.235;

  if (!window.sol_components["banner"].hasScroll) {
    let options = {
      root: banner,
      rootMargin: "0px",
      threshold: 0.9,
    };
    let observer = new IntersectionObserver((entries, observer) => {
      for (let e of entries) {
        window.addEventListener("scroll", (event) => {
          if (e.isIntersecting) {
            window.throttler(
              () => {
                let pos = bg.offsetHeight;
                let scroll = window.scrollY;

                let calc_cont = (scroll / pos) * 100 * speed;

                cont.style.transform = `translate3d(0, ${calc_cont}%, 0)`;
              },
              3,
              "banner_scroll"
            );
          }
        });
      }
    }, options);
    observer.observe(bg);
  }
  window.sol_components["banner"].hasScroll = true;
};

const sol_parallax = () => {
  let banner = document.querySelector(`banner`);
  let bg = banner.querySelector(`.background-holder`);
  let container = banner.querySelector(`.inner`);

  window.sol_components["banner"] = {
    banner,
    bg,
    container,
  };

  bg_parallax(banner, bg, container);
};

export { sol_parallax };
