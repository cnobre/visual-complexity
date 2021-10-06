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
      popperOptions: {
        modifiers: [{ name: 'offset', options: { offset: [0, 18] } }]
      },
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
    useModalOverlay: false,
    styleVariables: {
      // arrowSize:2.5,
      shepherdThemePrimary: "#1b5486",
      shepherdThemeSecondary: "#e5e5e5",
      //   shepherdButtonBorderRadius: 6,
      //   shepherdElementBorderRadius: 6,
      // //   shepherdHeaderBackground: '#eeeeee',
      // //   shepherdThemePrimary: '#9b59b6',
      //   useDropShadow: true,
      overlayOpacity: 0.1
    },
    when: {
        show() {
          const currentStepElement = shepherd.currentStep.el;
          const header = currentStepElement.querySelector('.shepherd-header');
          const progress = document.createElement('span');
          progress.style['margin-right'] = '315px';
          progress.innerText = `${shepherd.steps.indexOf(shepherd.currentStep) + 1}/${shepherd.steps.length}`;
          header.insertBefore(progress, currentStepElement.querySelector('.shepherd-cancel-icon'));        
        }
      }
  });

function setUp(){
    
}
let steps = [{
    title: 'Frequency of Symptoms',
    text: `This chart shows the percentage of patients that reported common COVID symptoms.`,
    attachTo: {
        element: '.horizontal-bars',
        on: 'right'
      },
    buttons: [
    //   {
    //     action() {
    //       return this.back();
    //     },
    //     classes: 'shepherd-button-secondary',
    //     text: 'Back'
    //   },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      },
    ],
    id: 's1'
  },
  {
    title: 'Question',
    text: `Select the bar representing people who reported cough as one of their symptoms.`,
    attachTo: {
        element: '.horizontal-bars',
        on: 'bottom'
      },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
    //   {
    //     action() {
    //       return this.next();
    //     },
    //     text: 'Next'
    //   },
    ],
    id: 's2'
  },
  {
    title: 'Good Job!',
    text: `These patients reported Fatigue and Anosmia as symptoms `,
    attachTo: {
        element: '.horizontal-bars',
        on: 'bottom'
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
            revealCol('#CoughAnosmiaFatigueVBar','#b')
            
        //   return this.next();
        },
        text: 'Next'
      },
    ],
    id: 's3'
  },
  {
    // title: 'These patients reported Fatigue, Anosmia, and Cough as symptoms',
    text: `These patients reported Fatigue, Anosmia, and Cough as symptoms`,
    attachTo: {
        element: '.horizontal-bars',
        on: 'bottom'
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
            revealCol('#FatigueVBar','#c')
        },
        text: 'Next'
      },
    ],
    id: 's4'
  },
  {
    title: 'These patients *only* reported Fatigue as a symptom',
    // text: `The top bars show... `,
    attachTo: {
      element: '.horizontal-bars',
      on: 'bottom'
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
            revealAllCols()
        },
        text: 'Next'
      },
    ],
    id: 's5'
  },
  {
    title: 'Question',
    text: `Select the bar representing people who reported cough as their ONLY symptom.`,
    attachTo: {
        element: '.setCircles',
        on: 'bottom'
      },
    buttons: [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
    //   {
    //     action() {
    //       return this.next();
    //     },
    //     text: 'Next'
    //   },
    ],
    id: 's6'
  },
  {
    title: 'Great Job! You are done!',
    // text: `Select the bar representing people who reported cough as their ONLY symptom.`,
    attachTo: {
        element: '.setCircles',
        on: 'bottom'
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
        text: 'Exit'
      },
    ],
    id: 's6'
  }]


