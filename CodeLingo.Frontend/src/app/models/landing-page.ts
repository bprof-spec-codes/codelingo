/**
 * Interfaces for landing page content and configuration
 */

/**
 * Represents a feature card displayed on the landing page
 */
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

/**
 * Represents a step in the getting started section
 */
export interface GettingStartedStep {
  number: number;
  title: string;
  description: string;
}

/**
 * Component state for loading and error handling
 */
export interface ComponentState {
  isLoading: boolean;
  error: string | null;
}
