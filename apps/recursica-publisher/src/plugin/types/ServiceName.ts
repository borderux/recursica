import { services } from "../services";

/**
 * ServiceName type - automatically derived from the services map
 * This type is automatically updated when services are added/removed from services/index.ts
 */
export type ServiceName = keyof typeof services;

/**
 * ServiceName enum-like object for runtime usage
 * Automatically generated from the services map - no manual updates needed!
 * Provides autocomplete and type safety at runtime
 */
export const ServiceName = Object.keys(services).reduce(
  (acc, key) => {
    const serviceName = key as ServiceName;
    acc[serviceName] = serviceName;
    return acc;
  },
  {} as Record<ServiceName, ServiceName>,
);
