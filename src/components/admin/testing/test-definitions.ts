import { authTests } from "./categories/auth-tests";
import { eventTests } from "./categories/event-tests";
import { uiTests } from "./categories/ui-tests";
import { systemTests } from "./categories/system-tests";

export const tests = [
  ...authTests,
  ...eventTests,
  ...uiTests,
  ...systemTests
];