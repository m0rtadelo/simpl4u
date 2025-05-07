# Simpl4u

Simpl4u is a modular framework designed to simplify the development of electron and web applications. It provides reusable components, services, and utilities to streamline the creation of dynamic and interactive user interfaces.

> WIP: Work In Progress

## Features

- **Custom Web Components**: Includes a library of reusable components such as tables, forms, buttons, and more.
- **Reactive State Management**: Built-in support for reactive state management using `SimplModel`.
- **Localization**: Multi-language support with `LanguageService`.
- **Theme Management**: Dynamic light/dark theme switching with `ThemeService`.
- **CRUD Operations**: Simplified CRUD functionality with `SimplCrud` and `SimplTable`.
- **Modals**: Easy-to-use modal dialogs with `ModalService`.
- **Storage**: Persistent and session storage management with `StorageService`.
- **Routing**: Hash-based routing with `RouterService`.


## Getting Started

1. **Install Dependencies**:
   Navigate to the `framework` and `apps/test` directories and run:
   ```sh
   npm install
   ```

2. **Run the Application**:
   Navigate to the `apps/test` directory and start the Electron app:
   ```sh
   npm start
   ```

3. **Lint the Code**:
   Run the linter to check for code quality:
   ```sh
   npm run lint
   ```

4. **Fix Lint Issues**:
   Automatically fix linting issues:
   ```sh
   npm run lint:fix
   ```

## Usage

- **Custom Components**: Use components like `<simpl-table>`, `<simpl-input>`, and `<simpl-crud>` to build your UI.
- **Localization**: Add translations in the `apps/test/assets/i18n` directory.
- **State Management**: Use `SimplModel` to manage application state reactively.
- **Routing**: Define views and navigate using `RouterService`.

## License

This project is licensed under the MIT License.
