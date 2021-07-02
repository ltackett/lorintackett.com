export type CloudLayer = {
  src: String;
  width: Number;
  height: Number;
  velocity: Number;
  xStartPos: Number;
}

export type ICloudsProps = {
  layers: CloudLayer[]
}