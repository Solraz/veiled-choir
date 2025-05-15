const stagger_text = (container) => {
  let text = container.querySelectorAll(`h3, p`);
  let timing_index = 0;
  let result = [];

  for (let t = 0; t < text.length; t++) {
    let split = text[t].innerText.split(" ");
    result[t] = [];

    for (let i = 0; i < split.length; i += 4) {
      const subArr = split.slice(i, i + 4);
      result[t].push(subArr.join(" "));
    }

    text[t].innerHTML = "";

    result[t].forEach((written) => {
      text[t].innerHTML +=
        `<span class="sub-description" style="animation-delay: ${
          240 * timing_index
        }ms;">${written} </span>`;

      timing_index++;
    });
  }
};

const initiate = (i) => {
  const object = window.sol_components["navigation"][i];
  const holder = object["holder"];
  const descriptions = object["descriptions"];
  const images = object["images"];

  holder.classList.add(`seen`);

  let active_desc = descriptions[0].parentElement?.querySelector(`.active`);
  if (!active_desc) {
    active_desc = descriptions[0];
    window.debouncer(
      () => {
        stagger_text(active_desc);
        active_desc.classList.add(`active`);
      },
      15,
      "active_description",
    );
  }

  let active_img = images[0].parentElement?.querySelector(`.active`);
  if (!active_img) {
    active_img = images[0];
    active_img.classList.add(`active`);
  }

  window.debouncer(
    (i) => {
      const object = window.sol_components["navigation"][i];
      const holder = object["holder"];

      holder.classList.add(`remove-transition-delays`);

      if (!object.hasResize) {
        sol_showcase_resize(i);
      }
      object.hasResize = true;
    },
    160 * 7,
    `remove-transition-delays-${i}`,
    [i],
  );
};

const navigation = (i) => {
  window.sol_components["navigation"][i]["sizes"] = [];
  window.sol_components["navigation"][i]["images"]["sizes"] = [];
  window.sol_components["navigation"][i]["descriptions"]["sizes"] = [];
  window.sol_components["navigation"][i]["names"][0].classList.add(`active`);
  window.sol_components["navigation"][i]["indicators"][0].classList.add(
    `active`,
  );

  for (
    let ii = 0;
    ii < window.sol_components["navigation"][i]["names"].length;
    ii++
  ) {
    if (!window.sol_components["navigation"][i]["sizes"]["parent"]) {
      const parent_size =
        window.sol_components["navigation"][i]["names"][
          ii
        ].parentElement.getBoundingClientRect();
      window.sol_components["navigation"][i]["sizes"]["parent"] = {
        x: parent_size.x,
        width: parent_size.width,
      };
    }
    const size =
      window.sol_components["navigation"][i]["names"][
        ii
      ].getBoundingClientRect();
    window.sol_components["navigation"][i]["sizes"][ii] = {
      x: size.x,
      width: size.width,
      height: size.height,
    };

    let calc =
      window.sol_components["navigation"][i]["sizes"][0].x -
      window.sol_components["navigation"][i]["sizes"]["parent"].x -
      2;

    window.sol_components["navigation"][i]["pill"].style.left = `${calc + 1}px`;
    window.sol_components["navigation"][i]["pill"].style.bottom = `-1px`;
    window.sol_components["navigation"][i]["pill"].style.height =
      `${window.sol_components["navigation"][i]["sizes"][ii].height}px`;
    window.sol_components["navigation"][i]["pill"].style.width =
      `${window.sol_components["navigation"][i]["sizes"][0].width + 2}px`;

    const image_parent_pos =
      window.sol_components["navigation"][i]["images"][
        "parent"
      ].getBoundingClientRect();
    window.sol_components["navigation"][i]["images"]["sizes"]["parent"] = {
      x: image_parent_pos.x,
      width: image_parent_pos.width,
    };
    const image_container_size =
      window.sol_components["navigation"][i]["images"][
        ii
      ].getBoundingClientRect();
    const image =
      window.sol_components["navigation"][i]["images"][ii].children[0];
    const image_size =
      window.sol_components["navigation"][i]["images"][
        ii
      ].children[0].getBoundingClientRect();
    window.sol_components["navigation"][i]["images"]["sizes"][ii] = {
      x:
        image_container_size.x -
        window.sol_components["navigation"][i]["images"]["sizes"]["parent"].x,
      width: image.naturalWidth,
      height: image.naturalHeight / 3,
    };
    window.sol_components["navigation"][i]["images"]["parent"].style.height =
      `${window.sol_components["navigation"][i]["images"]["sizes"][0].height}px`;

    const desc_parent_pos =
      window.sol_components["navigation"][i]["descriptions"][
        "parent"
      ].getBoundingClientRect();
    window.sol_components["navigation"][i]["descriptions"]["sizes"]["parent"] =
      {
        y: desc_parent_pos.y,
        width: desc_parent_pos.width,
      };
    const desc_container_size =
      window.sol_components["navigation"][i]["descriptions"][
        ii
      ].getBoundingClientRect();
    const desc_size =
      window.sol_components["navigation"][i]["descriptions"][
        ii
      ].getBoundingClientRect();

    // window.sol_components["navigation"][i]["descriptions"][
    //   "parent"
    // ].style.minHeight = `${ii + 1}00%`;

    let y_calc =
      desc_container_size.y -
      window.sol_components["navigation"][i]["descriptions"]["sizes"]["parent"]
        .y;

    if (ii == 0) {
      y_calc = 0;
    }

    window.sol_components["navigation"][i]["descriptions"]["sizes"][ii] = {
      y: y_calc,
      width: desc_size.width,
      height: desc_size.height,
    };
    // window.sol_components["navigation"][i]["descriptions"][
    //   "parent"
    // ].parentElement.style.height =
    //   `${window.sol_components["navigation"][i]["descriptions"]["sizes"][ii].height}px`;

    window.sol_components["navigation"][i]["images"]["current_active"] = 0;
    window.sol_components["navigation"][i]["descriptions"]["current_active"] =
      0;

    if (!window.sol_components["navigation"][i]["names"][ii].hasClick) {
      window.sol_components["navigation"][i]["names"][ii].addEventListener(
        "click",
        (event) => {
          /*
           * Active names changing
           */
          let active_names =
            window.sol_components["navigation"][i]["names"][
              ii
            ].parentElement.querySelector(`.active`);
          active_names?.classList.remove(`active`);

          window.sol_components["navigation"][i]["names"][ii].classList.add(
            `active`,
          );

          /*
           * Active indicator changing
           */
          let active_indicator =
            window.sol_components["navigation"][i]["indicators"][
              ii
            ].parentElement.querySelector(`.active`);
          active_indicator?.classList.remove(`active`);

          window.sol_components["navigation"][i]["indicators"][
            ii
          ].classList.add(`active`);

          /*
           * Active image changing
           */
          let active_image =
            window.sol_components["navigation"][i]["images"][
              ii
            ].parentElement.querySelector(`.active`);
          active_image?.classList.remove(`active`);

          window.sol_components["navigation"][i]["images"][ii].classList.add(
            `active`,
          );

          window.sol_components["navigation"][i]["images"]["current_active"] =
            ii;

          window.sol_components["navigation"][i]["images"][
            "parent"
          ].style.transform =
            `translate3d(-${window.sol_components["navigation"][i]["images"]["sizes"][ii].x}px, 0, 0)`;
          window.sol_components["navigation"][i]["images"][
            "parent"
          ].style.height =
            `${window.sol_components["navigation"][i]["images"]["sizes"][ii].height}px`;

          /*
           * Active description changing
           */
          let active_description =
            window.sol_components["navigation"][i]["descriptions"][
              ii
            ].parentElement.querySelector(`.active`);
          active_description?.classList.remove(`active`);

          window.sol_components["navigation"][i]["descriptions"][
            ii
          ].classList.add(`active`);

          window.sol_components["navigation"][i]["descriptions"][
            "current_active"
          ] = ii;

          window.sol_components["navigation"][i]["descriptions"][
            "parent"
          ].style.transform =
            `translate3d(0, -${window.sol_components["navigation"][i]["descriptions"]["sizes"][ii].y}px, 0)`;
          // descriptions["parent"].parentElement.style.height =
          //   `${window.sol_components["navigation"][i]["descriptions"]["sizes"][ii].height}px`;
          stagger_text(
            window.sol_components["navigation"][i]["descriptions"][
              window.sol_components["navigation"][i]["descriptions"][
                "current_active"
              ]
            ],
          );

          /*
           * Moving pill
           */
          let calc =
            window.sol_components["navigation"][i]["sizes"][ii].x -
            window.sol_components["navigation"][i]["sizes"]["parent"].x -
            4;

          window.sol_components["navigation"][i]["pill"].style.left =
            `${calc + 1}px`;
          window.sol_components["navigation"][i]["pill"].style.bottom = `-1px`;
          window.sol_components["navigation"][i]["pill"].style.height =
            `${window.sol_components["navigation"][i]["sizes"][ii].height}px`;
          window.sol_components["navigation"][i]["pill"].style.width =
            `${window.sol_components["navigation"][i]["sizes"][ii].width + 6}px`;
        },
      );
    }
    window.sol_components["navigation"][i]["names"][ii].hasClick = true;
  }
};

const sol_showcase_resize = (i) => {
  const object = window.sol_components["navigation"][i];
  const images = object["images"];
  const descriptions = object["descriptions"];
  const image_sizes = object["images"]["sizes"];
  const description_sizes = object["descriptions"]["sizes"];

  window.addEventListener("resize", (event) => {
    window.throttler(
      () => {
        for (let ii = 0; ii < images.length; ii++) {
          const image_parent_pos = images["parent"].getBoundingClientRect();
          object["images"]["sizes"]["parent"] = {
            x: image_parent_pos.x,
            width: image_parent_pos.width,
          };
          const image_container_size = images[ii].getBoundingClientRect();
          const image_size = images[ii].children[0].getBoundingClientRect();
          window.sol_components["navigation"][i]["images"]["sizes"][ii] = {
            x: image_container_size.x - images["sizes"]["parent"].x,
            width: image_size.width,
            height: image_size.height,
          };

          const desc_parent_pos =
            descriptions["parent"].getBoundingClientRect();
          object["descriptions"]["sizes"]["parent"] = {
            y: desc_parent_pos.y,
            width: desc_parent_pos.width,
          };
          const desc_container_size = descriptions[ii].getBoundingClientRect();
          const desc_size = descriptions[ii].getBoundingClientRect();

          let y_calc =
            desc_container_size.y - descriptions["sizes"]["parent"].y;

          if (ii == 0) {
            y_calc = 0;
          }

          window.sol_components["navigation"][i]["descriptions"]["sizes"][ii] =
            {
              y: y_calc,
              width: desc_size.width,
              height: desc_size.height,
            };
        }

        images["parent"].style.transform = `translate3d(-${
          window.sol_components["navigation"][i]["images"]["sizes"][
            window.sol_components["navigation"][i]["images"]["current_active"]
          ].x
        }px, 0, 0)`;
        images["parent"].style.height = `${
          window.sol_components["navigation"][i]["images"]["sizes"][
            window.sol_components["navigation"][i]["images"]["current_active"]
          ].height
        }px`;

        descriptions["parent"].style.transform = `translate3d(0, -${
          window.sol_components["navigation"][i]["descriptions"]["sizes"][
            descriptions["current_active"]
          ].y
        }px, 0)`;
        descriptions["parent"].parentElement.style.height = `${
          window.sol_components["navigation"][i]["descriptions"]["sizes"][
            descriptions["current_active"]
          ].height
        }px`;
      },
      25,
      `performance_resize_showcase-${i}`,
    );
  });
};

const sol_showcase = () => {
  const navigations = document.querySelectorAll(`work`);

  window.sol_components["navigation"] = [];

  for (let i = 0; i < navigations.length; i++) {
    let n = navigations[i];

    let object = (window.sol_components["navigation"][i] = []);

    object["holder"] = n;
    object["pill"] = n.querySelector(`previous-work-navigation-pill`);
    object["names"] = n.querySelectorAll(
      `previous-work-navigation-names > span`,
    );
    object["indicators"] = n.querySelectorAll(
      `previous-work-navigation-indicators > div`,
    );
    object["descriptions"] = n.querySelectorAll(`.description-content`);
    object["descriptions"]["parent"] = object["descriptions"][0].parentElement;
    object["images"] = n.querySelectorAll(
      `.image-container > .inner-image-container`,
    );
    object["images"]["parent"] = object["images"][0].parentElement;

    let options = {
      root: document.querySelector("work-content"),
      rootMargin: "0px",
      threshold: 0.4,
    };
    let observer = new IntersectionObserver((entries, observer) => {
      for (let e of entries) {
        if (e.isIntersecting) {
          window.debouncer(initiate, 75, `initiate-work-${i}`, [i]);
        }
      }
    }, options);
    observer.observe(n);

    navigation(i);
  }
};

export { sol_showcase };
