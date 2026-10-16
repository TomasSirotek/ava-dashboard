export interface IBrand {
  name: string
  subtitle: string
}

export interface IExternalLink {
  href: string
  label: string
}

export interface IAppLogoProps {
  /** Size and colour overrides; defaults to 28 px tall in the foreground colour. */
  className?: string
}
