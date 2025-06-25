import z from "zod"

import { chatMessage } from "./contracts"

export type ValidationError = {
  fields: Record<string, string>
}

export type RequestError = {
  code: string
  description?: string
}

export type Message = z.infer<typeof chatMessage>

export type Metadata = Partial<{
  meal: string
  serving_size: string
  totals: {
    calories_kcal: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }
  per_ingredient: Array<{
    ingredient: string
    amount: string
    calories_kcal: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }>
  notes: string
  disclaimer: string
}>
