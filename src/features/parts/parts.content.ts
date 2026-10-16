import type { IPart, IPartCategoryItem } from "@/features/parts/parts.interface"
import { JOINT_NAMES, JOINT_SERVOS } from "@/features/robot/robot.content"

export const PART_CATEGORIES: IPartCategoryItem[] = [
  { value: "all", label: "All" },
  { value: "servo", label: "Servos" },
  { value: "controller", label: "Control" },
  { value: "power", label: "Power" },
]

// Servo data matches the simulation and tools/torque_monitor.py (docs/electronics/design_proposal.md for the build).
const SERVO_CATALOGUE: Record<string, Pick<IPart, "image" | "specs">> = {
  MG996R: {
    image: "parts/mg996.webp",
    specs: [
      { label: "Supply", value: "4.8 – 7.2 V" },
      { label: "Stall torque", value: "11 kg·cm @ 6 V" },
      { label: "Speed", value: "0.17 s / 60°" },
      { label: "Stall current", value: "2.5 A" },
      { label: "Gears", value: "Metal" },
      { label: "Weight", value: "55 g" },
    ],
  },
  SG90: {
    image: "parts/sg90.webp",
    specs: [
      { label: "Supply", value: "4.8 – 6 V" },
      { label: "Stall torque", value: "1.6 kg·cm @ 6 V" },
      { label: "Speed", value: "0.1 s / 60°" },
      { label: "Stall current", value: "0.65 A" },
      { label: "Gears", value: "Plastic" },
      { label: "Weight", value: "9 g" },
    ],
  },
}

// One servo per joint, PCA9685 channel = joint index; all run from the 6.0 V servo rail.
const SERVOS: IPart[] = JOINT_SERVOS.map((model, i) => ({
  id: `servo-j${i + 1}`,
  name: model,
  kind: `Servo · J${i + 1} ${JOINT_NAMES[i]} · ch ${i}`,
  category: "servo",
  ...SERVO_CATALOGUE[model],
}))

// The minimal build: six servos, the controller pair and the servo power supply.
export const PARTS: IPart[] = [
  ...SERVOS,
  {
    id: "esp32",
    name: "ESP32-C3-DevKitM-1",
    kind: "Microcontroller · USB serial to the PCA9685",
    category: "controller",
    image: "parts/esp32.webp",
    specs: [
      { label: "Supply", value: "5 V USB / 3.3 V logic" },
      { label: "CPU", value: "RISC-V 160 MHz" },
      { label: "Wireless", value: "Wi-Fi · Bluetooth LE" },
      { label: "I2C", value: "SDA GPIO0 · SCL GPIO1" },
      { label: "Flash", value: "4 MB" },
    ],
  },
  {
    id: "pca9685",
    name: "PCA9685",
    kind: "Servo driver · 16 channels",
    category: "controller",
    specs: [
      { label: "Logic", value: "3.3 V from the ESP32" },
      { label: "Servo rail (V+)", value: "6.0 V" },
      { label: "PWM", value: "12-bit · 50 Hz" },
      { label: "I2C address", value: "0x40" },
      { label: "Channels used", value: "0 – 5" },
    ],
  },
  {
    id: "xl4016",
    name: "XL4016E1",
    kind: "Step-down · 24 V to 6.0 V servo rail",
    category: "power",
    specs: [
      { label: "Input", value: "24 V adapter (2 A)" },
      { label: "Output", value: "6.0 V, set by trimmer" },
      { label: "Max current", value: "8 A (5 A continuous)" },
      { label: "Switch", value: "On the 24 V side" },
    ],
  },
]
