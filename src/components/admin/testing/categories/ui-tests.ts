
import { TestDefinition } from "../types";

export const uiTests: TestDefinition[] = [
  {
    name: "Navigation menu structure",
    category: "navigation",
    run: async () => {
      const navElement = document.querySelector('nav');
      if (!navElement) {
        throw new Error("Navigation structure not found");
      }
      
      const hasLinks = navElement.querySelectorAll('a').length > 0;
      if (!hasLinks) {
        throw new Error("Navigation menu is empty");
      }
    }
  },
  {
    name: "Responsive design breakpoints",
    category: "ui",
    run: async () => {
      const breakpoints = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      };
      
      const hasBreakpoints = Object.keys(breakpoints).some(breakpoint => 
        document.querySelector(`[class*="${breakpoint}:"]`)
      );
      
      if (!hasBreakpoints) {
        throw new Error("Responsive design breakpoints not implemented");
      }
    }
  },
  {
    name: "Theme consistency",
    category: "ui",
    run: async () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      
      const requiredColors = ['--background', '--foreground', '--primary'];
      const missingColors = requiredColors.filter(color => 
        !style.getPropertyValue(color)
      );
      
      if (missingColors.length > 0) {
        throw new Error(`Missing theme colors: ${missingColors.join(', ')}`);
      }
    }
  }
];
