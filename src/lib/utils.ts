import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind 类名的工具函数
 * 解决类名冲突并支持条件渲染
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
