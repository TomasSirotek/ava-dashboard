import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "@/features/theme/theme.context"

// Toasts use the app's popover colours, radius and Poppins type scale; only the icon carries the status colour
// (same colours as the system log levels). Sonner's own CSS is unlayered, so the overrides need `!`.
function Toaster(props: ToasterProps) {
  const { theme } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "font-sans! shadow-lg!",
          title: "text-sm! font-medium!",
          description: "text-xs! text-muted-foreground!",
          success: "[&_[data-icon]]:text-green-600! dark:[&_[data-icon]]:text-green-400!",
          info: "[&_[data-icon]]:text-sky-500! dark:[&_[data-icon]]:text-sky-400!",
          warning: "[&_[data-icon]]:text-amber-600! dark:[&_[data-icon]]:text-amber-400!",
          error: "[&_[data-icon]]:text-destructive!",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
