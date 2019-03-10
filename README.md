# Marfeel

A test application for Marfeel. The goal of the application is to create a reusable component according to the design provided.

## Instructions

#### Install

`npm install`

#### Launch

`npm start`

#### Test

`npm test`

## Architecture

MVC (Model, View, Controller) - is the architecture chosen for this project which ensures the separation of concerns. Thus our logic is separated from the views.

Nevertheless, while the main logic of the application is implemented with MVC, the project also incorporates reusable web component pattern. The widget component is created as a custom component therefore can be re-used simply using HTML tag assigned.

The widget incorporates a line graph and a pie chart. The library for creating these charts is d3.js. The component takes in an array with mocked data and automatically generates two graphs within each other.

Since the logic of the component and the view resides within the component itself the model for Widget is only responsible for generating the data. However, if there were any future developments the model could be used to place the logic that could be passed through the controller to the view.

## Entry point

`http://localhost:8080/`


## Testing

The application tested with:

- Mocha
- Showroom

Since we are testing web components we need a suite for testing web components that can provide a browser-based testing environment. The Showroom is a lightweight testing helper that helps test web components.

The test that include the web component failed to be tested because of the suite fails to resolve the 'd3' import. Given more time if there were more errors regarding the imports - WCT (web-component-tester) would be the second option which is more heavier however fully configured out of box.

## Future improvements

- improve margin computations
- improve responsiveness
- add more configurations to the test suite
