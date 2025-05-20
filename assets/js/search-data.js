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
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Selected work exploring data, design, and how systems shape the world around us.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A selection of projects combining design, code, and systems thinking.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "news-dissertation-defense",
          title: 'Dissertation defense',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2023-05-30_defense/";
            },},{id: "news-i-started-my-postdoctoral-fellowship-at-the-biocomplexity-institute-social-and-decision-analytics-division",
          title: 'I started my postdoctoral fellowship at the Biocomplexity Institute, Social and Decision Analytics...',
          description: "",
          section: "News",},{id: "news-we-published-our-work-smart-metadata-in-action-the-social-impact-data-commons-to-the-conference-on-smart-metadata-for-official-statistics-2024",
          title: 'We published our work “Smart Metadata in Action: The Social Impact Data Commons”...',
          description: "",
          section: "News",},{id: "news-i-joined-the-inaugural-class-of-noblereach-scholars",
          title: 'I joined the inaugural class of NobleReach Scholars',
          description: "",
          section: "News",},{id: "projects-ar-sandbox",
          title: 'AR Sandbox',
          description: "Have you ever wanted to play video games with your non-gamer friends?",
          section: "Projects",handler: () => {
              window.location.href = "/projects/ar-sandbox/";
            },},{id: "projects-artificial-reefs",
          title: 'Artificial Reefs',
          description: "Evangelos Pantazis + Iason Pantazis + Alan Wang",
          section: "Projects",handler: () => {
              window.location.href = "/projects/artificial_reefs/";
            },},{id: "projects-force-pedometer",
          title: 'Force Pedometer',
          description: "Your foot, as an interface",
          section: "Projects",handler: () => {
              window.location.href = "/projects/force_pedometer/";
            },},{id: "projects-function-less",
          title: 'Function-less',
          description: "Design exploration with XAtelier Studios",
          section: "Projects",handler: () => {
              window.location.href = "/projects/functionless/";
            },},{id: "projects-garball",
          title: 'Garball',
          description: "Designer for the Palos Verdes Art Center",
          section: "Projects",handler: () => {
              window.location.href = "/projects/garball/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%65%6C%6C%6F@%61%6C%61%6E%77%61%6E%67.%64%65%76", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/alan-wang", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=DMGUJO0AAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
