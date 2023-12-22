import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import ReactWrapper from "enzyme/ReactWrapper";

jest.mock("i18next", () => ({
  createInstance: () => {
    return {
      use: () => {
        return { init: jest.fn() };
      },
      t: (key) => key,
    };
  },
}));

// mock the hook (used like so in components :
// const { t } = useTranslation(namespaces);
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

jest.mock("axios", () => {
  const getMock = jest.fn().mockImplementation((endpoint, params) => {
    console.log(endpoint, params);
    console.log("get");
    Promise.reject("this needs to be mocked");
  });
  const postMock = jest.fn().mockImplementation((endpoint, params) => {
    console.log(endpoint, params);
    Promise.reject("this needs to be mocked");
  });
  const putMock = jest.fn().mockImplementation((endpoint, params) => {
    console.log(endpoint, params);
    Promise.reject("this needs to be mocked");
  });
  const deleteMock = jest.fn().mockImplementation((endpoint, params) => {
    console.log(endpoint, params);
    Promise.reject("this needs to be mocked");
  });

  return {
    get: getMock,
    post: postMock,
    put: putMock,
    delete: deleteMock,
    defaults: {},
  };
});

// TODO: Clean up most of these as they aren't needed
// For testing-library

const getClientEnvironment = require("./config/env");

getClientEnvironment(".");

configure({ adapter: new Adapter() });

ReactWrapper.prototype.retrieveTestId = function (testID) {
  return this.find(`[data-testid="${testID}"]`);
};

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: (prop) => {
      if (prop === "height") {
        return 200;
      } else {
        return "";
      }
    },
  }),
});

Object.defineProperty(window, "location", {
  value: {
    href: "test",
    reload: jest.fn(),
    replace: jest.fn(),
  },
});

Object.defineProperty(window, "open", {
  value: (endpoint) => {
    window.location.href = endpoint;
  },
});

Object.defineProperty(document, "querySelector", {
  value: () => {
    return {
      getAttribute: () => {},
      appendChild: () => {},
    };
  },
});

// These fail tests if a warning message or error message
// is present.

let error = console.error;
let warn = console.warn;

console.error = function (message) {
  error.apply(console, arguments); // keep default behaviour
  throw message instanceof Error ? message : new Error(message);
};

console.warn = function (message) {
  warn.apply(console, arguments); // keep default behaviour
  throw message instanceof Error ? message : new Error(message);
};
