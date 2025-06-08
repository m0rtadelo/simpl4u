# Simpl4u

Simpl4u is a modular framework designed to simplify the development of [electron](https://www.electronjs.org) and web applications. It provides reusable components, services, and utilities to streamline the creation of dynamic and interactive user interfaces.
It uses webcomponents to encapsulate the code and allow reutilization and bootstrap.

> WIP: Work In Progress

> POC: Proof of concept

## Features

- **Custom Web Components**: Includes a library of reusable components such as tables, forms, buttons, and more.
- **Reactive State Management**: Built-in support for reactive state management using `SimplModel`.
- **Localization**: Multi-language support with `LanguageService`.
- **Theme Management**: Dynamic light/dark theme switching with `ThemeService`.
- **CRUD Operations**: Simplified CRUD functionality with `SimplCrud` and `SimplTable`.
- **Works with bootstrap**: Designed to work with [bootstrap](https://getbootstrap.com)
- **Modals**: Easy-to-use modal dialogs with `ModalService`.
- **Storage**: Persistent and session storage management with `StorageService`.
- **Routing**: Hash-based routing with `RouterService`.
- **Spinner**: Display loading spinners with `SpinnerService`.

## Getting Started

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Lint the Code**:
   Run the linter to check for code quality:
   ```sh
   npm run lint
   ```

3. **Fix Lint Issues**:
   Automatically fix linting issues:
   ```sh
   npm run lint:fix
   ```

## Usage

- **Custom Components**: Use components like `<simpl-table>`, `<simpl-input>`, and `<simpl-crud>` to build your UI.
- **Localization**: Add translations in the `apps/test/assets/i18n` directory.
- **State Management**: Use `SimplModel` to manage application state reactively.
- **Routing**: Define views and navigate using `RouterService`.
- **Backend**: The backend server is located in the `backend/server` directory and uses MongoDB for data storage. Ensure MongoDB is running before starting the server.

## Builtin components

- **`<simpl-table>`**: A customizable table component for displaying tabular data.
  - **Properties**:
    - `actions`: A string defining the available actions (e.g., "crud").
    - `name`: The name of the table model.
    - `context`: The context for state management.

- **`<simpl-input>`**: A reusable input component with validation and binding capabilities.
  - **Properties**:
    - `name`: The name of the input field.
    - `type`: The type of the input (default: "text").
    - `required`: Marks the input as required.
    - `disabled`: Disables the input field.

- **`<simpl-crud>`**: A component for creating, reading, updating, and deleting records.
  - **Properties**:
    - `actions`: A string defining the available actions (e.g., "crude").
    - `headers`: An array of column headers.
    - `form`: A definition of the form fields.

- **`<simpl-spinner>`**: A spinner component to indicate loading states.
  - **Properties**:
    - None.

- **`<simpl-button>`**: A button component with customizable styles and actions.
  - **Properties**:
    - `type`: The button style (e.g., "primary", "secondary").
    - `title`: The text displayed on the button.

- **`<simpl-textarea>`**: A textarea component for multi-line text input.
  - **Properties**:
    - `name`: The name of the textarea field.
    - `rows`: The number of rows (default: 3).
    - `required`: Marks the textarea as required.
    - `disabled`: Disables the textarea.

- **`<simpl-switch>`**: A toggle switch component.
  - **Properties**:
    - `name`: The name of the switch field.
    - `required`: Marks the switch as required.
    - `disabled`: Disables the switch.

- **`<simpl-select>`**: A dropdown select component.
  - **Properties**:
    - `name`: The name of the select field.
    - `items`: An array of options in the format `{ id, text }`.
    - `required`: Marks the select as required.
    - `disabled`: Disables the select.

- **`<simpl-progress>`**: A progress bar component.
  - **Properties**:
    - `name`: The name of the progress field.
    - `hidden`: Hides the progress bar.

- **`<simpl-navbar>`**: A navigation bar component.
  - **Properties**:
    - `items`: An array of navigation items in the format `{ id, name }`.
    - `hideLang`: Hides the language dropdown.
    - `hideTheme`: Hides the theme switcher.

- **`<simpl-file>`**: A file input component.
  - **Properties**:
    - `name`: The name of the file input field.
    - `multiple`: Allows multiple file selection.
    - `required`: Marks the file input as required.
    - `disabled`: Disables the file input.

- **`<simpl-date>`**: A date picker component.
  - **Properties**:
    - `name`: The name of the date field.
    - `required`: Marks the date picker as required.
    - `disabled`: Disables the date picker.

- **`<simpl-color>`**: A color picker component.
  - **Properties**:
    - `name`: The name of the color picker field.
    - `required`: Marks the color picker as required.
    - `disabled`: Disables the color picker.

## License

This project is licensed under the MIT License.
