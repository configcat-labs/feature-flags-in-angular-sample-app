# Using Feature Flags in an Angular Application

**[Read the blog post here](https://configcat.com/blog/2022/08/09/using-feature-flags-in-angular/)**

The app is a simple page that enables users to vote on a photo by assigning a number from 1 to 10. Using [ConfigCat's](https://configcat.com/) feature flag services, the application contains a feature flag that is meant to enable and disable the voting feature. When disabled, users see an error message.

## Build & Run

### Prerequisites

- [Node.js](https://nodejs.org/en/) and [node package manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Basic knowledge of HTML, CSS, and JavaScript
- A code editor installed - For example: [Visual Studio Code](https://code.visualstudio.com/)

### Build and Run

1. Clone this repository:

```sh
git clone git@github.com:configcat-labs/feature-flags-in-angular-sample-app.git
```

2. Open a terminal at the root of the cloned repository and install the dependencies:

```sh
npm i
```

3. Add your ConfigCat SDK and feature flag key to `src/app/app.component.ts`.

4. Launch the app in your browser with:

```sh
npm run start
```

## Learn more

Useful links to technical resources.

- [Angular Website](https://angular.dev/)
- [Learn Angular](https://angular.dev/tutorials/learn-angular)

[**ConfigCat**](https://configcat.com) also supports many other frameworks and languages. Check out the full list of supported SDKs [here](https://configcat.com/docs/sdk-reference/overview/).

You can also explore other code samples for various languages, frameworks, and topics here in the [ConfigCat labs](https://github.com/configcat-labs) on GitHub.

Keep up with ConfigCat on [X](https://x.com/configcat), [Facebook](https://www.facebook.com/configcat), [LinkedIn](https://www.linkedin.com/company/configcat/), and [GitHub](https://github.com/configcat).

## Author

[Roxana Halati](https://github.com/roxanahalati)

## Contributions

Contributions are welcome!
