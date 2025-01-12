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
    name: "Form validation presence",
    category: "ui",
    run: async () => {
      const forms = document.querySelectorAll('form');
      if (forms.length === 0) {
        throw new Error("No forms found in the application");
      }
      
      let hasValidation = false;
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], [aria-required="true"]');
        if (inputs.length > 0) hasValidation = true;
      });
      
      if (!hasValidation) {
        throw new Error("Form validation attributes not found");
      }
    }
  }
];