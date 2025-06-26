document.addEventListener("DOMContentLoaded", function () {
  // ======= Navbar Active Link Logic =======
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".fbs__net-navbar .scroll-link");
  function removeActiveClasses() {
    if (navLinks) navLinks.forEach((link) => link.classList.remove("active"));
  }
  function addActiveClass(currentSectionId) {
    const activeLink = document.querySelector(
      `.fbs__net-navbar .scroll-link[href="#${currentSectionId}"]`
    );
    if (activeLink) activeLink.classList.add("active");
  }
  function getCurrentSection() {
    let currentSection = null;
    let minDistance = Infinity;
    if (sections) {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight / 4);
        if (distance < minDistance && rect.top < window.innerHeight) {
          minDistance = distance;
          currentSection = section.getAttribute("id");
        }
      });
    }
    return currentSection;
  }
  function updateActiveLink() {
    const currentSectionId = getCurrentSection();
    if (currentSectionId) {
      removeActiveClasses();
      addActiveClass(currentSectionId);
    }
  }
  window.addEventListener("scroll", updateActiveLink);

  // ======= Portfolio Grid (Isotope) =======
  const portfolioGrid = document.querySelector('#portfolio-grid');
  if (portfolioGrid) {
    var iso = new Isotope("#portfolio-grid", {
      itemSelector: ".portfolio-item",
      layoutMode: "masonry",
    });
    if (iso) {
      iso.on("layoutComplete", updateActiveLink);
      imagesLoaded("#portfolio-grid", function () {
        iso.layout();
        updateActiveLink();
      });
    }
    var filterButtons = document.querySelectorAll(".filter-button");
    if (filterButtons) {
      filterButtons.forEach(function (button) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          var filterValue = button.getAttribute("data-filter");
          iso.arrange({ filter: filterValue });
          filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
          });
          button.classList.add("active");
          updateActiveLink();
        });
      });
    }
    updateActiveLink();
  }

  // ======= Navbar Hover Events =======
  const handleNavbarEvents = () => {
    const dropdowns = document.querySelectorAll('.navbar .dropdown');
    const dropstarts = document.querySelectorAll('.navbar .dropstart');
    const dropends = document.querySelectorAll('.navbar .dropend');
    if (window.innerWidth >= 992) {
      dropdowns.forEach(addHoverEvents);
      dropstarts.forEach(addHoverEvents);
      dropends.forEach(addHoverEvents);
    } else {
      dropdowns.forEach(removeHoverEvents);
      dropstarts.forEach(removeHoverEvents);
      dropends.forEach(removeHoverEvents);
    }
  };
  const handleResize = () => {
    const dropdowns = document.querySelectorAll('.navbar .dropdown');
    const dropstarts = document.querySelectorAll('.navbar .dropstart');
    const dropends = document.querySelectorAll('.navbar .dropend');
    dropdowns.forEach(removeHoverEvents);
    dropstarts.forEach(removeHoverEvents);
    dropends.forEach(removeHoverEvents);
    handleNavbarEvents();
  };
  window.addEventListener('resize', handleResize);
  handleNavbarEvents();

  // ======= Hero Photo Banner Scroll =======
  const heroImageList = document.querySelector('.hero__v6 .image-list');
  const heroPrevBtn = document.getElementById('hero-prev-slide');
  const heroNextBtn = document.getElementById('hero-next-slide');
  if (heroImageList && heroPrevBtn && heroNextBtn) {
    heroPrevBtn.addEventListener('click', function() {
      heroImageList.scrollBy({ left: -350, behavior: 'smooth' });
    });
    heroNextBtn.addEventListener('click', function() {
      heroImageList.scrollBy({ left: 350, behavior: 'smooth' });
    });
  }

  // ======= Chatbot Widget Logic =======
  const toggleBtn = document.getElementById('chatbot-toggle');
  const windowDiv = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  if (toggleBtn && windowDiv && closeBtn && form && input && messages) {
    toggleBtn.onclick = () => windowDiv.style.display = 'flex';
    closeBtn.onclick = () => windowDiv.style.display = 'none';
    form.onsubmit = function(e) {
      e.preventDefault();
      const userMsg = input.value.trim();
      if (!userMsg) return;
      appendMessage('You', userMsg, true);
      input.value = '';
      setTimeout(() => replyToUser(userMsg), 500);
    };
  }
  function appendMessage(sender, text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.style.margin = '0.5rem 0';
    msgDiv.style.textAlign = isUser ? 'right' : 'left';
    if (isUser) {
      msgDiv.innerHTML = `<span style="display:inline-block;background:#CCE8C9;color:#215C5C;padding:8px 14px;border-radius:14px;max-width:80%;word-break:break-word;">${text}</span>`;
    } else {
      msgDiv.innerHTML = `<span style="display:inline-block;background:#215C5C;color:#fff;padding:8px 14px;border-radius:14px;max-width:80%;word-break:break-word;">${text}</span>`;
    }
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }
  async function replyToUser(msg) {
    const lower = msg.toLowerCase();
    // Handle greetings directly
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!,. ]*$/i.test(lower)) {
      appendMessage('Bot', 'Hello! How can I help you today? You can ask me about our clinic, services, doctor, or treatments.', false);
      return;
    }
    // Handle service-related questions directly
    if (/(what|which|tell me|list|do you offer|provide).*(service|treatment|offer|procedure|speciality|specialty)/i.test(lower) ||
        /(services|treatments|procedures|specialities|specialties)/i.test(lower)) {
      appendMessage('Bot', `Astrid Clinic offers:\n• Acne & Scar Treatment\n• Hair Restoration\n• Laser Skin Rejuvenation\n• Skin Disease Management\n• Anti-Aging Solutions\n• Pigmentation Correction\n• Cosmetic Procedures\nIf you want details about any service, just ask!`, false);
      return;
    }
    // Handle doctor info
    if (/(doctor|dr\.? alekhya|about (the )?doctor|who.*doctor|who.*you|your qualification|your experience)/i.test(lower)) {
      appendMessage('Bot', 'Dr. Alekhya Rallapalli (MBBS, MD DVL) is a dermatologist and cosmetologist with over 10 years of expertise, offering advanced skin and hair treatments.', false);
      return;
    }
    // Handle location/address
    if (/(where.*located|location|address|how to reach|clinic location|find you)/i.test(lower)) {
      appendMessage('Bot', 'Astrid Dermatology and Cosmetology Clinic is located at Road No: 2, VVC Building, 3rd Floor, Road, opposite KBR Park, Banjara Hills, Hyderabad, Telangana 500033.', false);
      return;
    }
    // Handle contact info
    if (/(contact|phone|email|how.*contact|reach you|call you)/i.test(lower)) {
      appendMessage('Bot', 'You can contact us at +91 8495 898989. More details are in the Contact section of our website.', false);
      return;
    }
    // Handle timings/hours
    if (/(timing|hours|open|close|working hours|when.*open|when.*close)/i.test(lower)) {
      appendMessage('Bot', 'Our clinic hours are available in the Contact section. Please let us know if you need specific timings.', false);
      return;
    }
    // Handle safety/FDA
    if (/(safe|fda|approved|is it safe|safety|certified)/i.test(lower)) {
      appendMessage('Bot', 'Yes, all our procedures use FDA-approved technology and products. Patient safety and comfort are our top priorities.', false);
      return;
    }
    // Handle aftercare/follow-up
    if (/(aftercare|follow up|post treatment|care after|do you provide aftercare)/i.test(lower)) {
      appendMessage('Bot', 'Yes, we provide detailed aftercare instructions and schedule follow-up appointments to monitor your progress and ensure optimal results.', false);
      return;
    }
    // Handle pricing/cost/fee
    if (/(price|cost|fee|how much|charges|pricing|rate|rates|expensive|cheap|affordable)/i.test(lower)) {
      appendMessage('Bot', 'For pricing and packages, please contact us directly as costs may vary depending on the treatment.', false);
      return;
    }
    // Handle testimonials/reviews
    if (/(testimonial|review|patient story|feedback|what do patients say|success story|experience|client story)/i.test(lower)) {
      appendMessage('Bot', 'You can read real patient stories and testimonials in the Testimonials section of our website.', false);
      return;
    }
    // Handle FAQ
    if (/(faq|frequently asked|common question|question|doubt|doubts)/i.test(lower)) {
      appendMessage('Bot', 'You can find answers to common questions in our FAQ section. Feel free to ask me anything specific!', false);
      return;
    }
    // Handle appointment booking
    if (/(book|appointment|schedule|reserve|see.*doctor|consultation|visit).*(appointment|slot|consult|doctor|clinic)/i.test(lower) || /appointment|book.*visit|book.*consult/i.test(lower)) {
      appendMessage('Bot', 'You can book an appointment directly via WhatsApp: <a href="https://wa.me/918495898989?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Astrid%20Clinic." target="_blank" style="color:#fff;text-decoration:underline;">Chat with us on WhatsApp</a>.', false);
      return;
    }
    appendMessage('Bot', 'Thinking...', false);
    // Clinic context for better answers
    const context = `
      About: Astrid Dermatology and Cosmetology Clinic specializes in skin and hair aesthetics, offering state-of-the-art treatments to enhance appearance and promote healthy skin and hair. 
      Doctor: Dr. Alekhya Rallapalli, MBBS, MD DVL, 10+ years of expertise.
      Services: Acne & Scar Treatment, Hair Restoration, Laser Skin Rejuvenation, Skin Disease Management, Anti-Aging, Pigmentation Correction, and more.
      FAQ: All procedures use FDA-approved technology. Aftercare and follow-up are provided. Contact us for appointments and pricing.
    `;
    const prompt = `You are a helpful assistant for a dermatology clinic. Use the following info to answer user questions as accurately as possible:\n${context}\nIf the user asks about services, always list them clearly and concisely.\nUser: ${msg}\nBot:`;
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // <-- Replace with your key
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 120,
          temperature: 0.5,
          n: 1,
          stop: ['User:', 'Bot:']
        })
      });
      const data = await response.json();
      messages.lastChild.remove();
      if (data.choices && data.choices[0] && data.choices[0].text) {
        appendMessage('Bot', data.choices[0].text.trim(), false);
      } else {
        appendMessage('Bot', 'Sorry, I could not get an answer right now.', false);
      }
    } catch (e) {
      messages.lastChild.remove();
      appendMessage('Bot', 'Sorry, there was an error connecting to the AI service.', false);
    }
  }

  // ======= WhatsApp Form Submission =======
  const whatsappForm = document.getElementById("whatsapp-form");
  if (whatsappForm) {
    whatsappForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var message = document.getElementById("message").value.trim();
      var whatsappMessage = `Hello, my name is ${name}. ${message}`;
      var phoneNumber = "7396439736";
      var url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, "_blank");
    });
  }

  // ======= Coming Soon Countdown =======
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  if (daysEl && hoursEl && minutesEl && secondsEl) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const launchDate = new Date(`December 31, ${nextYear} 23:59:59`).getTime();
    const x = setInterval(function () {
      const now = new Date().getTime();
      const distance = launchDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      daysEl.innerText = days;
      hoursEl.innerText = hours;
      minutesEl.innerText = minutes;
      secondsEl.innerText = seconds;
      if (distance < 0) {
        clearInterval(x);
        document.querySelector(".countdown").innerText = "Launched!";
      }
    }, 1000);
  }

  // ======= Loader =======
  var loader = document.getElementById("loader");
  if (loader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("hide");
        document.body.classList.remove("loading");
      }, 1000);
    });
    document.body.classList.add("loading");
  }
});

// Helper functions for navbar hover events
function addHoverEvents(dropdown) {
  dropdown.addEventListener('mouseenter', showDropdown);
  dropdown.addEventListener('mouseleave', hideDropdown);
}
function removeHoverEvents(dropdown) {
  dropdown.removeEventListener('mouseenter', showDropdown);
  dropdown.removeEventListener('mouseleave', hideDropdown);
}
function showDropdown() {
  this.classList.add('show');
  this.querySelector('.dropdown-menu').classList.add('show');
}
function hideDropdown() {
  this.classList.remove('show');
  this.querySelector('.dropdown-menu').classList.remove('show');
}

const navbarScrollInit = () => {
  var navbar = document.querySelector(".fbs__net-navbar");

  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (navbar) {
    if (scrollTop > 0) {
      navbar.classList.add("active");
    } else {
      navbar.classList.remove("active");
    }
  }
};

const navbarInit = () => {
  document.querySelectorAll('.dropdown-toggle[href="#"]').forEach(function (el, index) {
    el.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });
};

// ======= Marquee =======
const logoMarqueeInit = () => {
  const wrapper = document.querySelector(".logo-wrapper");
  const boxes = gsap.utils.toArray(".logo-item");
  
  if (boxes.length > 0) {
    const loop = horizontalLoop(boxes, {
      paused: false,
      repeat: -1,
      speed: 0.25,
      reversed: false,
    });
    
    function horizontalLoop(items, config) {
      items = gsap.utils.toArray(items);
      config = config || {};
      let tl = gsap.timeline({
          repeat: config.repeat,
          paused: config.paused,
          defaults: { ease: "none" },
          onReverseComplete: () =>
            tl.totalTime(tl.rawTime() + tl.duration() * 100),
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap =
          config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth,
        curX,
        distanceToStart,
        distanceToLoop,
        item,
        i;
      gsap.set(items, {
        // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
          let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
          xPercents[i] = snap(
            (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
              gsap.getProperty(el, "xPercent")
          );
          return xPercents[i];
        },
      });
      gsap.set(items, { x: 0 });
      totalWidth =
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth *
          gsap.getProperty(items[length - 1], "scaleX") +
        (parseFloat(config.paddingRight) || 0);
      for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop =
          distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(
                ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
              ),
            },
            {
              xPercent: xPercents[i],
              duration:
                (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false,
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
          (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
          // if we're wrapping the timeline's playhead, make the proper adjustments
          vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
      }
      tl.next = (vars) => toIndex(curIndex + 1, vars);
      tl.previous = (vars) => toIndex(curIndex - 1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      return tl;
    }
  }
};

document.addEventListener("DOMContentLoaded", logoMarqueeInit);

// ======= Navbar Scroll =======
document.addEventListener("DOMContentLoaded", function () {
  logoMarqueeInit();
  navbarInit();
  window.addEventListener("scroll", navbarScrollInit);
});

// ======= Swiper =======
const swiperInit = () => {
  var swiper = new Swiper(".testimonialSwiper", {
    slidesPerView: 1,
    speed: 700,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 2.5,
        spaceBetween: 30,
      },
    },
    navigation: {
      nextEl: ".custom-button-next",
      prevEl: ".custom-button-prev",
    },
  });

  const progressCircle = document.querySelector(".autoplay-progress svg");
  const progressContent = document.querySelector(".autoplay-progress span");
  if (progressCircle && progressContent ) {
    var swiper2 = new Swiper(".sliderSwiper", {
      slidesPerView: 1,
      speed: 700,
      spaceBetween: 0,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".custom-button-next",
        prevEl: ".custom-button-prev",
      },

      on: {
        autoplayTimeLeft(s, time, progress) {
          progressCircle.style.setProperty("--progress", 1 - progress);
          progressContent.textContent = `${Math.ceil(time / 1000)}s`;
        }
      }
    });
  }

};

document.addEventListener("DOMContentLoaded", swiperInit);

// ======= Glightbox =======
const glightBoxInit = () => {
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
  });
};
document.addEventListener("DOMContentLoaded", glightBoxInit);

// ======= BS OffCanvass =======
const bsOffCanvasInit = () => {
  var offcanvasElement = document.getElementById("fbs__net-navbars");
  if (offcanvasElement) {
    offcanvasElement.addEventListener("show.bs.offcanvas", function () {
      document.body.classList.add("offcanvas-active");
    });

    offcanvasElement.addEventListener("hidden.bs.offcanvas", function () {
      document.body.classList.remove("offcanvas-active");
    });
  }
};
document.addEventListener("DOMContentLoaded", bsOffCanvasInit);

// ======= Back To Top =======
const backToTopInit = () => {
  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", backToTopInit);


// ======= Inline SVG =======
const inlineSvgInit = () => {
  const imgElements = document.querySelectorAll(".js-img-to-inline-svg");
  if (imgElements) {
    imgElements.forEach((imgElement) => {
      const imgURL = imgElement.getAttribute("src");

      fetch(imgURL)
        .then((response) => response.text())
        .then((svgText) => {
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
          const svgElement = svgDocument.documentElement;

          Array.from(imgElement.attributes).forEach((attr) => {
            if (attr.name !== "class") {
              svgElement.setAttribute(attr.name, attr.value);
            } else {
              const classes = attr.value
                .split(" ")
                .filter((className) => className !== "js-img-to-inline-svg");
              if (classes.length > 0) {
                svgElement.setAttribute("class", classes.join(" "));
              }
            }
          });

          imgElement.replaceWith(svgElement);
        })
        .catch((error) => console.error("Error fetching SVG:", error));
    });
  }
};

document.addEventListener("DOMContentLoaded", inlineSvgInit);

// ======= AOS =======
const aosInit = () => {
  AOS.init({
    duration: 800,
    easing: 'slide',
    once: true
  });
}
document.addEventListener("DOMContentLoaded", aosInit);

// ======= PureCounter =======
const pureCounterInit = () => {
  new PureCounter({
    selector: ".purecounter",
  });
}
document.addEventListener("DOMContentLoaded", pureCounterInit);