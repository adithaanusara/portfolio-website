const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}

export default function Container({ size = 'lg', className = '', children }) {
  return <div className={`mx-auto w-full px-5 sm:px-8 ${sizes[size]} ${className}`}>{children}</div>
}
