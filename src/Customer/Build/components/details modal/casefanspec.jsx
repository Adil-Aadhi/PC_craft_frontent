import { SpecGrid, SpecItem } from "./SpecUI";

const CaseFanSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Size" value={component.fan_size} />
    <SpecItem label="RPM" value={component.rpm} />
    <SpecItem label="RGB" value={component.has_rgb ? "Yes" : "No"} />
    {component.description && (
      <SpecItem label="Description" value={component.description} />
    )}
  </SpecGrid>
);

export default CaseFanSpec;