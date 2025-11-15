import type { FC } from 'react'

type Form = ('W' | 'D' | 'L')[]

const FormDots: FC<{ form: Form }> = ({ form }) => {
  return (
    <div className="flex gap-1">
      {form.map((f, i) => {
        const bg = f === 'W' ? 'bg-green-500' : f === 'D' ? 'bg-yellow-400' : 'bg-red-500'
        return (
          <div key={i} className={`${bg} w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold`}>{f}</div>
        )
      })}
    </div>
  )
}

export default FormDots
