const sol_menu = () => {
  const links = document.querySelectorAll(`navigation-content a`);
  const previous_work = document.querySelector(`previous-works`);

  links[0].addEventListener("click", () => {
    previous_work.scrollIntoView({ block: "start", behavior: "smooth" });
  });
};

export { sol_menu };
