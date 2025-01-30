gsap.registerPlugin(ScrollTrigger);

function loco() {

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#body"),
    smooth: true
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#body", {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#body").style.transform ? "transform" : "fixed"
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();

}

loco();

function hero() {

  Shery.mouseFollower();

  Shery.textAnimate(".magnet1", {
    style: 2,
    y: 10,
    delay: 0.2,
    duration: 2.5,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });

  Shery.textAnimate(".magnet2", {
    style: 1,
    y: 10,
    delay: 0.2,
    duration: 3,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.05,
  });

  Shery.makeMagnet(".magnet2" /* Element to target.*/, {
    //Parameters are optional.
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

  gsap.to("#hero #img", {
    width: "100%",
    scrollTrigger: {
      trigger: "#hero",
      scroller: "#body",
      // markers:true,
      start: "top 5%",
      end: "top -40%",
      scrub: true,
      // pin: true
    }
  });

  gsap.to('#body', {
    backgroundColor: "white",
    scrollTrigger: {
      trigger: "#hero #img",
      scroller: "#body",
      start: "50% 20%",
      end: "bottom bottom",
      scrub: 5,
      // markers: true,
    }
  })

}

hero();

function pages() {

  // const myText = new SplitType(".line1");

  // gsap.to(".char", {
  //   y: 0,
  //   stagger: 0.5,
  //   delay: 0.2,
  //   duration: 1,
  //   yoyo: true,
  // });

  const split = new SplitType("#page2 h1", {
    types: "words, chars",
  });

  const tl = gsap
    .timeline({
      duration: 5,
      scrollTrigger: {
        trigger: "#img",
        scroller: "#body",
        start: "90% 40%",
        end: "bottom bottom",
        // markers: true,
        scrub: 5,
      },
    })
    .set(
      split.chars,
      {
        duration: 2.5,
        ease: "none",
        color: "black",
        stagger: 1,
      },
      // 0.1,
    )


    

}

pages();