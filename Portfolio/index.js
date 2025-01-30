gsap.registerPlugin(ScrollTrigger);


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
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#body").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

function cursor(dets) {

  // const cursor = document.querySelector('#cursor');
  // const hero = document.querySelector('#hero');
  const name = document.querySelector('#name');
  const nav = document.querySelector('.nav');

  // hero.addEventListener("mouseenter", () => {
  //   Shery.mouseFollower(cursor, {
  //     // opacity: 1,
  //     ease: "power2.out",
  //     duration: 0.5,
  //   });
  // });

  // hero.addEventListener("mouseleave", () => {
  //   Shery.mouseFollower(cursor, {
  //     opacity: 0,
  //   });
  // });

  // Select all the letters inside the .magnet1 class


  let FollowBox = "#Wrap .FollowBox";
  gsap.set(FollowBox, {
      xPercent: -50, yPercent: -50, scale: 0,
  });
  


  window.addEventListener('mousemove', e => {
      gsap.to(FollowBox, 0.5, {
          x: e.clientX, y: e.clientY, stagger: 0.2, ease: "power2.Out",
      });
  
      let TL = gsap.timeline({
          defaults: { duration: 1, ease: "power2.Out", },
      })
      TL.to(FollowBox, {
          scale: 1,
          stagger: { amount: 0.5, from: "start", ease: "power2.Out", }
      })
      TL.to(FollowBox, {
          scale: 0,
          stagger: { amount: 0.5, from: "end", ease: "power2.Out", }
      },"<0.5")

      nav.addEventListener("mouseenter", () => {
        gsap.set(FollowBox, {
          opacity: 0,
        });
      });
      nav.addEventListener("mouseleave", () => {
        gsap.set(FollowBox, {
          opacity: 1,
        });
      });
  });
  


}

cursor();

function makeMagnet() {

  Shery.makeMagnet(".magnet1" /* Element to target.*/, {
    //Parameters are optional.
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

  Shery.makeMagnet(".magnet2" /* Element to target.*/, {
    //Parameters are optional.
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

}

makeMagnet();

function heroText() {

  var timeLine = gsap.timeline();

  timeLine.from(".nav1", {
    y:-20,
    duration: 0.4,
    opacity: 0,
  });

  timeLine.from(".nav2", {
    y:-20,
    duration: 0.5,
    opacity: 0,
  });

  timeLine.from(".nav3", {
    y:-20,
    duration: 0.6,
    opacity: 0,
  });

  Shery.textAnimate(".magnet1" /* Element to target.*/, {
    //Parameters are optional.
    style: 2,
    y: 15,
    delay: 0.6,
    duration: 3,
    ease: "power2.inOut",
    multiplier: 0.1,
  });

  Shery.textAnimate(".magnet2" /* Element to target.*/, {
    //Parameters are optional.
    style: 2,
    y: 15,
    delay: 0.6,
    duration: 3,
    ease: "power2.inOut",
    multiplier: 0.1,
  });

}

heroText();

