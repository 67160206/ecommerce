import * as React from 'react'
import { cn, STATUS } from '@/lib/utils'
type V = 'outline' | 'danger'
export const btn = (v?: V, c?: string) => cn('inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40', v === 'outline' && 'border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100', v === 'danger' && 'bg-red-600', c)
export function Button({ variant, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V }) { return <button className={btn(variant, className)} {...p} /> }
const fld = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm'
export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(fld, p.className)} />
export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(fld, p.className)} />
export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(fld, p.className)} />
export const Label = ({ children }: { children: React.ReactNode }) => <label className="mb-1 mt-3 block text-sm text-slate-500">{children}</label>
export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div {...p} className={cn('rounded-xl border border-slate-200 bg-white p-4', className)} />
const tone: Record<string, string> = { PENDING: 'bg-amber-400 text-slate-900', PAID: 'bg-brand text-white', SHIPPED: 'bg-sky-500 text-white', DELIVERED: 'bg-emerald-600 text-white', CANCELLED: 'bg-red-600 text-white', LOW: 'bg-red-600 text-white', OK: 'bg-emerald-600 text-white' }
export const Badge = ({ k, children }: { k: string; children: React.ReactNode }) => <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-semibold', tone[k])}>{children}</span>
export const StatusBadge = ({ s }: { s: string }) => <Badge k={s}>{STATUS[s]}</Badge>
export const Table = ({ children }: { children: React.ReactNode }) => <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full whitespace-nowrap text-left text-sm [&_td]:p-3 [&_th]:p-3 [&_th]:font-semibold [&_th]:text-slate-500 [&_tr]:border-b">{children}</table></div>
export const Pimg = ({ src, className }: { src: string; className?: string }) => /^(https?:|\/)/.test(src)
  ? <img src={src} alt="" className={cn('object-cover', className)} />
  : <span className={cn('grid place-items-center bg-sky-50 text-5xl', className)}>{src}</span>
