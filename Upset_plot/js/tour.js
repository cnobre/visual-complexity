// const tour = new Shepherd.Tour({
//   defaultStepOptions: {
//     cancelIcon: {
//       enabled: true
//     },
//     classes: 'shepherd-theme-custom',
//     scrollTo: { behavior: 'smooth', block: 'center' }
//   }
// });

var tour = new Shepherd.Tour({
    defaultStepOptions: {
      //   classes: "class-1 class-2",
      scrollTo: {
        behavior: "smooth",
        block: "center"
      },
      showCancelLink: false,
      tippyOptions: {
        maxWidth: "400px",
        popperOptions: {
          modifiers: {
            preventOverflow: {
              escapeWithReference: true
            }
          }
        }
      }
    },
    // classPrefix: prefix,
    // This should add the first tour step
    steps: [],
    useModalOverlay: true,
    styleVariables: {
      // arrowSize:2.5,
      shepherdThemePrimary: "#1b5486",
      shepherdThemeSecondary: "#e5e5e5",
      //   shepherdButtonBorderRadius: 6,
      //   shepherdElementBorderRadius: 6,
      // //   shepherdHeaderBackground: '#eeeeee',
      // //   shepherdThemePrimary: '#9b59b6',
      //   useDropShadow: true,
      overlayOpacity: 0.25
    }
  });

let steps = [{
    title: 'Creating a Shepherd Tour',
    text: `Creating a Shepherd tour is easy. too!\
    Just create a \`Tour\` instance, and add as many steps as you want.`,
    attachTo: {
      element: '#FatigueBar',
      on: 'left'
    },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ],
    id: 'creating'
  }]


