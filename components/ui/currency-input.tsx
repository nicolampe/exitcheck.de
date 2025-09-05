import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number
  onChange: (value: string) => void
  className?: string
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Die interne Darstellung des Werts ohne Formatierung
    const [displayValue, setDisplayValue] = React.useState<string>("")

    // Aktualisiere die Anzeige, wenn sich der übergebene Wert ändert
    React.useEffect(() => {
      if (value) {
        const numericValue = value.toString().replace(/\D/g, '')
        setDisplayValue(formatCurrencyForDisplay(numericValue))
      } else {
        setDisplayValue("")
      }
    }, [value])

    // Formatiert den Wert für die Anzeige (mit Tausenderpunkten und €-Symbol)
    const formatCurrencyForDisplay = (numericValue: string): string => {
      if (!numericValue) return ""
      
      // Neue Formatierung mit deutschem Format und Euro-Symbol
      const number = parseInt(numericValue, 10)
      if (isNaN(number)) return ""
      
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(number)
    }

    // Behandelt Änderungen der Eingabe
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Entferne alles außer Zahlen
      const inputValue = e.target.value.replace(/[^0-9]/g, '')
      
      // Ruft den übergebenen onChange-Handler mit dem gereinigten Wert auf
      onChange(inputValue)
      
      // Aktualisiere die formatierte Anzeige
      setDisplayValue(formatCurrencyForDisplay(inputValue))
    }

    // Behandelt Fokus auf dem Eingabefeld - zeigt nur Zahlen an
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Zeigt nur die Zahlen ohne Formatierung an, wenn der Benutzer tippt
      const numericValue = value ? value.toString().replace(/\D/g, '') : ""
      e.target.value = numericValue
      if (props.onFocus) props.onFocus(e)
    }

    // Behandelt Verlust des Fokus - stellt die Formatierung wieder her
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/\D/g, '')
      setDisplayValue(formatCurrencyForDisplay(numericValue))
      if (props.onBlur) props.onBlur(e)
    }

    return (
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn("text-left text-base font-medium", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }