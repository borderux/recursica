/**
 * Type definitions for plugin messages
 */

export interface SendMessage {
  type: string;
  data: Record<string, unknown>;
  requestId?: string;
}

export interface ResponseMessage {
  type: string;
  success: boolean;
  error: boolean;
  message: string;
  data: Record<string, unknown>;
  requestId?: string;
}

export type PluginMessage = SendMessage;
export type PluginResponse = ResponseMessage;
