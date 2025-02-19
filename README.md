# Rick and Morty Character Browser - Frontend Recruitment Task

[Deployed App](https://rickandmortydg.netlify.app/)

## Overview

This project is a Single Page Application (SPA) built with Vue.js and TypeScript, designed as a frontend recruitment task for Digital Colliers. It allows users to browse characters from the popular Rick and Morty series, powered by the [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql). Users can also create and manage a list of their favorite characters, stored locally in their browser.

## Key Features

*   **Browse Rick and Morty Characters:** Displays characters fetched from the Rick & Morty GraphQL API.
*   **Search Functionality:**
    *   Search characters by **Name**.
    *   Search characters by **ID**.
    *   Search characters by **Episode** (displays characters appearing in a specific episode ID).
*   **Favorites List:** Users can add and remove characters from a local "Favorites" list.
*   **Local Storage:** Favorite characters are stored locally in the browser's local storage, ensuring persistence across sessions.
*   **Vue.js 3 & TypeScript:** Built using Vue.js 3 with Composition API and leverages the benefits of TypeScript for type safety and maintainability.
*   **GraphQL API Integration:**  Data fetching is handled efficiently using GraphQL via the Rick & Morty API.
*   **Responsive Design:**  Designed to be responsive and function seamlessly on both mobile and desktop devices.
*   **Netlify Deployment:**  Easily deployed on Netlify using the free "Starter" plan.
*   **Scalability in Mind:**  Architected with scalability in mind, considering potential future expansions and features.
*   **Edge Case Handling:**  Consideration and handling of edge cases and unexpected scenarios.

## Technologies Used

*   **Frontend Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **GraphQL Client:**  [Apollo Client](https://www.apollographql.com/apollo-client/) ([@vue/apollo-composable](https://v4.apollo.vuejs.org/))
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **Deployment:** [Netlify](https://www.netlify.com/)
*   **Styling:** CSS (Custom Styles)
*   **Package Manager:** npm

## Setup Instructions

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [repository-url] # Replace with your repository URL
    cd rick-and-morty-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run serve
    ```

    This will start the development server, and you can view the application in your browser at `http://localhost:8080`.

## Build for Production

To build the application for production, run:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Linting

To lint and fix code style issues:

```bash
npm run lint
```

## Additional Scores (Recruitment Task Specific)

*   **Utilizing Vue 3 Composition API:**  Employed the latest Vue.js Composition API for a more organized and efficient component logic.
*   **Implementing TypeScript:**  Used TypeScript throughout the project, showcasing strong typing and improved code maintainability.
*   **Clean and Well-Structured Code:**  Focused on writing clean, readable, and well-commented code, adhering to best practices.
*   **Thorough Error Handling:** Implemented error handling for API requests and user interactions to provide a robust user experience.
*   **Responsiveness and Accessibility Considerations:** Designed the application to be responsive and considered basic web accessibility principles.

## Author

[Artur Drażyk](https://www.linkedin.com/in/artur-dra%C5%BCyk-a45465351/)

## License

MIT License
