// tslint:disable-next-line:no-var-requires
import TSConsoleReporter from "jasmine-ts-console-reporter";
// const TSConsoleReporter = require("jasmine-ts-console-reporter");

jasmine.getEnv().clearReporters(); // Clear default console reporter
jasmine.getEnv().addReporter(new TSConsoleReporter());
