export interface IPoseValue {
  label: string
  value: number
  unit: string
}

export interface ICameraCardProps {
  /** MJPEG stream URL (e.g. from web_video_server) once the Kinect feed exists. */
  src?: string
  onReconnect?: () => void
}
