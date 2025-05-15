const sol_contact = () => {
  const drawer = document.querySelector(`contact-drawer`);
  const arrow = drawer.querySelector(`arrow`);
  const links = document.querySelectorAll(`navigation-content a`);

  drawer.addEventListener("click", (e) => {
    if (arrow.contains(e.target)) return;

    drawer.classList.add(`active`);
  });

  console.log(drawer);

  links[1].addEventListener("click", () => {
    drawer.classList.add(`active`);
  });

  window.addEventListener("click", (e) => {
    if (!drawer.contains(e.target)) drawer.classList.remove(`active`);
  });

  arrow.addEventListener("click", () => {
    if (drawer.classList.contains(`active`)) {
      drawer.classList.remove(`active`);
    } else {
      drawer.classList.add(`active`);
    }
  });
};

export { sol_contact };
