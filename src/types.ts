/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = "landing" | "briefing" | "terminal" | "evidence" | "interrogation";

export interface Evidence {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "document" | "photo" | "object" | "digital" | "statement";
  unlocked: boolean;
  requiresPincode?: string;
  sent?: boolean;
  parentClueId?: string;
  phase?: number;
}
