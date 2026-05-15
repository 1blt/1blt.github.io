// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "projects",
          description: "A selection of projects combining design, code, and systems thinking.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Selected work exploring data, design, and how systems shape the world around us.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "projects-sandbox",
          title: 'Sandbox',
          description: "Kinect-based augmented reality sandbox game | UVA School of Architecture",
          section: "Projects",handler: () => {
              window.location.href = "/projects/ar-sandbox/";
            },},{id: "projects-reefs",
          title: 'Reefs',
          description: "Computational design and digital fabrication workshop | DigitalFutures",
          section: "Projects",handler: () => {
              window.location.href = "/projects/artificial_reefs/";
            },},{id: "projects-garball",
          title: 'Garball',
          description: "Interactive garbology installation | Palos Verdes Art Center",
          section: "Projects",handler: () => {
              window.location.href = "/projects/garball/";
            },},{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/alan-wang", "_blank");
        },
      },];
