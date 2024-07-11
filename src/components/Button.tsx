import { clsx } from "clsx";
import { createContext, ReactNode, useContext } from "react";
import { ActivityIndicator, Text, TextProps, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Variants = 'primary' | 'secondary'

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants
  isLoading?: boolean
}

const ThemeContext = createContext<{ variant?: Variants }>({})

function Button ({ variant = 'primary', isLoading = false, children, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity 
      className={clsx(
        "w-full h-11 flex-row items-center justfy-center rounded-lg gap-2",
        {
          "bg-lime-300": variant === 'primary',
          "bg-zinc-800":  variant === 'secondary'
        }
      )}
      activeOpacity={0.7}
    {...rest}>
      <ThemeContext.Provider value={{ variant }} >
        {!isLoading ? children : <ActivityIndicator className="text-lime-950" />}
      </ThemeContext.Provider>
    </TouchableOpacity>
  )
}

function Title ({ children }: TextProps) {
  const { variant } = useContext(ThemeContext)

  return(
    <Text className={clsx(
      "text-base font-semibold",
      {
        "text-lime-950": variant === 'primary',
        "text-zinc-200":  variant === 'secondary'
      }
    )}>
      {children}
    </Text>
  )
}

Button.Title = Title

export { Button }